// src/app/api/sendMessage/route.ts

import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const upload = multer({ dest: 'uploads/' });

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const formData = await req.formData();
  const message = formData.get('message') as string;
  const model = formData.get('model') as string;
  const file = formData.get('file') as File;

  if (!message || !model) {
    return NextResponse.json({ error: 'Message and model are required' }, { status: 400 });
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const result = await groq.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: model,
      file: file ? file.path : undefined, // Pass the file path if a file is uploaded
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message. Please check your API key and network connection.' }, { status: 500 });
  }
}