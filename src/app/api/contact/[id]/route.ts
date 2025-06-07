import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';

// Common handler for all contact operations
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Extract ID from URL path
    const { pathname } = new URL(request.url);
    const id = pathname.split('/').pop() || '';
    
    // Find the contact
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact request not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, data: contact },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error fetching contact:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch contact request';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    // Extract ID from URL path
    const { pathname } = new URL(request.url);
    const id = pathname.split('/').pop() || '';
    const body = await request.json();
    
    // In a real app, you'd add authentication here to verify admin status
    
    // Find and update the contact
    const contact = await Contact.findByIdAndUpdate(
      id,
      { ...body, lastUpdated: new Date().toISOString() },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact request not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, data: contact },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error updating contact:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update contact request';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    // Extract ID from URL path
    const { pathname } = new URL(request.url);
    const id = pathname.split('/').pop() || '';
    
    // In a real app, you'd add authentication here to verify admin status
    
    // Find and delete the contact
    const contact = await Contact.findByIdAndDelete(id);
    
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact request not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, data: {} },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error deleting contact:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete contact request';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 