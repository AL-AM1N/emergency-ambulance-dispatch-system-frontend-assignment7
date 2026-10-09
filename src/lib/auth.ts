"use client"

import { ADMIN_ROUTES, DRIVER_ROUTES, PATIENT_ROUTES } from "@/routes"
import type { Role } from "@/types"

export const ACCESS_TOKEN_COOKIE = "ambulink_access_token"
export const ROLE_COOKIE = "ambulink_role"

interface JwtClaims {
  userId: string
  name: string
  email: string
  role: "ADMIN" | "DRIVER" | "PATIENT"
  exp?: number
}

function decodeJwt(token: string): JwtClaims | null {
  try {
    const payload = token.split(".")[1]
    if (!payload) {
      return null
    }
    const padded = payload.replace(/-/g, "+").replace(/_/g, "/")
    const decoded = atob(padded)
    const json = decodeURIComponent(
      Array.from(
        decoded,
        (char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`,
      ).join(""),
    )
    return JSON.parse(json) as JwtClaims
  } catch {
    return null
  }
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") {
    return undefined
  }
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

function writeCookie(name: string, value: string, maxAgeSeconds = 86400) {
  if (typeof document === "undefined") {
    return
  }
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`
}

function removeCookie(name: string) {
  if (typeof document === "undefined") {
    return
  }
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
}

export function getAccessToken(): string | undefined {
  return readCookie(ACCESS_TOKEN_COOKIE)
}

export function getStoredRole(): JwtClaims["role"] | undefined {
  const role = readCookie(ROLE_COOKIE)
  if (role === "ADMIN" || role === "DRIVER" || role === "PATIENT") {
    return role
  }
  return undefined
}

export function setSession(accessToken: string) {
  const claims = decodeJwt(accessToken)
  if (!claims) {
    return
  }
  writeCookie(ACCESS_TOKEN_COOKIE, accessToken)
  writeCookie(ROLE_COOKIE, claims.role, 86400)
}

export function clearSession() {
  removeCookie(ACCESS_TOKEN_COOKIE)
  removeCookie(ROLE_COOKIE)
}

export function hasSession(): boolean {
  return Boolean(getAccessToken())
}

export function tokenToRole(token: string | undefined): Role | undefined {
  if (!token) {
    return undefined
  }
  return decodeJwt(token)?.role ?? getStoredRole()
}

export function roleHome(role: Role | undefined | null): string {
  switch (role) {
    case "ADMIN":
      return ADMIN_ROUTES.dashboard
    case "DRIVER":
      return DRIVER_ROUTES.dashboard
    case "PATIENT":
      return PATIENT_ROUTES.dashboard
    default:
      return "/login"
  }
}

export { decodeJwt }
