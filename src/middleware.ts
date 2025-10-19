import { NextResponse, type NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  const { user } = session;

  const protectedRoutes = ['/kursus', '/admin', '/sertifikat'];
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  if (!user && protectedRoutes.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (user && isAdminRoute && user.role !== 'admin') {
     return NextResponse.redirect(new URL('/kursus', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/kursus/:path*', '/admin/:path*', '/sertifikat/:path*', '/kursus/sertifikat'],
};
