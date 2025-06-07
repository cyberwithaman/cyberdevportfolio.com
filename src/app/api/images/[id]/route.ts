import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

// Define a GridFS bucket for retrieving images
let bucket: mongoose.mongo.GridFSBucket;

export async function GET(request: NextRequest) {
  try {
    // Extract ID from URL path
    const { pathname } = new URL(request.url);
    const id = pathname.split('/').pop() || '';
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid image ID' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();
    
    if (!bucket) {
      const db = mongoose.connection.db;
      if (!db) {
        throw new Error('Database connection not found');
      }
      bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: 'projectImages'
      });
    }

    // Find the file info
    const files = await bucket.find({ _id: new ObjectId(id) }).toArray();
    if (!files.length) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    const file = files[0];

    // Create a download stream
    const downloadStream = bucket.openDownloadStream(new ObjectId(id));
    
    // Collect the file data
    const chunks: Buffer[] = [];
    for await (const chunk of downloadStream) {
      chunks.push(Buffer.from(chunk));
    }
    
    // Combine all chunks
    const buffer = Buffer.concat(chunks);
    
    // Set the appropriate content type
    const contentType = file.contentType || 'application/octet-stream';
    
    // Return the image as a response with proper content type
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Error retrieving image:', error);
    return NextResponse.json(
      { error: 'Error retrieving image' },
      { status: 500 }
    );
  }
} 