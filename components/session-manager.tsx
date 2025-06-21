"use client"

import { useEffect, useState } from "react"

interface SessionManagerProps {
  onSessionExpire: () => void
  duration?: number // in minutes
}

export function SessionManager({ onSessionExpire, duration = 10 }: SessionManagerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60) // convert to seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onSessionExpire()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onSessionExpire])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  if (timeLeft <= 0) return null

  return (
    <div className="fixed top-4 right-4 bg-amber-100 border border-amber-300 rounded-lg p-3 shadow-lg z-50">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium text-amber-800">
          Session expires in {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  )
}
