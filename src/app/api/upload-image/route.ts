import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// Define a GridFS bucket schema for storing images
let bucket: mongoose.mongo.GridFSBucket;

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectDB();
    console.log('Connected to MongoDB successfully');

    if (!bucket) {
      const db = mongoose.connection.db;
      if (!db) {
        console.error('Database connection not found');
        throw new Error('Database connection not found');
      }
      bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: 'projectImages'
      });
      console.log('GridFS bucket initialized successfully');
    }

    const formData = await request.formData();

    // Check if an external URL is provided
    const externalUrl = formData.get('externalUrl') as string || formData.get('imageUrl') as string;
    if (externalUrl) {
      // Validate that it's actually a URL
      try {
        new URL(externalUrl);
        console.log('Using external URL:', externalUrl);
        // For external URLs, we return directly without storing them
        return NextResponse.json({
          imageUrl: externalUrl,
          isExternal: true,
          message: 'Using external image URL directly'
        });
      } catch {
        console.error('Invalid external URL format:', externalUrl);
        return NextResponse.json(
          { error: 'Invalid external URL format' },
          { status: 400 }
        );
      }
    }

    // Handle file upload if no external URL
    const image = formData.get('image') as File;

    if (!image) {
      console.error('No image or external URL provided');
      return NextResponse.json(
        { error: 'No image or external URL provided' },
        { status: 400 }
      );
    }

    console.log('Processing image:', {
      name: image.name,
      type: image.type,
      size: image.size
    });

    // Check file size (limit to 5MB)
    if (image.size > 5 * 1024 * 1024) {
      console.error('Image size exceeds 5MB:', image.size);
      return NextResponse.json(
        { error: 'Image size exceeds 5MB' },
        { status: 400 }
      );
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(image.type)) {
      console.error('Invalid image type:', image.type);
      return NextResponse.json(
        { error: 'Invalid image type. Supported: JPG, PNG, GIF, WEBP' },
        { status: 400 }
      );
    }

    // Create unique filename
    const fileExtension = image.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    // Convert the file to arrayBuffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log('Starting GridFS upload for file:', fileName);

    // Create upload stream to MongoDB GridFS
    const uploadStream = bucket.openUploadStream(fileName, {
      contentType: image.type,
      metadata: {
        originalName: image.name,
        uploadDate: new Date()
      }
    });

    // Convert Node.js write stream to promise
    const streamPromise = new Promise((resolve, reject) => {
      uploadStream.on('finish', () => {
        console.log('GridFS upload completed for file:', fileName);
        resolve(true);
      });
      uploadStream.on('error', (error) => {
        console.error('GridFS upload error:', error);
        reject(error);
      });
    });

    // Write the buffer to the GridFS stream
    uploadStream.write(buffer);
    uploadStream.end();

    // Wait for the upload to complete
    await streamPromise;

    // Create a URL that will serve this image through the API
    const imageUrl = `/api/images/${uploadStream.id}`;

    console.log('Image upload successful:', {
      fileName,
      fileId: uploadStream.id,
      imageUrl
    });

    return NextResponse.json({
      imageUrl,
      fileId: uploadStream.id.toString(),
      isExternal: false,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Error uploading image: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
} 