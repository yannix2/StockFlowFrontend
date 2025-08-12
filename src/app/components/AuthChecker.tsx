// components/AuthChecker.tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isTokenValid } from '@/lib/auth'

export default function AuthChecker() {
  const router = useRouter()

  useEffect(() => {
    const accessToken = getCookie('accessToken')
    const refreshToken = getCookie('refreshToken')
    
    if (!isTokenValid(accessToken) || !refreshToken) {
      router.push('/login')
    }
  }, [router])

  return null
}

// Helper function to get cookies
function getCookie(name: string): string | undefined {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')[1]
}