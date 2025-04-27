"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mic } from "lucide-react"
import { useVoiceCommand } from "@/hooks/use-voice-command"
import { playTextToSpeech } from "@/lib/speech-utils"

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<"buyer" | "seller">("buyer")
  const { isListening, transcript, isProcessing, startListening, stopListening } = useVoiceCommand({
    autoStart: false,
    enableContinuousListening: false,
  })

  const handleVoiceStart = async () => {
    await playTextToSpeech("How can I help you today?")
    startListening()
  }

  return (
    <div className="relative bg-gradient-to-b from-orange-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Voice-First</span>
                <span className="block text-orange-600">Rural Marketplace</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Connecting rural artisans with buyers through a simple voice interface. No tech expertise needed - just
                speak to create, buy, and sell handcrafted products.
              </p>

              <div className="mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link href={activeTab === "buyer" ? "/buyer/products" : "/seller/dashboard"}>
                    <Button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 md:py-4 md:text-lg md:px-10">
                      {activeTab === "buyer" ? "Start Shopping" : "Sell Products"}
                    </Button>
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Button
                    onClick={isListening ? stopListening : handleVoiceStart}
                    variant="outline"
                    className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md md:py-4 md:text-lg md:px-10 ${
                      isListening
                        ? "bg-red-100 text-red-700 border-red-300"
                        : "bg-white text-orange-700 border-orange-300"
                    }`}
                  >
                    <Mic className="mr-2 h-5 w-5" />
                    {isListening ? "Listening..." : "Speak Now"}
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex space-x-4 sm:justify-center lg:justify-start">
                  <button
                    onClick={() => setActiveTab("buyer")}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      activeTab === "buyer" ? "bg-orange-100 text-orange-800" : "text-gray-600 hover:text-orange-600"
                    }`}
                  >
                    I want to buy
                  </button>
                  <button
                    onClick={() => setActiveTab("seller")}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      activeTab === "seller" ? "bg-orange-100 text-orange-800" : "text-gray-600 hover:text-orange-600"
                    }`}
                  >
                    I want to sell
                  </button>
                </div>
              </div>

              {transcript && (
                <div className="mt-4 p-3 bg-white rounded-lg shadow-sm">
                  <p className="text-gray-700">{transcript}</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      <div className="relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 overflow-hidden">
  <img
    className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full [mask-image:linear-gradient(to_right,transparent,black)]"
    src="/artisans.webp"
    alt="Rural artisan creating handcrafted products"
  />
</div>

    </div>
  )
}
