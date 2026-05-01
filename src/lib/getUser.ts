import { verifyAccessToken, verifyRefreshToken } from './auth';

export function getUserFromToken(req: Request) {
  const authHeader = req.headers.get('authorization');
  const cookieHeader = req.headers.get('cookie');

  const bearerToken = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;
  const cookieToken = cookieHeader
    ?.split(';')
    .map((part) => part.trim())
    .find(
      (part) =>
        part.startsWith('accessToken=') || part.startsWith('refreshToken='),
    )
    ?.split('=')[1];

  const token = bearerToken ?? cookieToken;

  if (!token) return null;

  try {
    const decoded = bearerToken
      ? verifyAccessToken(token)
      : (() => {
          try {
            return verifyAccessToken(token);
          } catch {
            return verifyRefreshToken(token);
          }
        })();

    if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
      return null;
    }

    return {
      id: (decoded as { userId: string }).userId,
      ...decoded,
    };
  } catch {
    return null;
  }
}
