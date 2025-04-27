"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useVoiceCommand } from "@/hooks/use-voice-command"
import { playTextToSpeech } from "@/lib/speech-utils"
import { extractProductDetails } from "@/lib/gpt-service"
import { Mic, MicOff, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"

// Product creation steps
enum Step {
  INTRO = "intro",
  DESCRIPTION = "description",
  PHOTO = "photo",
  PRICE = "price",
  QUANTITY = "quantity",
  CATEGORY = "category",
  DELIVERY = "delivery",
  REVIEW = "review",
  SUBMIT = "submit",
}

export default function VoiceProductCreation() {
  const router = useRouter()
  const cameraRef = useRef<HTMLVideoElement>(null)

  // Product creation steps
  const [currentStep, setCurrentStep] = useState<Step>(Step.INTRO)
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category: "",
    price: 0,
    quantity: 0,
    unit: "",
    expiryDate: null as Date | null,
    deliveryOptions: [] as string[],
    photos: [] as string[],
  })

  const [processingImage, setProcessingImage] = useState(false)
  const [photoTaken, setPhotoTaken] = useState(false)

  // Voice command configuration
  const {
    isListening,
    transcript,
    isProcessing,
    error: voiceError,
    startListening,
    stopListening,
  } = useVoiceCommand({
    autoStart: false,
    language: "hi-IN",
    enableContinuousListening: false,
    commandTimeout: 10000, // Longer timeout for product descriptions
  })

  // Start intro when component mounts
  useEffect(() => {
    if (currentStep === Step.INTRO) {
      handleIntroStep()
    }
  }, [currentStep])

  // Process transcript when available
  useEffect(() => {
    if (transcript && !isProcessing) {
      processStepInput(transcript)
    }
  }, [transcript, isProcessing])

  // Introduction step - explain the process
  const handleIntroStep = async () => {
    await playTextToSpeech("Let's create a new product listing. I'll guide you through the process step by step.")
    setTimeout(() => {
      setCurrentStep(Step.DESCRIPTION)
      askForProductDescription()
    }, 2000)
  }

  // Ask for product description
  const askForProductDescription = async () => {
    await playTextToSpeech(
      "Please describe your product. Include what it is, what it's made of, and any special features.",
    )
    startListening()
  }

  // Process user input based on current step
  const processStepInput = async (text: string) => {
    switch (currentStep) {
      case Step.DESCRIPTION:
        // Use GPT to extract structured product details from voice description
        try {
          await playTextToSpeech("Processing your description...")

          const extractedDetails = await extractProductDetails(text)

          setProductData((prev) => ({
            ...prev,
            name: extractedDetails.name || "",
            description: extractedDetails.description || text,
            category: extractedDetails.category || "",
            price: extractedDetails.price || 0,
            quantity: extractedDetails.quantity || 0,
            unit: extractedDetails.unit || "piece",
          }))

          // Confirm extracted information
          await playTextToSpeech(
            `I understood that you're selling ${extractedDetails.name} for ${extractedDetails.price} rupees. You have ${extractedDetails.quantity} ${extractedDetails.unit}s available.`,
          )

          // Go to photo step
          setCurrentStep(Step.PHOTO)
          askForProductPhoto()
        } catch (error) {
          console.error("Error extracting product details:", error)
          await playTextToSpeech("I had trouble understanding your product description. Could you try again?")
          // Retry
          startListening()
        }
        break

      case Step.PRICE:
        // Extract price from voice input if not already extracted
        if (!productData.price) {
          const priceMatch = text.match(/(\d+)/)
          if (priceMatch) {
            const price = Number.parseInt(priceMatch[0], 10)
            setProductData((prev) => ({ ...prev, price }))
            await playTextToSpeech(`I've set the price to ${price} rupees.`)
            setCurrentStep(Step.QUANTITY)
            askForProductQuantity()
          } else {
            await playTextToSpeech("I couldn't understand the price. Please say a number like 500 or 1000.")
            startListening()
          }
        } else {
          setCurrentStep(Step.QUANTITY)
          askForProductQuantity()
        }
        break

      case Step.QUANTITY:
        // Extract quantity from voice input if not already extracted
        if (!productData.quantity) {
          const quantityMatch = text.match(/(\d+)/)
          if (quantityMatch) {
            const quantity = Number.parseInt(quantityMatch[0], 10)

            // Try to extract unit as well
            let unit = productData.unit
            if (text.includes("kg") || text.includes("kilo")) {
              unit = "kg"
            } else if (text.includes("gram")) {
              unit = "gram"
            } else if (text.includes("liter") || text.includes("litre")) {
              unit = "liter"
            } else if (text.includes("dozen")) {
              unit = "dozen"
            } else if (text.includes("piece") || text.includes("item")) {
              unit = "piece"
            }

            setProductData((prev) => ({ ...prev, quantity, unit }))
            await playTextToSpeech(`I've set the quantity to ${quantity} ${unit}s.`)
            setCurrentStep(Step.CATEGORY)
            askForProductCategory()
          } else {
            await playTextToSpeech("I couldn't understand the quantity. Please say a number like 5 or 10.")
            startListening()
          }
        } else {
          setCurrentStep(Step.CATEGORY)
          askForProductCategory()
        }
        break

      case Step.CATEGORY:
        // Process category selection
        if (!productData.category) {
          // Map common category names in multiple languages
          const categoryMap: Record<string, string> = {
            handicraft: "handicraft",
            हस्तशिल्प: "handicraft",
            food: "food",
            खाद्य: "food",
            agriculture: "agriculture",
            कृषि: "agriculture",
            textiles: "textiles",
            कपड़ा: "textiles",
            art: "art",
            कला: "art",
            other: "other",
            अन्य: "other",
          }

          // Find matching category
          const lowerText = text.toLowerCase()
          let category = "other"

          for (const [key, value] of Object.entries(categoryMap)) {
            if (lowerText.includes(key)) {
              category = value
              break
            }
          }

          setProductData((prev) => ({ ...prev, category }))
          await playTextToSpeech(`I've set the category to ${category}.`)
          setCurrentStep(Step.DELIVERY)
          askForDeliveryOptions()
        } else {
          setCurrentStep(Step.DELIVERY)
          askForDeliveryOptions()
        }
        break

      case Step.DELIVERY:
        // Process delivery options
        const deliveryOptions: string[] = []

        if (
          text.toLowerCase().includes("pickup") ||
          text.toLowerCase().includes("collection") ||
          text.toLowerCase().includes("स्वयं") ||
          text.toLowerCase().includes("खुद")
        ) {
          deliveryOptions.push("PICKUP")
        }

        if (
          text.toLowerCase().includes("post") ||
          text.toLowerCase().includes("courier") ||
          text.toLowerCase().includes("डाक") ||
          text.toLowerCase().includes("कूरियर")
        ) {
          deliveryOptions.push("COURIER")
        }

        if (
          text.toLowerCase().includes("local") ||
          text.toLowerCase().includes("door") ||
          text.toLowerCase().includes("स्थानीय") ||
          text.toLowerCase().includes("द्वार")
        ) {
          deliveryOptions.push("LOCAL")
        }

        // If no option detected, default to pickup
        if (deliveryOptions.length === 0) {
          deliveryOptions.push("PICKUP")
        }

        setProductData((prev) => ({ ...prev, deliveryOptions }))

        const deliveryText = deliveryOptions
          .map((option) => (option === "PICKUP" ? "pickup" : option === "COURIER" ? "courier" : "local delivery"))
          .join(", ")

        await playTextToSpeech(`I've set the delivery options to ${deliveryText}.`)

        setCurrentStep(Step.REVIEW)
        reviewProduct()
        break

      case Step.REVIEW:
        // Check if user confirms product details
        if (
          text.toLowerCase().includes("yes") ||
          text.toLowerCase().includes("correct") ||
          text.toLowerCase().includes("हां") ||
          text.toLowerCase().includes("सही")
        ) {
          setCurrentStep(Step.SUBMIT)
          submitProduct()
        } else {
          await playTextToSpeech("Let's try again from the beginning.")
          setCurrentStep(Step.DESCRIPTION)
          askForProductDescription()
        }
        break
    }
  }

  // Ask for product photo
  const askForProductPhoto = async () => {
    await playTextToSpeech(
      "Now, let's take a photo of your product. Position your product and press the camera button when ready.",
    )
    setPhotoTaken(false)

    // Initialize camera
    try {
      // Access camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (cameraRef.current) {
        cameraRef.current.srcObject = stream
        await cameraRef.current.play()
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      await playTextToSpeech("I couldn't access your camera. Let's skip this step.")

      // Skip to next step if camera not available
      if (!productData.price) {
        setCurrentStep(Step.PRICE)
        askForProductPrice()
      } else {
        setCurrentStep(Step.CATEGORY)
        askForProductCategory()
      }
    }
  }

  // Take product photo
  const takePhoto = async () => {
    if (!cameraRef.current) return

    try {
      setProcessingImage(true)

      // Create canvas to capture image
      const canvas = document.createElement("canvas")
      canvas.width = cameraRef.current.videoWidth
      canvas.height = cameraRef.current.videoHeight

      const context = canvas.getContext("2d")
      if (context) {
        context.drawImage(cameraRef.current, 0, 0, canvas.width, canvas.height)

        // Convert to data URL for preview
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8)

        setProductData((prev) => ({
          ...prev,
          photos: [...prev.photos, dataUrl],
        }))

        // Stop camera stream
        const stream = cameraRef.current.srcObject as MediaStream
        const tracks = stream.getTracks()
        tracks.forEach((track) => track.stop())
        cameraRef.current.srcObject = null

        setPhotoTaken(true)
        setProcessingImage(false)

        await playTextToSpeech("Photo taken successfully.")

        // Move to next step
        if (!productData.price) {
          setCurrentStep(Step.PRICE)
          askForProductPrice()
        } else {
          setCurrentStep(Step.CATEGORY)
          askForProductCategory()
        }
      }
    } catch (error) {
      console.error("Error taking photo:", error)
      setProcessingImage(false)
      await playTextToSpeech("There was an error taking the photo. Let's skip this step.")

      // Skip to next step if photo fails
      if (!productData.price) {
        setCurrentStep(Step.PRICE)
        askForProductPrice()
      } else {
        setCurrentStep(Step.CATEGORY)
        askForProductCategory()
      }
    }
  }

  // Ask for product price
  const askForProductPrice = async () => {
    await playTextToSpeech("What is the price of your product in rupees?")
    startListening()
  }

  // Ask for product quantity
  const askForProductQuantity = async () => {
    await playTextToSpeech("How many items do you have available to sell?")
    startListening()
  }

  // Ask for product category
  const askForProductCategory = async () => {
    await playTextToSpeech(
      "What category does your product belong to? For example, handicraft, food, textiles, or art.",
    )
    startListening()
  }

  // Ask for delivery options
  const askForDeliveryOptions = async () => {
    await playTextToSpeech("How will you deliver this product? Say pickup, courier, or local delivery.")
    startListening()
  }

  // Review product details before submission
  const reviewProduct = async () => {
    await playTextToSpeech("Let's review your product details before submitting.")
    await playTextToSpeech(`Product name: ${productData.name}`)
    await playTextToSpeech(`Price: ${productData.price} rupees`)
    await playTextToSpeech(`Quantity: ${productData.quantity} ${productData.unit}s`)

    // Check if photo was taken
    if (productData.photos.length > 0) {
      await playTextToSpeech("You have added a photo of your product.")
    } else {
      await playTextToSpeech("You haven't added a photo of your product.")
    }

    await playTextToSpeech("Is this information correct? Say yes to submit or no to start over.")
    startListening()
  }

  // Submit product to backend
  const submitProduct = async () => {
    try {
      await playTextToSpeech("Submitting your product...")

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Store in localStorage for demo purposes
      const products = JSON.parse(localStorage.getItem("products") || "[]")
      products.push({
        ...productData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: "ACTIVE",
      })
      localStorage.setItem("products", JSON.stringify(products))

      await playTextToSpeech("Your product has been listed successfully!")

      // Redirect to seller dashboard
      setTimeout(() => {
        router.push("/seller/dashboard")
      }, 3000)
    } catch (error) {
      console.error("Error submitting product:", error)
      await playTextToSpeech("There was an error listing your product. Please try again later.")
    }
  }

  // Render UI
  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 relative">
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {Object.values(Step).map((step, index) => (
              <div
                key={step}
                className={`h-2 w-2 rounded-full ${
                  Object.values(Step).indexOf(currentStep) >= index ? "bg-orange-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step title */}
        <h1 className="text-xl font-bold text-center mb-4 text-gray-800">
          {currentStep === Step.INTRO
            ? "Create New Product"
            : currentStep === Step.DESCRIPTION
              ? "Describe Your Product"
              : currentStep === Step.PHOTO
                ? "Take a Photo"
                : currentStep === Step.PRICE
                  ? "Set Price"
                  : currentStep === Step.QUANTITY
                    ? "Set Quantity"
                    : currentStep === Step.CATEGORY
                      ? "Choose Category"
                      : currentStep === Step.DELIVERY
                        ? "Delivery Options"
                        : currentStep === Step.REVIEW
                          ? "Review Details"
                          : "Submitting Product"}
        </h1>

        {/* Camera preview for photo step */}
        {currentStep === Step.PHOTO && !photoTaken && (
          <div className="mb-4 relative">
            <video ref={cameraRef} className="w-full h-64 bg-black rounded-lg" autoPlay playsInline muted />
            <button
              onClick={takePhoto}
              disabled={processingImage}
              className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full ${
                processingImage ? "bg-gray-300" : "bg-white"
              } border-4 border-orange-500 flex items-center justify-center`}
            >
              {processingImage ? (
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
              ) : (
                <Camera className="w-8 h-8 text-orange-500" />
              )}
            </button>
          </div>
        )}

        {/* Photo preview after taking */}
        {currentStep !== Step.PHOTO && productData.photos.length > 0 && (
          <div className="mb-4">
            <img
              src={productData.photos[0] || "/placeholder.svg"}
              alt="Product"
              className="w-32 h-32 object-cover rounded-lg mx-auto"
            />
          </div>
        )}

        {/* Product information display */}
        {(currentStep === Step.REVIEW || currentStep === Step.SUBMIT) && (
          <div className="mb-4 bg-gray-50 rounded-lg p-4">
            <p className="font-semibold">{productData.name}</p>
            <p className="text-orange-500 font-bold">₹{productData.price}</p>
            <p>
              {productData.quantity} {productData.unit}
            </p>
            <p className="text-gray-500 text-sm">{productData.category}</p>
            {productData.deliveryOptions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {productData.deliveryOptions.map((option) => (
                  <span key={option} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                    {option === "PICKUP" ? "Pickup" : option === "COURIER" ? "Courier" : "Local Delivery"}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Voice status indicator */}
        {currentStep !== Step.PHOTO && (
          <div className="flex justify-center mb-4">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center ${
                isListening ? "bg-red-100 animate-pulse" : isProcessing ? "bg-yellow-100" : "bg-gray-100"
              }`}
            >
              {isListening ? (
                <Mic className="w-10 h-10 text-red-500" />
              ) : isProcessing ? (
                <div className="w-10 h-10 text-yellow-500 animate-spin rounded-full border-4 border-yellow-200 border-t-yellow-500" />
              ) : (
                <MicOff className="w-10 h-10 text-gray-400" />
              )}
            </div>
          </div>
        )}

        {/* Transcript display */}
        {transcript && currentStep !== Step.PHOTO && (
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <p className="text-gray-800 text-center text-sm">{transcript}</p>
          </div>
        )}

        {/* Voice control buttons */}
        {currentStep !== Step.PHOTO && currentStep !== Step.SUBMIT && (
          <div className="flex justify-center">
            <Button
              onClick={isListening ? stopListening : startListening}
              className={`px-6 py-2 rounded-full ${
                isListening ? "bg-red-500 text-white hover:bg-red-600" : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              {isListening ? "Stop" : "Speak"}
            </Button>
          </div>
        )}

        {/* Error message */}
        {voiceError && <p className="text-red-500 text-center mt-4 text-sm">{voiceError}</p>}

        {/* Loading indicator for submission */}
        {currentStep === Step.SUBMIT && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* Help text */}
        <p className="text-xs text-center text-gray-500 mt-6">
          Speak clearly or use the buttons to navigate. You can say "repeat" to hear the instructions again.
        </p>
      </div>
    </div>
  )
}
