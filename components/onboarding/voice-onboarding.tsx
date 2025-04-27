"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useVoiceCommand } from "@/hooks/use-voice-command"
import { playTextToSpeech } from "@/lib/speech-utils"
import { Mic, MicOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Onboarding steps
enum OnboardingStep {
  WELCOME = "welcome",
  NAME = "name",
  VILLAGE = "village",
  DISTRICT = "district",
  ROLE = "role",
  PHONE = "phone",
  AADHAAR = "aadhaar",
  REVIEW = "review",
  COMPLETE = "complete",
}

export default function VoiceOnboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.WELCOME)

  // User data collected during onboarding
  const [userData, setUserData] = useState({
    name: "",
    village: "",
    district: "",
    role: "", // 'SELLER' or 'BUYER'
    phone: "",
    aadhaarLast4: "",
    preferredLanguage: "hi-IN",
  })

  // Voice command hook - configured for the current step
  const {
    isListening,
    transcript,
    isProcessing,
    error: voiceError,
    startListening,
    stopListening,
  } = useVoiceCommand({
    autoStart: false,
    language: userData.preferredLanguage,
    enableContinuousListening: false,
    commandTimeout: 7000, // Longer timeout for onboarding responses
  })

  // If this is the first load, give welcome instructions
  useEffect(() => {
    if (currentStep === OnboardingStep.WELCOME) {
      handleWelcomeStep()
    }
  }, [currentStep])

  // React to new transcripts
  useEffect(() => {
    if (transcript && !isProcessing) {
      processStepInput(transcript)
    }
  }, [transcript, isProcessing])

  // Welcome step instructions
  const handleWelcomeStep = async () => {
    await playTextToSpeech("Welcome to HaathSe, the voice-first marketplace for rural artisans.")
    await playTextToSpeech(
      "I will guide you through the setup process. You can speak your responses or use the buttons.",
    )

    // Show language selection or proceed
    setTimeout(() => {
      askForLanguagePreference()
    }, 2000)
  }

  // Ask user for language preference
  const askForLanguagePreference = async () => {
    await playTextToSpeech("Please select your preferred language. Say Hindi, Tamil, Telugu, or English.")
    startListening()
  }

  // Process user's spoken input for the current step
  const processStepInput = async (text: string) => {
    const lowerText = text.toLowerCase()

    switch (currentStep) {
      case OnboardingStep.WELCOME:
        // Detect language preference
        processLanguageSelection(lowerText)
        break

      case OnboardingStep.NAME:
        // Extract name from transcript
        const name = text.trim()
        setUserData((prev) => ({ ...prev, name }))
        await playTextToSpeech(`Thank you, ${name}. I've recorded your name.`)
        moveToNextStep()
        break

      case OnboardingStep.VILLAGE:
        // Extract village from transcript
        const village = text.trim()
        setUserData((prev) => ({ ...prev, village }))
        await playTextToSpeech(`I've recorded your village as ${village}.`)
        moveToNextStep()
        break

      case OnboardingStep.DISTRICT:
        // Extract district from transcript
        const district = text.trim()
        setUserData((prev) => ({ ...prev, district }))
        await playTextToSpeech(`I've recorded your district as ${district}.`)
        moveToNextStep()
        break

      case OnboardingStep.ROLE:
        // Determine if user wants to be a seller or buyer
        processRoleSelection(lowerText)
        break

      case OnboardingStep.PHONE:
        // Extract phone from transcript - numbers only
        const phoneDigits = text.replace(/\D/g, "")
        if (phoneDigits.length >= 10) {
          const phone = phoneDigits.slice(-10) // Take last 10 digits
          setUserData((prev) => ({ ...prev, phone }))
          await playTextToSpeech(`I've recorded your phone number as ${phone.split("").join(" ")}.`)
          moveToNextStep()
        } else {
          await playTextToSpeech("Please provide a valid 10-digit phone number.")
          startListening() // Try again
        }
        break

      case OnboardingStep.AADHAAR:
        // Extract last 4 digits of Aadhaar from transcript
        const aadhaarDigits = text.replace(/\D/g, "")
        if (aadhaarDigits.length >= 4) {
          const aadhaarLast4 = aadhaarDigits.slice(-4) // Take last 4 digits
          setUserData((prev) => ({ ...prev, aadhaarLast4 }))
          await playTextToSpeech(
            `I've recorded the last 4 digits of your Aadhaar as ${aadhaarLast4.split("").join(" ")}.`,
          )
          moveToNextStep()
        } else {
          await playTextToSpeech("Please provide the last 4 digits of your Aadhaar number.")
          startListening() // Try again
        }
        break

      case OnboardingStep.REVIEW:
        // Check if user confirms the information
        if (
          lowerText.includes("yes") ||
          lowerText.includes("correct") ||
          lowerText.includes("हां") ||
          lowerText.includes("सही")
        ) {
          await playTextToSpeech("Thank you for confirming your information.")
          submitUserData()
        } else {
          await playTextToSpeech("Let's try again from the beginning.")
          setCurrentStep(OnboardingStep.NAME)
          await askQuestion(OnboardingStep.NAME)
        }
        break
    }
  }

  // Process language selection
  const processLanguageSelection = async (text: string) => {
    const lowerText = text.toLowerCase()

    // Detect language preference
    if (lowerText.includes("hindi") || lowerText.includes("हिंदी")) {
      setUserData((prev) => ({ ...prev, preferredLanguage: "hi-IN" }))
      await playTextToSpeech("You have selected Hindi.")
    } else if (lowerText.includes("tamil") || lowerText.includes("தமிழ்")) {
      setUserData((prev) => ({ ...prev, preferredLanguage: "ta-IN" }))
      await playTextToSpeech("You have selected Tamil.")
    } else if (lowerText.includes("telugu") || lowerText.includes("తెలుగు")) {
      setUserData((prev) => ({ ...prev, preferredLanguage: "te-IN" }))
      await playTextToSpeech("You have selected Telugu.")
    } else if (lowerText.includes("english") || lowerText.includes("अंग्रेजी")) {
      setUserData((prev) => ({ ...prev, preferredLanguage: "en-IN" }))
      await playTextToSpeech("You have selected English.")
    } else {
      // Default to Hindi
      setUserData((prev) => ({ ...prev, preferredLanguage: "hi-IN" }))
      await playTextToSpeech("I didn't catch that. I'll use Hindi as your preferred language.")
    }

    moveToNextStep()
  }

  // Process user role selection
  const processRoleSelection = async (text: string) => {
    const lowerText = text.toLowerCase()

    // Detect seller vs buyer preference
    if (lowerText.includes("sell") || lowerText.includes("बेचना") || lowerText.includes("विक्रेता")) {
      setUserData((prev) => ({ ...prev, role: "SELLER" }))
      await playTextToSpeech("You have selected to be a seller.")
    } else if (lowerText.includes("buy") || lowerText.includes("खरीदना") || lowerText.includes("क्रेता")) {
      setUserData((prev) => ({ ...prev, role: "BUYER" }))
      await playTextToSpeech("You have selected to be a buyer.")
    } else {
      // Ask again
      await playTextToSpeech("I didn't understand. Do you want to sell products or buy products?")
      startListening()
      return
    }

    moveToNextStep()
  }

  // Move to next step and ask question
  const moveToNextStep = async () => {
    const steps = Object.values(OnboardingStep)
    const currentIndex = steps.indexOf(currentStep)

    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1]
      setCurrentStep(nextStep as OnboardingStep)
      await askQuestion(nextStep as OnboardingStep)
    }
  }

  // Ask the appropriate question for the current step
  const askQuestion = async (step: OnboardingStep) => {
    switch (step) {
      case OnboardingStep.NAME:
        await playTextToSpeech("What is your name?")
        break
      case OnboardingStep.VILLAGE:
        await playTextToSpeech("What is the name of your village?")
        break
      case OnboardingStep.DISTRICT:
        await playTextToSpeech("What district are you from?")
        break
      case OnboardingStep.ROLE:
        await playTextToSpeech("Do you want to sell products or buy products on HaathSe?")
        break
      case OnboardingStep.PHONE:
        await playTextToSpeech("What is your phone number?")
        break
      case OnboardingStep.AADHAAR:
        await playTextToSpeech("Please say the last 4 digits of your Aadhaar number for verification.")
        break
      case OnboardingStep.REVIEW:
        await reviewInformation()
        break
    }

    startListening()
  }

  // Review all information
  const reviewInformation = async () => {
    await playTextToSpeech("Let's review your information.")
    await playTextToSpeech(`Your name is ${userData.name}.`)
    await playTextToSpeech(`Your village is ${userData.village}.`)
    await playTextToSpeech(`Your district is ${userData.district}.`)
    await playTextToSpeech(`You are a ${userData.role === "SELLER" ? "seller" : "buyer"}.`)
    await playTextToSpeech(`Your phone number is ${userData.phone.split("").join(" ")}.`)
    await playTextToSpeech("Is this information correct? Say yes or no.")
  }

  // Submit user data to backend
  const submitUserData = async () => {
    try {
      setCurrentStep(OnboardingStep.COMPLETE)
      await playTextToSpeech("Processing your information...")

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Store in localStorage for demo purposes
      localStorage.setItem("userData", JSON.stringify(userData))
      localStorage.setItem("isOnboarded", "true")

      await playTextToSpeech("Your account has been created successfully!")

      // Redirect to appropriate dashboard based on role
      setTimeout(() => {
        router.push(userData.role === "SELLER" ? "/seller/dashboard" : "/buyer/dashboard")
      }, 3000)
    } catch (error) {
      console.error("Error creating user:", error)
      await playTextToSpeech("There was an error creating your account. Please try again later.")
    }
  }

  // Manual skip for testing and accessibility
  const handleSkipStep = () => {
    moveToNextStep()
  }

  // Render the current step UI
  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 relative">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {Object.values(OnboardingStep).map((step, index) => (
              <div
                key={step}
                className={`h-3 w-3 rounded-full ${
                  Object.values(OnboardingStep).indexOf(currentStep) >= index ? "bg-orange-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Current step title */}
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {currentStep === OnboardingStep.WELCOME
            ? "Welcome to HaathSe"
            : currentStep === OnboardingStep.NAME
              ? "Your Name"
              : currentStep === OnboardingStep.VILLAGE
                ? "Your Village"
                : currentStep === OnboardingStep.DISTRICT
                  ? "Your District"
                  : currentStep === OnboardingStep.ROLE
                    ? "Your Role"
                    : currentStep === OnboardingStep.PHONE
                      ? "Your Phone Number"
                      : currentStep === OnboardingStep.AADHAAR
                        ? "Verification"
                        : currentStep === OnboardingStep.REVIEW
                          ? "Review Information"
                          : "Account Created"}
        </h1>

        {/* Voice status indicator */}
        <div className="flex justify-center mb-8">
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

        {/* Instructions */}
        <p className="text-center text-gray-600 mb-4">
          {isListening
            ? "I'm listening..."
            : isProcessing
              ? "Processing..."
              : currentStep === OnboardingStep.WELCOME
                ? "Please select your preferred language."
                : currentStep === OnboardingStep.NAME
                  ? "Please say your name."
                  : currentStep === OnboardingStep.VILLAGE
                    ? "Please say your village name."
                    : currentStep === OnboardingStep.DISTRICT
                      ? "Please say your district."
                      : currentStep === OnboardingStep.ROLE
                        ? "Do you want to sell or buy products?"
                        : currentStep === OnboardingStep.PHONE
                          ? "Please say your 10-digit phone number."
                          : currentStep === OnboardingStep.AADHAAR
                            ? "Please say the last 4 digits of your Aadhaar."
                            : currentStep === OnboardingStep.REVIEW
                              ? "Is this information correct?"
                              : "Your account has been created!"}
        </p>

        {/* Transcript display */}
        {transcript && (
          <div className="bg-gray-50 p-3 rounded-lg mb-6">
            <p className="text-gray-800 text-center">{transcript}</p>
          </div>
        )}

        {/* Voice control buttons */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={isListening ? stopListening : startListening}
            className={`px-6 py-2 rounded-full ${
              isListening ? "bg-red-500 text-white hover:bg-red-600" : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            {isListening ? "Stop" : "Speak"}
          </Button>

          {/* Skip button for testing */}
          {process.env.NODE_ENV === "development" && (
            <Button onClick={handleSkipStep} variant="outline" className="px-6 py-2 rounded-full">
              Skip <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Error message */}
        {voiceError && <p className="text-red-500 text-center mt-4">{voiceError}</p>}

        {/* Help text */}
        <p className="text-xs text-center text-gray-500 mt-8">
          Speak clearly or use the buttons to navigate. You can say "repeat" to hear the question again.
        </p>
      </div>
    </div>
  )
}
