import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ProjectRequest from '@/models/ProjectRequest';
import mongoose from 'mongoose';

// GET a single project request by ID
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Extract ID from URL path
    const { pathname } = new URL(request.url);
    const id = pathname.split('/').pop() || '';
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid project request ID' },
        { status: 400 }
      );
    }
    
    const projectRequest = await ProjectRequest.findById(id);
    
    if (!projectRequest) {
      return NextResponse.json(
        { error: 'Project request not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ request: projectRequest }, { status: 200 });
  } catch (error) {
    console.error('Error fetching project request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project request' },
      { status: 500 }
    );
  }
}

// PUT update a project request by ID
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    // Extract ID from URL path
    const { pathname } = new URL(request.url);
    const id = pathname.split('/').pop() || '';
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid project request ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    const updatedRequest = await ProjectRequest.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!updatedRequest) {
      return NextResponse.json(
        { error: 'Project request not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ request: updatedRequest }, { status: 200 });
  } catch (error) {
    console.error('Error updating project request:', error);
    return NextResponse.json(
      { error: 'Failed to update project request' },
      { status: 500 }
    );
  }
}

// DELETE a project request by ID
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    // Extract ID from URL path
    const { pathname } = new URL(request.url);
    const id = pathname.split('/').pop() || '';
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid project request ID' },
        { status: 400 }
      );
    }
    
    const deletedRequest = await ProjectRequest.findByIdAndDelete(id);
    
    if (!deletedRequest) {
      return NextResponse.json(
        { error: 'Project request not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Project request deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting project request:', error);
    return NextResponse.json(
      { error: 'Failed to delete project request' },
      { status: 500 }
    );
  }
} 