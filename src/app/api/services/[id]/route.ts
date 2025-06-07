import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ServiceRequest from '@/models/ServiceRequest';

// Get a single service request by ID
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Extract ID from URL path
    const { pathname } = new URL(request.url);
    const id = pathname.split('/').pop() || '';
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Service request ID is required' },
        { status: 400 }
      );
    }
    
    const serviceRequest = await ServiceRequest.findById(id);
    
    if (!serviceRequest) {
      return NextResponse.json(
        { success: false, message: 'Service request not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, data: serviceRequest },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching service request:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch service request' },
      { status: 500 }
    );
  }
} 