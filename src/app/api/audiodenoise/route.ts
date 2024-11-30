import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Forward the request to Flask backend
    const flaskFormData = new FormData();
    flaskFormData.append('file', file);

    const flaskResponse = await fetch('http://127.0.0.1:5000/denoise', {
      method: 'POST',
      body: flaskFormData,
    });

    if (!flaskResponse.ok) {
      throw new Error('Flask server error');
    }

    // Get the denoised audio file
    const denoisedAudio = await flaskResponse.blob();

    // Return the processed audio file
    return new NextResponse(denoisedAudio, {
      headers: {
        'Content-Type': denoisedAudio.type,
        'Content-Disposition': 'attachment; filename=denoised_audio.wav',
      },
    });
  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.json(
      { error: 'Failed to process audio' },
      { status: 500 }
    );
  }
}