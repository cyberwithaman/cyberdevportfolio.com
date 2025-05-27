import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ProjectRequest from '@/models/ProjectRequest';

// GET all project requests
export async function GET() {
  try {
    await connectDB();
    const requests = await ProjectRequest.find({}).sort({ date: -1 });
    
    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error('Error fetching project requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project requests' },
      { status: 500 }
    );
  }
}

// POST create a new project request
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, email, phone, projectType, description } = body;
    
    // Validate required fields
    if (!name || !email || !phone || !projectType || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create new project request
    const newRequest = await ProjectRequest.create({
      name,
      email,
      phone,
      projectType,
      description,
      date: new Date().toISOString().split('T')[0],
      status: 'new'
    });
    
    return NextResponse.json({ request: newRequest }, { status: 201 });
  } catch (error) {
    console.error('Error creating project request:', error);
    return NextResponse.json(
      { error: 'Failed to create project request' },
      { status: 500 }
    );
  }
} 