// lib/auth.ts
export const isTokenValid = (token: string | undefined): boolean => {
  if (!token) return false
  
  try {
    // Simple JWT expiration check (won't verify signature)
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}