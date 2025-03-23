import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  
  // Skip if the pathname already has a locale
  if (pathname.startsWith('/en/') || pathname.startsWith('/es/')) {
    return NextResponse.next();
  }

  // Skip if the pathname is just a locale (e.g., /en or /es)
  if (pathname === '/en' || pathname === '/es') {
    return NextResponse.next();
  }

  // For root path or any other path without locale, redirect to default locale
  const locale = 'en'; // Default locale
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
}; 