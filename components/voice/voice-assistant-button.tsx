"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import VoiceAssistantModal from "./voice-assistant-modal"
import { Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function VoiceAssistantButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMicAvailable, setIsMicAvailable] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Check if microphone is available on component mount
  useEffect(() => {
    const checkMicrophoneAvailability = async () => {
      try {
        // Check if mediaDevices API is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error("MediaDevices API not available")
          setIsMicAvailable(false)
          return
        }

        // Try to get microphone access
        await navigator.mediaDevices.getUserMedia({ audio: true })
        console.log("Microphone is available")
        setIsMicAvailable(true)
      } catch (err) {
        console.error("Microphone access error:", err)
        setIsMicAvailable(false)
      }
    }

    checkMicrophoneAvailability()
  }, [])

  const handleOpenModal = () => {
    if (!isMicAvailable) {
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to use the voice assistant",
        variant: "destructive",
      })
      return
    }

    setIsModalOpen(true)
    toast({
      title: "Voice Assistant Ready",
      description: "Speak a command or ask for help",
      duration: 3000,
    })
  }

  return (
    <>
      <Button
        onClick={handleOpenModal}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-orange-500 text-white z-50 hover:bg-orange-600 transition-colors"
        aria-label="Voice Assistant"
      >
        <Mic className="w-8 h-8" />
      </Button>

      {isModalOpen && <VoiceAssistantModal onClose={() => setIsModalOpen(false)} />}
    </>
  )
}
