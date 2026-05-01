import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const cookieStore = await cookies();
  const hasRefreshToken = Boolean(cookieStore.get('refreshToken')?.value);

  redirect(hasRefreshToken ? '/dashboard' : '/login');
}
