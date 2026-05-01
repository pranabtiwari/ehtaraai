import { connectDB } from '@/lib/db';
import { User } from '@/models/user';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  try {
    await connectDB();
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
      });
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    const res = NextResponse.json({
      message: 'Login successful',
      accessToken,
    });
    res.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal server error',
         error: (error as Error).message
     }), {
      status: 500,
    });
  }
}
