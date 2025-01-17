import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')
  const isAdminLoginPage = request.nextUrl.pathname === '/admin/login'
  
  // 管理者ログインページの場合
  if (isAdminLoginPage) {
    // すでにログインしていて管理者の場合は管理者ページへ
    if (token?.email === process.env.ADMIN_EMAIL) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    // ログインしているが管理者でない場合はホームへ
    if (token) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    // 未ログインの場合はログインページを表示
    return NextResponse.next()
  }

  // その他の管理者ページの場合
  if (isAdminPage) {
    // 未ログインの場合は管理者ログインページへ
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // 管理者以外のユーザーの場合はホームへ
    if (token.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

// 管理者関連のパスのみミドルウェアを適用
export const config = {
  matcher: ['/admin/:path*']
}