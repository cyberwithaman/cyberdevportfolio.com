import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { username, password } = await request.json();
    
    // Basic validation
    if (!username || !password) {
      console.log('Login error: Missing username or password');
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    console.log(`Login attempt for username: ${username}`);

    // Find user
    const user = await User.findOne({ username });
    
    if (!user) {
      console.log(`Login error: User not found with username: ${username}`);
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    console.log(`User found: ${user.username}, role: ${user.role}`);
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log('Login error: Invalid password');
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    // Update last login time
    user.lastLogin = new Date();
    await user.save();
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'fallback-secret-key-for-development',
      { expiresIn: '1d' }
    );
    
    // For security, don't send the password back
    const userResponse = {
      _id: user._id,
      username: user.username,
      role: user.role || 'user',
    };
    
    console.log('Login successful');
    
    return NextResponse.json({
      success: true,
      user: userResponse,
      token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
} 