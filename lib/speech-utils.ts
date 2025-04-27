/**
 * Play text-to-speech audio
 * @param text - Text to be spoken
 * @param language - Language code (e.g., 'hi-IN')
 * @returns Promise that resolves when speech is done
 */
export async function playTextToSpeech(text: string, language = "hi-IN"): Promise<void> {
  // Check if browser supports speech synthesis
  if (!window.speechSynthesis) {
    console.warn("Speech synthesis not supported")
    return
  }

  // Create a new utterance
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = language
  utterance.rate = 0.9 // Slightly slower rate for better comprehension
  utterance.volume = 1.0 // Maximum volume

  // Make sure voices are loaded
  const voices = await loadVoices()

  // Find a suitable voice for the language
  const preferredVoice =
    voices.find((voice) => voice.lang === language && voice.name.includes("Female")) ||
    voices.find((voice) => voice.lang === language) ||
    voices.find((voice) => voice.lang.startsWith(language.split("-")[0])) ||
    voices[0] // Fallback to first available voice

  if (preferredVoice) {
    utterance.voice = preferredVoice
  }

  // Return a promise that resolves when speech is done
  return new Promise((resolve) => {
    utterance.onend = () => resolve()

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    // Start speaking
    window.speechSynthesis.speak(utterance)
  })
}

/**
 * Helper function to ensure voices are loaded
 * @returns Promise that resolves with available voices
 */
export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      resolve(voices)
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        resolve(window.speechSynthesis.getVoices())
      }
    }
  })
}

/**
 * Speak a number in a more natural way
 * @param number - Number to be spoken
 * @param language - Language code (e.g., 'hi-IN')
 */
export async function speakNumber(number: number, language = "hi-IN"): Promise<void> {
  if (language.startsWith("hi")) {
    // Hindi number pronunciation
    const hindiNumbers = ["शून्य", "एक", "दो", "तीन", "चार", "पाँच", "छह", "सात", "आठ", "नौ", "दस"]

    if (number <= 10) {
      return playTextToSpeech(hindiNumbers[number], language)
    } else {
      return playTextToSpeech(number.toString(), language)
    }
  } else {
    // English number pronunciation
    return playTextToSpeech(number.toString(), language)
  }
}
