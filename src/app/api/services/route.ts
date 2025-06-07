import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ServiceRequest from '@/models/ServiceRequest';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { serviceTitle, name, email, phone, description } = body;
    
    // Validate required fields
    if (!serviceTitle || !name || !email || !phone || !description) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Create a new service request
    const serviceRequest = await ServiceRequest.create({
      serviceTitle,
      name,
      email,
      phone,
      description,
      status: 'pending'
    });
    
    return NextResponse.json(
      { success: true, message: 'Service request submitted successfully', data: serviceRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting service request:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit service request' },
      { status: 500 }
    );
  }
} 