import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import slugify from 'slugify';

// GET all projects
export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find({}).sort({ date: -1 });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST create a new project
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { 
      title, 
      description, 
      longDescription, 
      technologies, 
      image, 
      imageUrl, 
      features, 
      category, 
      status, 
      date, 
      featured,
      githubUrl,
      tags
    } = body;
    
    // Use imageUrl if provided, otherwise use image
    const projectImage = imageUrl || image;
    
    // Validate required fields
    if (!title || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title and category are required' },
        { status: 400 }
      );
    }

    // Create slug from title
    const slug = slugify(title, { lower: true, strict: true });
    
    // Check if project with same slug already exists
    const existingProject = await Project.findOne({ slug });
    if (existingProject) {
      return NextResponse.json(
        { error: 'A project with this title already exists' },
        { status: 400 }
      );
    }

    // Create new project
    const newProject = await Project.create({
      slug,
      title,
      description: description || '',
      longDescription: longDescription || '',
      technologies: technologies || [],
      image: projectImage || '',
      features: features || [],
      category: category || 'Cyber-Security',
      tags: tags || [],
      status: status || 'Active',
      date: date || new Date().toISOString().split('T')[0],
      featured: featured || false,
      delay: 0.1,
      githubUrl: githubUrl || '',
      imageUrl: imageUrl || ''
    });

    return NextResponse.json({ project: newProject }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
} 