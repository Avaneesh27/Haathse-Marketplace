"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import VoiceProductDiscovery from "@/components/buyer/voice-product-discovery"

export default function ProductsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      // In a real app, this would check authentication status
      // For demo purposes, we'll allow anyone to access this page
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return <VoiceProductDiscovery />
}
