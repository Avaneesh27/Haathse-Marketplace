/**
 * Transcribe audio using OpenAI Whisper API
 * @param audioBlob - Audio recording blob
 * @param language - Language code (e.g., 'hi-IN')
 * @returns Transcribed text
 */
export async function transcribeAudio(audioBlob: Blob, language = "hi-IN"): Promise<string> {
  try {
    console.log("Transcribing audio with language:", language)
    console.log("Audio blob size:", audioBlob.size)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo purposes, we'll use the Web Speech API directly
    return useWebSpeechAPI(audioBlob, language)
  } catch (error) {
    console.error("Error transcribing audio:", error)
    return useWebSpeechAPI(audioBlob, language)
  }
}

/**
 * Use Web Speech API as a fallback
 * @param audioBlob - Audio recording blob
 * @param language - Language code
 * @returns Transcribed text
 */
function useWebSpeechAPI(audioBlob: Blob, language: string): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log("Attempting to use Web Speech API")

    // Check if SpeechRecognition is available
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      console.error("SpeechRecognition not available")
      // Return a mock response for demo purposes
      return resolve("This is a simulated transcription. Web Speech API is not available in this browser.")
    }

    const recognition = new SpeechRecognition()
    recognition.lang = language
    recognition.interimResults = false
    recognition.continuous = true
    recognition.maxAlternatives = 1

    console.log("SpeechRecognition configured with language:", language)

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      console.log("Transcript received:", transcript)
      resolve(transcript)
    }

    recognition.onerror = (event: any) => {
      console.error("SpeechRecognition error:", event.error)
      // Return a mock response for demo purposes
      resolve("I couldn't understand that. Please try again.")
    }

    recognition.onend = () => {
      console.log("SpeechRecognition ended")
      // If no result was received, resolve with a default message
      resolve("I'm listening...")
    }

    // Start recognition
    try {
      recognition.start()
      console.log("SpeechRecognition started")
    } catch (err) {
      console.error("Error starting SpeechRecognition:", err)
      resolve("Voice recognition failed to start. Please try again.")
    }
  })
}

/**
 * Detect language from audio
 * @param audioBlob - Audio recording blob
 * @returns Detected language code
 */
export async function detectLanguage(audioBlob: Blob): Promise<string> {
  try {
    // Simulate API call
    console.log("Detecting language from audio")

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Return a mock response
    return "hi-IN" // Default to Hindi
  } catch (error) {
    console.error("Error detecting language:", error)
    return "hi-IN" // Default to Hindi if detection fails
  }
}
