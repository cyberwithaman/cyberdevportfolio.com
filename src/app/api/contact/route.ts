import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';

// Submit a new contact request
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { name, email, phone, subject, message } = body;
    
    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Create new contact request
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      status: 'new',
      date: new Date().toISOString()
    });
    
    return NextResponse.json(
      { success: true, data: contact },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error submitting contact:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to submit contact request';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Get all contact requests (admin only)
export async function GET() {
  try {
    await connectDB();
    
    // In a real app, you'd add authentication here to verify admin status
    // For now, we'll just fetch all contacts
    
    const contacts = await Contact.find({}).sort({ date: -1 });
    
    return NextResponse.json(
      { success: true, data: contacts },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error fetching contacts:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch contact requests';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 