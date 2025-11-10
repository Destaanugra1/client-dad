'use client';

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { lockAdminMateri, unlockAdminMateri } from '@/lib/api'

interface MateriLockToggleProps {
  materiId: number
  locked: boolean
  onChanged?: (locked: boolean) => void
}

export default function MateriLockToggle({ materiId, locked, onChanged }: MateriLockToggleProps) {
  const { getToken } = useAuth()
  const [isLocked, setIsLocked] = useState(locked)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggle = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = await getToken()
      if (!token) throw new Error('Missing token')
      if (isLocked) {
        await unlockAdminMateri(materiId, token)
        setIsLocked(false)
        onChanged?.(false)
      } else {
        await lockAdminMateri(materiId, token)
        setIsLocked(true)
        onChanged?.(true)
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to toggle lock')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggle}
        disabled={loading}
        className={`px-3 py-1 rounded text-sm border ${isLocked ? 'bg-yellow-600/20 text-yellow-200 border-yellow-500/40 hover:bg-yellow-600/30' : 'bg-green-600/20 text-green-200 border-green-500/40 hover:bg-green-600/30'} disabled:opacity-50`}
        title={isLocked ? 'Unlock materi' : 'Lock materi'}
      >
        {loading ? '...' : isLocked ? 'Unlock' : 'Lock'}
      </button>
      {error && <span className="text-xs text-red-300">{error}</span>}
    </div>
  )
}
