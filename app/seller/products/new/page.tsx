"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import VoiceProductCreation from "@/components/seller/voice-product-creation"

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is authenticated and is a seller
  useEffect(() => {
    const checkAuth = async () => {
      // In a real app, this would check authentication status
      const userData = localStorage.getItem("userData")

      if (!userData) {
        router.push("/login")
        return
      }

      const user = JSON.parse(userData)
      if (user.role !== "SELLER") {
        router.push("/")
        return
      }

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

  return <VoiceProductCreation />
}
