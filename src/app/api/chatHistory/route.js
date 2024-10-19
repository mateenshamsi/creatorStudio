import { NextResponse } from 'next/server';
import chatHistory from '@/models/index';
import { connectDB } from '@/libs/db';

// POST - Create a new chat history record
export async function POST(request) {
  try {
    const { userId, topic, messages, startTime, endTime } = await request.json();
    await connectDB();
    const newChatHistory = await chatHistory.create({
      userId,
      topic,
      messages,
      startTime,
      endTime,
    });

    return NextResponse.json({message:"History added" ,success: true, data: newChatHistory });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create chat history' });
  }
}

// GET - Fetch all chat history
export async function GET() {
  try {
    await connectDB();
    const histories = await chatHistory.find({});
    return NextResponse.json({ success: true, data: histories });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch chat histories' });
  }
}
