import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';

export async function POST(request: Request) {
  try {
    // Connect to the database
    await connectDB();

    const body = await request.json();
    const { email, phone, unsubscribeEmail = true, unsubscribePhone = false, unsubscribeWhatsapp = false } = body;

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email or phone number is required to unsubscribe' },
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

    // Track what was changed
    const updatedFields = [];
    let changesMade = false;

    // Complete unsubscribe - mark as inactive
    if (unsubscribeEmail && unsubscribePhone && unsubscribeWhatsapp) {
      subscriber.active = false;
      updatedFields.push('active');
      changesMade = true;
    } else {
      // Partial unsubscribe - keep active but update contact preferences
      
      // Email preference - create a new field for email subscription status
      if (unsubscribeEmail && subscriber.emailSubscribed !== false) {
        subscriber.emailSubscribed = false;
        updatedFields.push('emailSubscribed');
        changesMade = true;
      }
      
      // Phone preference - create a new field for phone subscription status
      if (unsubscribePhone && subscriber.phoneSubscribed !== false) {
        subscriber.phoneSubscribed = false;
        updatedFields.push('phoneSubscribed');
        changesMade = true;
      }
      
      // WhatsApp preference
      if (unsubscribeWhatsapp && subscriber.whatsapp !== false) {
        subscriber.whatsapp = false;
        updatedFields.push('whatsapp');
        changesMade = true;
      }
    }

    if (!changesMade) {
      return NextResponse.json({
        success: false,
        message: 'No changes were made to your subscription preferences'
      });
    }

    subscriber.lastUpdated = new Date();
    
    // Add to update history
    subscriber.updateHistory.push({
      date: new Date(),
      fields: updatedFields,
      action: 'unsubscribe_preferences'
    });

    await subscriber.save();

    return NextResponse.json({
      success: true,
      message: 'Successfully updated your subscription preferences',
      updatedPreferences: {
        email: unsubscribeEmail,
        phone: unsubscribePhone,
        whatsapp: unsubscribeWhatsapp
      }
    });
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 