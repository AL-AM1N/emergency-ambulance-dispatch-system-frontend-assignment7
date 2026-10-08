import { type NextRequest, NextResponse } from "next/server"

const ACCESS_TOKEN_COOKIE = "ambulink_access_token"
const ROLE_COOKIE = "ambulink_role"

const protectedRoutes: Record<string, string[]> = {
  "/admin": ["ADMIN"],
  "/driver": ["DRIVER"],
  "/patient": ["PATIENT"],
}

function getCookieRole(request: NextRequest): string | undefined {
  const role = request.cookies.get(ROLE_COOKIE)?.value
  if (role === "ADMIN" || role === "DRIVER" || role === "PATIENT") {
    return role
  }
  return undefined
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const requiredRoles = Object.entries(protectedRoutes).find(
    ([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )?.[1]

  if (!requiredRoles) {
    return NextResponse.next()
  }

  const role = getCookieRole(request)
  const hasAccessToken = Boolean(
    request.cookies.get(ACCESS_TOKEN_COOKIE)?.value,
  )

  if (!hasAccessToken || !role) {
    const login = new URL("/login", request.url)
    return NextResponse.redirect(login)
  }

  if (!requiredRoles.includes(role)) {
    const home = new URL("/", request.url)
    return NextResponse.redirect(home)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/driver/:path*", "/patient/:path*"],
}
