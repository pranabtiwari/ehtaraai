import { cookies } from 'next/headers';
import { verifyRefreshToken, generateAccessToken } from '@/lib/auth';
import { User } from '@/models/user';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return new Response(
        JSON.stringify({ message: 'No refresh token provided' }),
        { status: 400 },
      );
    }

    try {
      const decoded = verifyRefreshToken(refreshToken);

      if (typeof decoded === 'string' || !('userId' in decoded)) {
        return new Response(
          JSON.stringify({ message: 'Invalid refresh token' }),
          { status: 401 },
        );
      }

      // 🔥 (Recommended) check user exists
      const user = await User.findById(decoded.userId);

      if (!user) {
        return new Response(JSON.stringify({ message: 'User not found' }), {
          status: 404,
        });
      }

      // ✅ generate new access token
      const accessToken = generateAccessToken(user._id.toString());

      return new Response(JSON.stringify({ accessToken }), {
        status: 200,
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ message: 'Invalid refresh token' }),
        { status: 401 },
      );
    }
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
    });
  }
}
