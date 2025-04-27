"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, Phone } from "lucide-react"
import Navbar from "@/components/common/navbar"
import VoiceAssistantButton from "@/components/voice/voice-assistant-button"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loginMethod, setLoginMethod] = useState<"phone" | "voice">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"phone" | "otp">("phone")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would call an authentication API
      console.log("Logging in with:", phoneNumber, otp)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to home page after successful login
      router.push("/")
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would call an API to send OTP
      console.log("Sending OTP to:", phoneNumber)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Move to OTP verification step
      setStep("otp")
    } catch (error) {
      console.error("OTP sending error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceLogin = () => {
    setLoginMethod("voice")
    // In a real app, this would trigger voice authentication
    console.log("Starting voice authentication")
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      <main className="container mx-auto flex flex-col items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">Login to access your HaathSe account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="phone" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="phone" onClick={() => setLoginMethod("phone")}>
                  <Phone className="mr-2 h-4 w-4" />
                  Phone
                </TabsTrigger>
                <TabsTrigger value="voice" onClick={() => setLoginMethod("voice")}>
                  <Mic className="mr-2 h-4 w-4" />
                  Voice
                </TabsTrigger>
              </TabsList>

              <TabsContent value="phone">
                {step === "phone" ? (
                  <form onSubmit={handleSendOtp}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your 10-digit phone number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                        {isLoading ? "Sending OTP..." : "Send OTP"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleLogin}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="otp">OTP Verification</Label>
                        <Input
                          id="otp"
                          type="text"
                          placeholder="Enter the 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                        <p className="text-sm text-gray-500">
                          OTP sent to {phoneNumber}.
                          <button
                            type="button"
                            onClick={() => setStep("phone")}
                            className="text-orange-600 hover:text-orange-800 ml-1"
                          >
                            Change?
                          </button>
                        </p>
                      </div>
                      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                        {isLoading ? "Verifying..." : "Verify & Login"}
                      </Button>
                    </div>
                  </form>
                )}
              </TabsContent>

              <TabsContent value="voice">
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="mb-6 w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
                    <Mic className="h-12 w-12 text-orange-500" />
                  </div>
                  <p className="text-center mb-6">Press the button and say your voice passphrase to login</p>
                  <Button onClick={handleVoiceLogin} className="bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                    {isLoading ? "Listening..." : "Start Voice Login"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-500">
              Don't have an account?{" "}
              <Link href="/register" className="text-orange-600 hover:text-orange-800">
                Register
              </Link>
            </div>
            <div className="text-xs text-center text-gray-400">
              By logging in, you agree to our Terms of Service and Privacy Policy
            </div>
          </CardFooter>
        </Card>
      </main>
      <VoiceAssistantButton />
    </div>
  )
}
