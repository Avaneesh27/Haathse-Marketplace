"use client"

import { useState, useEffect, useRef } from "react"
import { transcribeAudio } from "@/lib/whisper-service"
import { processCommand } from "@/lib/gpt-service"
import { playTextToSpeech } from "@/lib/speech-utils"

export type VoiceCommandOptions = {
  autoStart?: boolean
  language?: string
  commandTimeout?: number
  enableContinuousListening?: boolean
}

export type CommandResult = {
  intent: string
  parameters: Record<string, any>
  response: string
}

export function useVoiceCommand(options: VoiceCommandOptions = {}) {
  const { autoStart = false, language = "hi-IN", commandTimeout = 5000, enableContinuousListening = true } = options

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [command, setCommand] = useState<CommandResult | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Check browser capabilities on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Debug: Check if mediaDevices is available
        console.log("MediaDevices available:", !!navigator.mediaDevices)

        // Debug: Check if SpeechRecognition is available
        console.log(
          "SpeechRecognition available:",
          !!(window.SpeechRecognition || (window as any).webkitSpeechRecognition),
        )

        if (autoStart) {
          console.log("Auto-starting voice recognition")
          startListening()
        }

        return () => {
          stopListening()
        }
      } catch (err) {
        console.error("Speech recognition initialization error:", err)
        setError("Voice recognition not supported on this device")
      }
    }
  }, [autoStart])

  const startListening = async () => {
    try {
      console.log("Starting voice listening...")
      setError(null)
      setIsListening(true)

      // Request microphone access
      if (!navigator.mediaDevices) {
        throw new Error("MediaDevices API not available in this browser")
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      console.log("Microphone access granted")

      // Provide feedback that we're listening
      await playTextToSpeech("I am listening")

      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        // Process the audio
        if (audioChunksRef.current.length > 0) {
          setIsProcessing(true)
          console.log("Processing audio...")

          try {
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })

            // Use Whisper API for accurate transcription with dialect support
            const transcribedText = await transcribeAudio(audioBlob, language)
            console.log("Transcription received:", transcribedText)
            setTranscript(transcribedText)

            // Process the command using GPT-4 Turbo
            const processedCommand = await processCommand(transcribedText)
            setCommand(processedCommand)

            if (enableContinuousListening) {
              // Reset and start listening again
              setTimeout(() => {
                audioChunksRef.current = []
                if (mediaRecorderRef.current) {
                  console.log("Restarting listening (continuous mode)")
                  mediaRecorderRef.current.start()
                }
              }, 1000)
            }
          } catch (err: any) {
            console.error("Error processing voice:", err)
            setError(`Error processing voice: ${err.message}`)
            await playTextToSpeech("Sorry, I had trouble processing that")
          } finally {
            setIsProcessing(false)
          }
        }
      }

      // Start recording
      mediaRecorderRef.current.start()
      console.log("Recording started")

      // Auto-stop after timeout if needed
      if (!enableContinuousListening) {
        setTimeout(() => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            console.log("Auto-stopping recording after timeout")
            mediaRecorderRef.current.stop()
          }
        }, commandTimeout)
      }
    } catch (err: any) {
      console.error("Microphone access error:", err)
      setIsListening(false)
      setError(`Microphone access error: ${err.message}`)
      await playTextToSpeech("I cannot access the microphone")
    }
  }

  const stopListening = () => {
    console.log("Stopping voice listening...")
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
    }
    setIsListening(false)
  }

  return {
    isListening,
    transcript,
    isProcessing,
    error,
    command,
    startListening,
    stopListening,
  }
}
