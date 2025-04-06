// src/app/api/sendMessage/route.ts
import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { getModelMetadata } from '@/types/model'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: Request) {
  const formData = await req.formData()
  const modelId = formData.get('model') as string
  const metadata = getModelMetadata(modelId)

  try {
    // Handle different model types
    switch(metadata.category) {
      case 'audio-transcription':
        const audioFile = formData.get('file') as Blob
        const transcription = await groq.audio.transcriptions.create({
          file: new File([audioFile], 'audio.mp3'),
          model: modelId,
        })
        return NextResponse.json({ text: transcription.text })

      case 'text-to-speech':
        const text = formData.get('text') as string
        const speech = await groq.audio.speech.create({
          input: text,
          voice: 'alloy', // Default voice
          model: modelId,
        })
        // Return as binary audio data
        return new Response(await speech.arrayBuffer(), {
          headers: { 
            'Content-Type': 'audio/mpeg',
            'Content-Disposition': 'inline'
          }
        })

      case 'vision':
        const imageFile = formData.get('file') as Blob
        const prompt = formData.get('message') as string
        
        const base64Image = await fileToBase64(imageFile)
        
        const visionResponse = await groq.chat.completions.create({
          messages: [{
            role: "user",
            content: [
              { type: "text", text: prompt },
              { 
                type: "image_url", 
                image_url: {
                  url: base64Image
                }
              }
            ]
          }],
          model: modelId,
          temperature: 0.7,
          max_tokens: 1024
        })

        return NextResponse.json({
          text: visionResponse.choices[0]?.message?.content,
          visionResponse: visionResponse // Include full response if needed
        })

      default: // Standard chat models
        const message = formData.get('message') as string
        const chatResponse = await groq.chat.completions.create({
          messages: [{ role: "user", content: message }],
          model: modelId,
        })
        return NextResponse.json(chatResponse)
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// Helper function
async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = Buffer.from(await blob.arrayBuffer())
  return `data:${blob.type};base64,${buffer.toString('base64')}`
}

function fileToBase64(imageFile: Blob) {
  throw new Error('Function not implemented.')
}
