import { NextResponse } from 'next/server';
import chatHistory from '@/models';
import { connectDB } from '@/libs/db';

// GET - Get a single chat history by ID
export async function GET(request, { params }) {
  try { 
    const { id }= params;
    await connectDB();
    const history = await chatHistory.findById(id);
    if (!history) {
      return NextResponse.json({ success: false, error: 'Chat history not found' });
    }
    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch chat history' });
  }
}

// DELETE - Delete a chat history by ID
export async function DELETE(request, { params }) {
  try {
    const { id }= params;
    await connectDB();
    const deletedHistory = await chatHistory.findByIdAndDelete(id);
    if (!deletedHistory) {
      return NextResponse.json({ success: false, error: 'Chat history not found' });
    }
    return NextResponse.json({ success: true, data: deletedHistory });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete chat history' });
  }
}
