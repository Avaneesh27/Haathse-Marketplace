"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import VoiceOnboarding from "@/components/onboarding/voice-onboarding"

export default function OnboardingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  // Simulate checking if user is already onboarded
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      // In a real app, this would check if the user has completed onboarding
      const isOnboarded = localStorage.getItem("isOnboarded") === "true"

      if (isOnboarded) {
        router.push("/")
      } else {
        setIsLoading(false)
      }
    }

    checkOnboardingStatus()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return <VoiceOnboarding />
}
