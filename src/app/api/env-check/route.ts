import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    GROQ_API_KEY_SET: !!process.env.GROQ_API_KEY,
    NODE_ENV: process.env.NODE_ENV
  });
}