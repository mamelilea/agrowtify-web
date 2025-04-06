import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserFromToken } from './lib/auth';


export async function middleware(request: NextRequest) {
  const protectedPaths = ['/weather', '/about'];
  
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  if (!isProtectedPath) {
    return NextResponse.next();
  }
  
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  const user = await getUserFromToken(token);
  
  if (!user) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth-token');
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/weather/:path*'],
  runtime: 'nodejs'
};