import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'

export function useAdminRole() {
  const { user, isLoaded } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user) {
      const role = user?.publicMetadata?.role as string
      const adminRole = role?.toLowerCase() === 'admin'
      
      setIsAdmin(adminRole)
      setIsLoading(false)
    } else if (isLoaded && !user) {
      setIsAdmin(false)
      setIsLoading(false)
    }
  }, [user, isLoaded])

  return { isAdmin, isLoading }
}

export function usePanitiaRole() {
  const { user, isLoaded } = useUser()
  const [isPanitia, setIsPanitia] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user) {
      const role = user?.publicMetadata?.role as string
      const panitiaRole = role?.toLowerCase() === 'panitia'
      
      setIsPanitia(panitiaRole)
      setIsLoading(false)
    } else if (isLoaded && !user) {
      setIsPanitia(false)
      setIsLoading(false)
    }
  }, [user, isLoaded])

  return { isPanitia, isLoading }
}