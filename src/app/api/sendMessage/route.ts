// src/app/api/sendMessage/route.ts

import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
  const { message, model } = await req.json();

  if (!message || !model) {
    return NextResponse.json({ error: 'Message and model are required' }, { status: 400 });
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const result = await groq.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: model
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message. Please check your API key and network connection.' }, { status: 500 });
  }
}