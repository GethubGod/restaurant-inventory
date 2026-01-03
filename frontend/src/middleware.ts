import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Check if the user is trying to visit /dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    
    // 2. Check if they have the 'token' cookie
    const token = request.cookies.get('token');

    // 3. If no token, kick them to /login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 4. Otherwise, let them pass
  return NextResponse.next();
}

// Configuration: Only run this guard on specific paths
export const config = {
  matcher: '/dashboard/:path*',
};