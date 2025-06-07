import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ServiceRequest from '@/models/ServiceRequest';

// Get all service requests (for admin)
export async function GET() {
  try {
    await connectDB();
    
    const serviceRequests = await ServiceRequest.find({})
      .sort({ createdAt: -1 });
    
    return NextResponse.json(
      { success: true, data: serviceRequests },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching service requests:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch service requests' },
      { status: 500 }
    );
  }
}

// Update a service request (for admin)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { id, serviceTitle, name, email, phone, description, status } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Service request ID is required' },
        { status: 400 }
      );
    }
    
    const updatedRequest = await ServiceRequest.findByIdAndUpdate(
      id,
      {
        serviceTitle,
        name,
        email,
        phone,
        description,
        status
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedRequest) {
      return NextResponse.json(
        { success: false, message: 'Service request not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Service request updated successfully', data: updatedRequest },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating service request:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update service request' },
      { status: 500 }
    );
  }
}

// Delete a service request (for admin)
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Service request ID is required' },
        { status: 400 }
      );
    }
    
    const deletedRequest = await ServiceRequest.findByIdAndDelete(id);
    
    if (!deletedRequest) {
      return NextResponse.json(
        { success: false, message: 'Service request not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Service request deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting service request:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete service request' },
      { status: 500 }
    );
  }
} 