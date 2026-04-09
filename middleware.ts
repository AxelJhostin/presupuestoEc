import { NextResponse, type NextRequest } from 'next/server'
import { verifyTokenEdge } from '@/lib/auth-edge'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value

  const user = token ? await verifyTokenEdge(token) : null

  const isAuth = !!user
  const path = request.nextUrl.pathname

  const isPublic =
    path === '/' ||
    path.startsWith('/login') ||
    path.startsWith('/register') ||
    path.startsWith('/api/auth')

  if (!isAuth && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isAuth && (path.startsWith('/login') || path.startsWith('/register'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}