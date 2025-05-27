import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

// Helper function to handle image upload
async function saveImage(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
  const filename = `${file.name.split('.')[0]}-${uniqueSuffix}${path.extname(file.name)}`;
  const filepath = path.join(process.cwd(), 'public/uploads', filename);

  await writeFile(filepath, buffer);
  return {
    filename,
    contentType: file.type,
    url: `/uploads/${filename}`
  };
}

// Helper function to delete image
async function deleteImage(filename: string) {
  try {
    const filepath = path.join(process.cwd(), 'public/uploads', filename);
    await unlink(filepath);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
}

// GET /api/blog/[id] - Get a single blog post
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    await connectDB();
    const post = await Blog.findById(id);
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/blog/[id] - Update a blog post
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    await connectDB();
    const formData = await request.formData();
    
    const post = await Blog.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if the new slug is different and already exists
    const newSlug = formData.get('slug') as string;
    if (newSlug !== post.slug) {
      const existingPost = await Blog.findOne({ slug: newSlug, _id: { $ne: id } });
      if (existingPost) {
        return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 400 });
      }
    }

    // Handle image upload if new image is provided
    const imageFile = formData.get('image') as File;
    let imageData = post.image;
    
    if (imageFile) {
      // Delete old image if it exists
      if (post.image?.filename) {
        await deleteImage(post.image.filename);
      }
      imageData = await saveImage(imageFile);
    }

    // Update blog post
    const blogData = {
      title: formData.get('title'),
      content: formData.get('content'),
      excerpt: formData.get('excerpt'),
      category: formData.get('category'),
      status: formData.get('status'),
      slug: newSlug,
      tags: JSON.parse(formData.get('tags') as string),
      author: JSON.parse(formData.get('author') as string),
      image: imageData
    };

    const updatedPost = await Blog.findByIdAndUpdate(id, blogData, { new: true });
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/blog/[id] - Delete a blog post
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    await connectDB();
    const post = await Blog.findById(id);
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Delete associated image if it exists
    if (post.image?.filename) {
      await deleteImage(post.image.filename);
    }

    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 