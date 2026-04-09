import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export function getUser(): { userId: string; email: string } | null {
  const token = cookies().get('auth_token')?.value

  if (!token) return null

  return verifyToken(token)
}