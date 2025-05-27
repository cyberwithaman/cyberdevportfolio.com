import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

// POST /api/blog - Create a new blog post
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    console.log('Connected to MongoDB for blog creation');
    
    const formData = await req.formData();
    
    // Handle both image file upload and Google image URL
    const imageFile = formData.get('image') as File;
    const googleImageUrl = formData.get('googleImageUrl') as string;
    let imageData = null;
    
    if (imageFile) {
      console.log('Processing image file upload');
      // Create form data for image upload
      const imageFormData = new FormData();
      imageFormData.append('image', imageFile);
      
      // Upload image to the image upload endpoint
      const uploadResponse = await fetch(`${req.nextUrl.origin}/api/upload-image`, {
        method: 'POST',
        body: imageFormData,
      });
      
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        console.error('Image upload failed:', errorData);
        throw new Error(errorData.error || 'Failed to upload image');
      }
      
      const uploadData = await uploadResponse.json();
      console.log('Image upload successful:', uploadData);
      
      imageData = {
        url: uploadData.imageUrl,
        filename: uploadData.fileId,
        contentType: imageFile.type,
        isGoogleImage: false
      };
    } else if (googleImageUrl) {
      console.log('Using Google image URL:', googleImageUrl);
      imageData = {
        url: googleImageUrl,
        filename: `google-image-${Date.now()}`,
        contentType: 'image/jpeg',
        isGoogleImage: true
      };
    } else {
      console.error('No image provided');
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    // Create blog post
    const blogData = {
      title: formData.get('title'),
      content: formData.get('content'),
      excerpt: formData.get('excerpt'),
      category: formData.get('category'),
      status: formData.get('status'),
      slug: formData.get('slug'),
      tags: JSON.parse(formData.get('tags') as string),
      author: JSON.parse(formData.get('author') as string),
      image: imageData
    };

    console.log('Creating blog post with data:', {
      ...blogData,
      content: typeof blogData.content === 'string' ? blogData.content.substring(0, 100) + '...' : '...' // Log only first 100 chars of content
    });

    const newPost = await Blog.create(blogData);
    console.log('Blog post created successfully:', newPost._id);

    return NextResponse.json(newPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Error creating blog post: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

// GET /api/blog - Get all blog posts
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    console.log('Connected to MongoDB for blog fetch');
    
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');

    // Build query
    const query: Record<string, string> = {};
    if (slug) {
      query.slug = slug;
    }
    if (category) {
      query.category = category;
    }

    console.log('Fetching blog posts with query:', query);
    const posts = await Blog.find(query).sort({ date: -1 });
    console.log(`Found ${posts.length} blog posts`);

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Error fetching blog posts: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
} 