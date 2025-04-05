import { twMerge } from 'tailwind-merge'
import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function remove(endpoint: string, id: string | number) {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:1337/api'

  const res = await fetch(`${API_BASE_URL}${endpoint}/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to delete')
  }

  return res.json()
}
