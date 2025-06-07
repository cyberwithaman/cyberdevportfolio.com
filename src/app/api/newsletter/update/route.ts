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

    // Check for existing subscribers by email, phone, and name
    const [existingEmailSubscriber, existingPhoneSubscriber, existingNameSubscriber] = await Promise.all([
      Newsletter.findOne({ email }),
      Newsletter.findOne({ phone }),
      Newsletter.findOne({ name: { $regex: new RegExp('^' + name + '$', 'i') } }) // Case insensitive name search
    ]);

    // Build status flags for the response
    const existingFlags = {
      emailExists: existingEmailSubscriber !== null,
      phoneExists: existingPhoneSubscriber !== null,
      nameExists: existingNameSubscriber !== null,
    };

    // Check for conflicts (different subscribers with matching fields)
    const subscriberIds = new Set();
    if (existingEmailSubscriber) subscriberIds.add(existingEmailSubscriber._id.toString());
    if (existingPhoneSubscriber) subscriberIds.add(existingPhoneSubscriber._id.toString());
    if (existingNameSubscriber) subscriberIds.add(existingNameSubscriber._id.toString());
    
    // Handle existing email subscriber case
    if (existingEmailSubscriber) {
      // Update the existing subscriber with new information
      existingEmailSubscriber.name = name;
      existingEmailSubscriber.phone = phone;
      existingEmailSubscriber.whatsapp = whatsapp || false;
      existingEmailSubscriber.lastUpdated = new Date();
      
      // Add to update history
      existingEmailSubscriber.updateHistory.push({
        date: new Date(),
        fields: ['name', 'phone', 'whatsapp'],
        action: 'updated'
      });
      
      await existingEmailSubscriber.save();
      
      return NextResponse.json({
        success: true,
        message: 'Subscription updated successfully',
        updated: true,
        existingData: true,
        existingFlags
      });
    } else {
      // Create new entry if email doesn't exist
      const newSubscription = new Newsletter({
        name,
        email,
        phone,
        whatsapp: whatsapp || false,
      });
      
      await newSubscription.save();
      
      return NextResponse.json({
        success: true,
        message: 'New subscription created successfully',
        formerlyConflicting: subscriberIds.size > 1,
        existingData: subscriberIds.size > 0,
        existingFlags
      });
    }
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 