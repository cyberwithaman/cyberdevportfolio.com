import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';

export async function POST(request: Request) {
  try {
    // Connect to the database
    await connectDB();

    const body = await request.json();
    const { name, email, phone, whatsapp } = body;

    // Basic validation
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Check for existing email or phone
    const [existingEmailSubscriber, existingPhoneSubscriber] = await Promise.all([
      Newsletter.findOne({ email }),
      Newsletter.findOne({ phone })
    ]);

    // Build detailed error response
    if (existingEmailSubscriber && existingPhoneSubscriber) {
      return NextResponse.json(
        { 
          error: 'Both email and phone number are already subscribed to newsletter',
          emailExists: true,
          phoneExists: true
        },
        { status: 409 }
      );
    }
    
    if (existingEmailSubscriber) {
      return NextResponse.json(
        { 
          error: 'This email is already subscribed to newsletter',
          emailExists: true,
          phoneExists: false
        },
        { status: 409 }
      );
    }
    
    if (existingPhoneSubscriber) {
      return NextResponse.json(
        { 
          error: 'This phone number is already subscribed to newsletter',
          emailExists: false,
          phoneExists: true
        },
        { status: 409 }
      );
    }

    // Create new newsletter subscription
    const newSubscription = new Newsletter({
      name,
      email,
      phone,
      whatsapp: whatsapp || false,
    });

    await newSubscription.save();

    return NextResponse.json({
      success: true,
      message: 'Newsletter subscription successful',
    });
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Connect to the database
    await connectDB();

    // Only return this data if the user is authenticated (should be checked via middleware)
    // For now, we'll just return the data for demo purposes
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: subscribers,
    });
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 