import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';

export async function DELETE(request: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Extract ID from URL path
    const { pathname } = new URL(request.url);
    const id = pathname.split('/').pop() || '';
    
    if (!id) {
      return NextResponse.json(
        { error: 'Subscriber ID is required' },
        { status: 400 }
      );
    }

    // Find and delete the newsletter subscription
    const deletedSubscriber = await Newsletter.findByIdAndDelete(id);

    if (!deletedSubscriber) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Subscriber deleted successfully',
    });
  } catch (error) {
    console.error('Newsletter deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 