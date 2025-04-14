import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserFromToken } from '@/lib/auth-node';


export async function middleware(request: NextRequest) {
  const protectedPaths = ['/admin'];
  
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  const protectedApiRoutes = [
    '/api/events',
    '/api/categories'
  ];

  const isProtectedApiRoute = protectedApiRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route) && 
    (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE')
  );
  
  if (!isProtectedPath && !isProtectedApiRoute) {
    return NextResponse.next();
  }
  
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    if (isProtectedApiRoute) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  const user = await getUserFromToken(token);
  
  if (!user) {
    if (isProtectedApiRoute) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth-token');
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/events/:path*', '/api/categories/:path*'],
};