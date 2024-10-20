import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

export async function GET() {
  try {
    console.log('Test API: Creating Groq instance...');
    const groq = new Groq();
    console.log('Test API: Fetching models...');
    const models = await groq.models.list();
    console.log('Test API: Models fetched successfully');
    return NextResponse.json({ success: true, modelCount: models.data.length });
  } catch (error) {
    console.error('Test API: Error:', error);
    return NextResponse.json({ error: 'Failed to fetch models', details: error.message }, { status: 500 });
  }
}