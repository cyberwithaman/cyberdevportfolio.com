import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';

export async function POST(request: Request) {
  try {
    // Connect to the database
    await connectDB();

    const body = await request.json();
    const { email, phone } = body;

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email or phone number is required to resubscribe' },
        { status: 400 }
      );
    }

    // Find subscriber by email or phone
    const query = email ? { email } : { phone };
    const subscriber = await Newsletter.findOne(query);

    if (!subscriber) {
      return NextResponse.json(
        { error: 'No subscription found with this information' },
        { status: 404 }
      );
    }

    // Mark as active (resubscribed)
    subscriber.active = true;
    subscriber.lastUpdated = new Date();
    
    // Add to update history
    subscriber.updateHistory.push({
      date: new Date(),
      fields: ['active'],
      action: 'resubscribed'
    });

    await subscriber.save();

    return NextResponse.json({
      success: true,
      message: 'Successfully resubscribed to newsletter'
    });
  } catch (error) {
    console.error('Newsletter resubscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 