"use client"

import { useState } from "react"
import { Mic, Package, CreditCard, Truck } from "lucide-react"

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<"buyer" | "seller">("buyer")

  const buyerSteps = [
    {
      title: "Discover Products",
      description: "Use voice commands to search for products or browse categories.",
      icon: Mic,
    },
    {
      title: "Select and Order",
      description: "Choose products and place orders using simple voice commands.",
      icon: Package,
    },
    {
      title: "Easy Payment",
      description: "Pay using UPI, cash on delivery, or other simple payment methods.",
      icon: CreditCard,
    },
    {
      title: "Receive Products",
      description: "Get your products delivered to your doorstep or pick up from a local hub.",
      icon: Truck,
    },
  ]

  const sellerSteps = [
    {
      title: "Create Listings",
      description: "Describe your products using voice and take photos to create listings.",
      icon: Mic,
    },
    {
      title: "Manage Orders",
      description: "Receive order notifications and accept or decline using voice commands.",
      icon: Package,
    },
    {
      title: "Arrange Delivery",
      description: "Coordinate pickup or delivery through the app with voice assistance.",
      icon: Truck,
    },
    {
      title: "Get Paid",
      description: "Receive payments directly to your bank account or UPI.",
      icon: CreditCard,
    },
  ]

  const steps = activeTab === "buyer" ? buyerSteps : sellerSteps

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-orange-600 font-semibold tracking-wide uppercase">How It Works</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Simple steps to {activeTab === "buyer" ? "buy" : "sell"} products
          </p>

          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => setActiveTab("buyer")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "buyer" ? "bg-orange-100 text-orange-800" : "text-gray-600 hover:text-orange-600"
              }`}
            >
              For Buyers
            </button>
            <button
              onClick={() => setActiveTab("seller")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "seller" ? "bg-orange-100 text-orange-800" : "text-gray-600 hover:text-orange-600"
              }`}
            >
              For Sellers
            </button>
          </div>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-x-8 md:gap-y-10">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 text-orange-600 mb-4">
                    <step.icon className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <div className="absolute -top-2 -right-2 flex items-center justify-center h-8 w-8 rounded-full bg-orange-500 text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">{step.title}</h3>
                  <p className="mt-2 text-base text-gray-500 text-center">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
