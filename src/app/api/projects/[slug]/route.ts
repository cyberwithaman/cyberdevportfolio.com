import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import slugify from 'slugify';

// GET a single project by slug
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Extract slug from URL path
    const { pathname } = new URL(request.url);
    const slug = pathname.split('/').pop() || '';
    
    const project = await Project.findOne({ slug });
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT update a project by slug
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    // Extract slug from URL path
    const { pathname } = new URL(request.url);
    const slug = pathname.split('/').pop() || '';
    
    const body = await request.json();
    
    // If title is changing, create a new slug
    let newSlug = slug;
    if (body.title) {
      newSlug = slugify(body.title, { lower: true, strict: true });
      
      // If slug is changing, check for uniqueness
      if (newSlug !== slug) {
        const existingProject = await Project.findOne({ slug: newSlug });
        if (existingProject) {
          return NextResponse.json(
            { error: 'A project with this title already exists' },
            { status: 400 }
          );
        }
      }
    }
    
    // Include the new slug in the update
    const updatedProject = await Project.findOneAndUpdate(
      { slug },
      { ...body, slug: newSlug },
      { new: true, runValidators: true }
    );
    
    if (!updatedProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ project: updatedProject }, { status: 200 });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE a project by slug
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    // Extract slug from URL path
    const { pathname } = new URL(request.url);
    const slug = pathname.split('/').pop() || '';
    
    const deletedProject = await Project.findOneAndDelete({ slug });
    
    if (!deletedProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
} 