"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useVoiceCommand } from "@/hooks/use-voice-command"
import { playTextToSpeech } from "@/lib/speech-utils"
import { Mic, MicOff, X, Home, Package, HelpCircle } from "lucide-react"

interface VoiceAssistantModalProps {
  onClose: () => void
}

export default function VoiceAssistantModal({ onClose }: VoiceAssistantModalProps) {
  const router = useRouter()
  const [activeIntent, setActiveIntent] = useState<string | null>(null)

  const {
    isListening,
    transcript,
    isProcessing,
    error: voiceError,
    command,
    startListening,
    stopListening,
  } = useVoiceCommand({
    autoStart: true,
    language: "hi-IN",
    enableContinuousListening: true,
  })

  // Handle voice commands
  useEffect(() => {
    if (command) {
      handleCommand(command)
    }
  }, [command, router])

  const handleCommand = async (command: any) => {
    setActiveIntent(command.intent)

    // Speak the response
    await playTextToSpeech(command.response)

    // Execute the appropriate action based on intent
    switch (command.intent) {
      case "NAVIGATE":
        if (command.parameters.path) {
          router.push(command.parameters.path)
        }
        break
      case "CREATE_PRODUCT":
        router.push("/seller/products/new")
        break
      case "SEARCH_PRODUCTS":
        router.push("/buyer/products")
        break
      case "ACCEPT_ORDER":
      case "DECLINE_ORDER":
        // These would typically update an order status
        console.log("Order action:", command.intent)
        break
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Voice Assistant</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Voice status indicator */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center ${
              isListening ? "bg-red-100 animate-pulse" : isProcessing ? "bg-yellow-100" : "bg-gray-100"
            }`}
          >
            {isListening ? (
              <Mic className="w-12 h-12 text-red-500" />
            ) : isProcessing ? (
              <div className="w-12 h-12 text-yellow-500 animate-spin rounded-full border-4 border-yellow-200 border-t-yellow-500" />
            ) : (
              <MicOff className="w-12 h-12 text-gray-400" />
            )}
          </div>
        </div>

        {/* Transcript display */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4 min-h-[80px]">
          <p className="text-center text-gray-800">
            {isListening ? "I'm listening..." : isProcessing ? "Processing..." : transcript || "Speak a command"}
          </p>
        </div>

        {/* Common commands */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={async () => {
              await playTextToSpeech("Going to home page")
              router.push("/")
            }}
            className="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg text-sm flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Go Home
          </button>
          <button
            onClick={async () => {
              await playTextToSpeech("Going to products")
              router.push("/buyer/products")
            }}
            className="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg text-sm flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" /> View Products
          </button>
          <button
            onClick={async () => {
              await playTextToSpeech(
                "You can say commands like 'Go home', 'Search for products', or 'Create a new product'",
              )
            }}
            className="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg text-sm flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4" /> Help
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm">
            Close
          </button>
        </div>

        {/* Voice control buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`px-6 py-2 rounded-full ${isListening ? "bg-red-500 text-white" : "bg-orange-500 text-white"}`}
          >
            {isListening ? "Stop" : "Speak"}
          </button>
        </div>

        {/* Error message */}
        {voiceError && <p className="text-red-500 text-center mt-4">{voiceError}</p>}
      </div>
    </div>
  )
}
