import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

export async function GET() {
  console.log('API route: Fetching models...');
  console.log('GROQ_API_KEY is set:', !!process.env.GROQ_API_KEY);
  try {
    const groq = new Groq();
    console.log('Groq instance created');
    const models = await groq.models.list();
    console.log('Models fetched successfully:', models.data.length);
    return NextResponse.json(models);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Failed to fetch models', details: error.message }, { status: 500 });
  }
}