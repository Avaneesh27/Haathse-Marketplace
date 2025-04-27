"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useVoiceCommand } from "@/hooks/use-voice-command"
import { playTextToSpeech } from "@/lib/speech-utils"
import { Mic, MicOff, ChevronLeft, ChevronRight, ShoppingCart, Phone, Info, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/common/navbar"

// Interaction modes
enum Mode {
  SEARCH = "search",
  BROWSE = "browse",
  DETAIL = "detail",
  CONTACT = "contact",
  CART = "cart",
}

export default function VoiceProductDiscovery() {
  const router = useRouter()

  // Search states
  const [searchTerm, setSearchTerm] = useState("")
  const [searchFilters, setSearchFilters] = useState({
    category: "",
    minPrice: 0,
    maxPrice: 0,
    region: "",
    verifiedOnly: false,
  })
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [currentProductIndex, setCurrentProductIndex] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [sellerProfile, setSellerProfile] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)

  const [currentMode, setCurrentMode] = useState<Mode>(Mode.SEARCH)

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
    commandTimeout: 8000,
  })

  // Initialize with voice prompt
  useEffect(() => {
    if (!isSearching) {
      initializeSearch()
    }
  }, [])

  // Process transcript when available
  useEffect(() => {
    if (transcript && !isProcessing) {
      handleVoiceCommand(transcript)
    }
  }, [transcript, isProcessing])

  // Initialize search with voice prompt
  const initializeSearch = async () => {
    await playTextToSpeech("Welcome to HaathSe product discovery. What would you like to search for?")
    startListening()
  }

  // Handle voice commands based on current mode
  const handleVoiceCommand = async (text: string) => {
    const lowerText = text.toLowerCase()
    switch (currentMode) {
      case Mode.SEARCH:
        await handleSearchMode(lowerText)
        break
      case Mode.BROWSE:
        await handleBrowseMode(lowerText)
        break
      case Mode.DETAIL:
        await handleDetailMode(lowerText)
        break
      case Mode.CONTACT:
        await handleContactMode(lowerText)
        break
      case Mode.CART:
        await handleCartMode(lowerText)
        break
    }
  }

  // Handle search mode commands
  const handleSearchMode = async (text: string) => {
    // Process search terms
    setIsSearching(true)
    try {
      // For demo purposes, we'll use a simple search
      setSearchTerm(text)

      // Extract category if mentioned
      if (text.includes("handicraft") || text.includes("हस्तशिल्प")) {
        setSearchFilters((prev) => ({ ...prev, category: "handicraft" }))
      } else if (text.includes("food") || text.includes("खाद्य")) {
        setSearchFilters((prev) => ({ ...prev, category: "food" }))
      } else if (text.includes("textile") || text.includes("कपड़ा")) {
        setSearchFilters((prev) => ({ ...prev, category: "textiles" }))
      }

      // Perform the search
      await performSearch(text)
    } catch (error) {
      console.error("Error processing search query:", error)
      await playTextToSpeech("Sorry, I had trouble searching. Please try again.")
      startListening()
    }
  }

  // Perform product search
  const performSearch = async (query: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate mock results
      const mockProducts = [
        {
          id: "1",
          name: "Handcrafted Pottery Bowl",
          description: "Beautiful handmade pottery bowl crafted by local artisans",
          category: "handicraft",
          price: 450,
          quantity: 5,
          unit: "piece",
          photos: ["/placeholder.svg?height=300&width=300"],
          sellerId: "seller1",
          region: "Tamil Nadu",
        },
        {
          id: "2",
          name: "Embroidered Wall Hanging",
          description: "Traditional embroidery wall hanging with intricate designs",
          category: "handicraft",
          price: 850,
          quantity: 3,
          unit: "piece",
          photos: ["/placeholder.svg?height=300&width=300"],
          sellerId: "seller2",
          region: "Rajasthan",
        },
        {
          id: "3",
          name: "Organic Honey",
          description: "Pure organic honey collected from forest beehives",
          category: "food",
          price: 350,
          quantity: 10,
          unit: "bottle",
          photos: ["/placeholder.svg?height=300&width=300"],
          sellerId: "seller3",
          region: "Uttarakhand",
        },
      ]

      // Filter based on search term and filters
      const results = mockProducts.filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase())

        const matchesCategory = !searchFilters.category || product.category === searchFilters.category

        return matchesSearch && matchesCategory
      })

      setSearchResults(results)

      if (results.length === 0) {
        await playTextToSpeech("I couldn't find any products matching your search. Please try a different search term.")
        startListening()
      } else {
        await playTextToSpeech(`I found ${results.length} products matching your search.`)
        // Switch to browse mode
        setCurrentMode(Mode.BROWSE)
        setCurrentProductIndex(0)
        // Announce first product
        announceProduct(results[0])
      }
    } catch (error) {
      console.error("Error searching products:", error)
      await playTextToSpeech("Sorry, there was an error searching for products. Please try again.")
      startListening()
    } finally {
      setIsSearching(false)
    }
  }

  // Handle browse mode commands
  const handleBrowseMode = async (text: string) => {
    if (text.includes("next") || text.includes("आगे") || text.includes("अगला")) {
      // Go to next product
      if (currentProductIndex < searchResults.length - 1) {
        setCurrentProductIndex((prev) => prev + 1)
        announceProduct(searchResults[currentProductIndex + 1])
      } else {
        await playTextToSpeech("You have reached the end of the results.")
        startListening()
      }
    } else if (text.includes("previous") || text.includes("back") || text.includes("पीछे") || text.includes("पिछला")) {
      // Go to previous product
      if (currentProductIndex > 0) {
        setCurrentProductIndex((prev) => prev - 1)
        announceProduct(searchResults[currentProductIndex - 1])
      } else {
        await playTextToSpeech("You are at the beginning of the results.")
        startListening()
      }
    } else if (text.includes("details") || text.includes("more") || text.includes("विवरण") || text.includes("अधिक")) {
      // View product details
      setSelectedProduct(searchResults[currentProductIndex])
      setCurrentMode(Mode.DETAIL)
      // Fetch seller profile
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Mock seller profile
        const seller = {
          id: searchResults[currentProductIndex].sellerId,
          name: "Ramesh Kumar",
          village: "Chandpur",
          district: "Varanasi",
          phone: "9876543210",
          verificationStatus: "VERIFIED",
          trustScore: 85,
        }

        setSellerProfile(seller)
      } catch (error) {
        console.error("Error fetching seller profile:", error)
      }
      announceProductDetails(searchResults[currentProductIndex])
    } else if (
      text.includes("search") ||
      text.includes("new") ||
      text.includes("different") ||
      text.includes("खोज") ||
      text.includes("नया")
    ) {
      // New search
      setCurrentMode(Mode.SEARCH)
      await playTextToSpeech("What would you like to search for?")
      startListening()
    } else {
      // Unrecognized command
      await playTextToSpeech("I didn't understand that. You can say next, previous, details, or new search.")
      startListening()
    }
  }

  // Handle detail mode commands
  const handleDetailMode = async (text: string) => {
    if (text.includes("contact") || text.includes("call") || text.includes("संपर्क") || text.includes("कॉल")) {
      // Contact seller
      setCurrentMode(Mode.CONTACT)
      await playTextToSpeech("Connecting you with the seller.")
      // Simulate contacting seller
      await announceSellerContact(sellerProfile)
    } else if (text.includes("back") || text.includes("return") || text.includes("वापस")) {
      // Go back to browse mode
      setCurrentMode(Mode.BROWSE)
      await playTextToSpeech("Returning to product browsing.")
      announceProduct(searchResults[currentProductIndex])
    } else if (text.includes("buy") || text.includes("purchase") || text.includes("खरीद") || text.includes("क्रय")) {
      // Add to cart
      setCurrentMode(Mode.CART)
      await playTextToSpeech("Adding product to cart.")
      await handleCartAddition(selectedProduct)
    } else {
      // Unrecognized command
      await playTextToSpeech("I didn't understand that. You can say contact seller, go back, or buy this product.")
      startListening()
    }
  }

  // Handle contact mode commands
  const handleContactMode = async (text: string) => {
    if (text.includes("message") || text.includes("send") || text.includes("संदेश") || text.includes("भेज")) {
      // Send message to seller
      await playTextToSpeech("Your message has been sent to the seller. They will contact you soon.")
      setCurrentMode(Mode.BROWSE)
      startListening()
    } else if (text.includes("back") || text.includes("return") || text.includes("वापस")) {
      // Go back to product details
      setCurrentMode(Mode.DETAIL)
      await playTextToSpeech("Returning to product details.")
      announceProductDetails(selectedProduct)
    } else if (text.includes("call") || text.includes("phone") || text.includes("कॉल") || text.includes("फोन")) {
      // Call seller
      await playTextToSpeech("Calling the seller now.")
      // Simulate calling
      setTimeout(() => {
        playTextToSpeech("Call connected.")
      }, 2000)
    } else {
      // Unrecognized command
      await playTextToSpeech("I didn't understand that. You can say send message, go back, or call seller.")
      startListening()
    }
  }

  // Handle cart mode commands
  const handleCartMode = async (text: string) => {
    if (
      text.includes("confirm") ||
      text.includes("buy") ||
      text.includes("purchase") ||
      text.includes("पुष्टि") ||
      text.includes("खरीद")
    ) {
      // Confirm purchase
      await playTextToSpeech("Confirming your purchase.")
      await simulateOrderPlacement()
    } else if (text.includes("back") || text.includes("cancel") || text.includes("वापस") || text.includes("रद्द")) {
      // Cancel purchase
      await playTextToSpeech("Cancelling your purchase.")
      setCurrentMode(Mode.DETAIL)
      announceProductDetails(selectedProduct)
    } else {
      // Unrecognized command
      await playTextToSpeech("I didn't understand that. You can say confirm purchase or cancel.")
      startListening()
    }
  }

  // Announce product in browse mode
  const announceProduct = async (product: any) => {
    try {
      await playTextToSpeech(`Product name: ${product.name}.`)
      await playTextToSpeech(`Price: ${product.price} rupees.`)
      await playTextToSpeech(
        "Say next for the next product, previous for the previous product, or details for more information.",
      )
      startListening()
    } catch (error) {
      console.error("Error announcing product:", error)
      startListening()
    }
  }

  // Announce detailed product information
  const announceProductDetails = async (product: any) => {
    try {
      await playTextToSpeech(`Product name: ${product.name}.`)
      await playTextToSpeech(`Price: ${product.price} rupees.`)
      await playTextToSpeech(`Description: ${product.description}.`)
      await playTextToSpeech(`Seller: ${sellerProfile?.name || "Unknown seller"}.`)
      await playTextToSpeech(
        `Location: ${sellerProfile?.village || "Unknown"}, ${sellerProfile?.district || "Unknown"}.`,
      )
      await playTextToSpeech("You can say contact seller, go back, or buy this product.")
      startListening()
    } catch (error) {
      console.error("Error announcing product details:", error)
      startListening()
    }
  }

  // Announce seller contact information
  const announceSellerContact = async (seller: any) => {
    try {
      await playTextToSpeech(`Seller information: ${seller?.name || ""}.`)
      await playTextToSpeech(`Location: ${seller?.village || ""}, ${seller?.district || ""}.`)
      await playTextToSpeech("You can say send message, call seller, or go back.")
      startListening()
    } catch (error) {
      console.error("Error announcing seller contact:", error)
      setCurrentMode(Mode.DETAIL)
      startListening()
    }
  }

  // Handle adding product to cart
  const handleCartAddition = async (product: any) => {
    try {
      await playTextToSpeech(`Added ${product.name} to your cart.`)
      await playTextToSpeech(`The total price is ${product.price} rupees. Would you like to confirm your purchase?`)
      startListening()
    } catch (error) {
      console.error("Error adding to cart:", error)
      setCurrentMode(Mode.DETAIL)
      startListening()
    }
  }

  // Simulate order placement
  const simulateOrderPlacement = async () => {
    try {
      await playTextToSpeech("Processing your payment...")
      // Simulate payment processing
      setTimeout(async () => {
        await playTextToSpeech("Payment successful!")
        await playTextToSpeech("Your order has been placed. The seller will contact you soon.")

        // Redirect to orders page
        setTimeout(() => {
          router.push("/buyer/orders")
        }, 3000)
      }, 2000)
    } catch (error) {
      console.error("Error placing order:", error)
      await playTextToSpeech("There was an error placing your order. Please try again later.")
      setCurrentMode(Mode.DETAIL)
      startListening()
    }
  }

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      <Navbar />
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mt-6">
        {/* Mode indicator */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-center text-gray-800">
            {currentMode === Mode.SEARCH
              ? "Search Products"
              : currentMode === Mode.BROWSE
                ? "Browse Products"
                : currentMode === Mode.DETAIL
                  ? "Product Details"
                  : currentMode === Mode.CONTACT
                    ? "Contact Seller"
                    : "Confirm Purchase"}
          </h1>
          <div className="flex justify-center mt-2">
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
              {isSearching
                ? "Searching..."
                : currentMode === Mode.SEARCH
                  ? "Say what you're looking for"
                  : currentMode === Mode.BROWSE
                    ? `Product ${currentProductIndex + 1} of ${searchResults.length}`
                    : currentMode === Mode.DETAIL
                      ? "Viewing details"
                      : currentMode === Mode.CONTACT
                        ? "Contact options"
                        : "Ready to purchase"}
            </span>
          </div>
        </div>

        {/* Search bar */}
        {currentMode === Mode.SEARCH && (
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products..."
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={() => performSearch(searchTerm)}
                className="absolute right-2 top-2 bg-orange-500 text-white p-1 rounded-full"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Product browse view */}
        {currentMode === Mode.BROWSE && searchResults.length > 0 && (
          <div className="mb-6">
            <div className="bg-white rounded-lg overflow-hidden shadow border border-gray-200">
              <div className="relative aspect-w-16 aspect-h-9">
                {searchResults[currentProductIndex].photos && searchResults[currentProductIndex].photos.length > 0 ? (
                  <img
                    src={searchResults[currentProductIndex].photos[0] || "/placeholder.svg"}
                    alt={searchResults[currentProductIndex].name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{searchResults[currentProductIndex].name}</h3>
                <p className="text-orange-600 font-bold text-xl">₹{searchResults[currentProductIndex].price}</p>
                <p className="text-gray-600 mt-1">
                  {searchResults[currentProductIndex].quantity} {searchResults[currentProductIndex].unit}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">{`${currentProductIndex + 1} of ${searchResults.length}`}</span>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        if (currentProductIndex > 0) {
                          setCurrentProductIndex((prev) => prev - 1)
                          announceProduct(searchResults[currentProductIndex - 1])
                        }
                      }}
                      disabled={currentProductIndex === 0}
                      variant="outline"
                      size="icon"
                      className={`${currentProductIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedProduct(searchResults[currentProductIndex])
                        setCurrentMode(Mode.DETAIL)
                        // Simulate fetching seller profile
                        setTimeout(() => {
                          const seller = {
                            id: searchResults[currentProductIndex].sellerId,
                            name: "Ramesh Kumar",
                            village: "Chandpur",
                            district: "Varanasi",
                            phone: "9876543210",
                            verificationStatus: "VERIFIED",
                            trustScore: 85,
                          }
                          setSellerProfile(seller)
                          announceProductDetails(searchResults[currentProductIndex])
                        }, 500)
                      }}
                      className="px-3 py-1 bg-orange-500 text-white rounded-full"
                    >
                      <Info className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    <Button
                      onClick={() => {
                        if (currentProductIndex < searchResults.length - 1) {
                          setCurrentProductIndex((prev) => prev + 1)
                          announceProduct(searchResults[currentProductIndex + 1])
                        }
                      }}
                      disabled={currentProductIndex === searchResults.length - 1}
                      variant="outline"
                      size="icon"
                      className={`${currentProductIndex === searchResults.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product detail view */}
        {currentMode === Mode.DETAIL && selectedProduct && (
          <div className="mb-6">
            <div className="bg-white rounded-lg overflow-hidden shadow border border-gray-200">
              <div className="relative aspect-w-16 aspect-h-9">
                {selectedProduct.photos && selectedProduct.photos.length > 0 ? (
                  <img
                    src={selectedProduct.photos[0] || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
                <p className="text-orange-600 font-bold text-2xl mt-2">₹{selectedProduct.price}</p>
                <p className="text-gray-600 mt-2">
                  {selectedProduct.quantity} {selectedProduct.unit}
                </p>

                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800">Description</h3>
                  <p className="text-gray-600 mt-1">{selectedProduct.description}</p>
                </div>

                {sellerProfile && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-800">Seller</h3>
                    <div className="flex items-center mt-2">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-800 font-bold">{sellerProfile.name?.charAt(0) || "S"}</span>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{sellerProfile.name}</p>
                        <p className="text-sm text-gray-500">
                          {sellerProfile.village}, {sellerProfile.district}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <Button
                    onClick={() => {
                      setCurrentMode(Mode.BROWSE)
                      announceProduct(searchResults[currentProductIndex])
                    }}
                    variant="outline"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        setCurrentMode(Mode.CONTACT)
                        announceSellerContact(sellerProfile)
                      }}
                      variant="outline"
                      className="bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200"
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Contact
                    </Button>
                    <Button
                      onClick={() => {
                        setCurrentMode(Mode.CART)
                        handleCartAddition(selectedProduct)
                      }}
                      className="bg-orange-500 text-white hover:bg-orange-600"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Buy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact view */}
        {currentMode === Mode.CONTACT && sellerProfile && (
          <div className="mb-6">
            <div className="bg-white rounded-lg overflow-hidden shadow border border-gray-200 p-4">
              <h2 className="text-xl font-bold mb-4">Contact Seller</h2>

              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-800 font-bold">{sellerProfile.name?.charAt(0) || "S"}</span>
                </div>
                <div className="ml-3">
                  <p className="font-medium">{sellerProfile.name}</p>
                  <p className="text-sm text-gray-500">
                    {sellerProfile.village}, {sellerProfile.district}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <Button
                  onClick={() => playTextToSpeech("Calling the seller now.")}
                  className="w-full py-3 px-4 bg-green-500 text-white rounded-lg flex items-center justify-center hover:bg-green-600"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Call Seller
                </Button>

                <Button
                  onClick={() => playTextToSpeech("Your message has been sent to the seller.")}
                  className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600"
                >
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  Message Seller
                </Button>
              </div>

              <Button
                onClick={() => {
                  setCurrentMode(Mode.DETAIL)
                  announceProductDetails(selectedProduct)
                }}
                variant="outline"
                className="mt-4 w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Details
              </Button>
            </div>
          </div>
        )}

        {/* Cart view */}
        {currentMode === Mode.CART && selectedProduct && (
          <div className="mb-6">
            <div className="bg-white rounded-lg overflow-hidden shadow border border-gray-200 p-4">
              <h2 className="text-xl font-bold mb-4">Confirm Purchase</h2>

              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                  {selectedProduct.photos && selectedProduct.photos.length > 0 ? (
                    <img
                      src={selectedProduct.photos[0] || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <p className="font-medium">{selectedProduct.name}</p>
                  <p className="text-orange-600 font-bold">₹{selectedProduct.price}</p>
                  <p className="text-sm text-gray-500">
                    {selectedProduct.quantity} {selectedProduct.unit}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{selectedProduct.price}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium">₹{Math.round(selectedProduct.price * 0.1)}</span>
                </div>
                <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{Math.round(selectedProduct.price * 1.1)}</span>
                </div>

                <div className="mt-6 space-y-3">
                  <Button
                    onClick={() => {
                      simulateOrderPlacement()
                    }}
                    className="w-full py-3 px-4 bg-orange-500 text-white rounded-lg flex items-center justify-center hover:bg-orange-600"
                  >
                    <Check className="h-5 w-5 mr-2" />
                    Confirm Order
                  </Button>

                  <Button
                    onClick={() => {
                      setCurrentMode(Mode.DETAIL)
                      announceProductDetails(selectedProduct)
                    }}
                    variant="outline"
                    className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Voice status indicator */}
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

        {/* Transcript display */}
        {transcript && (
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <p className="text-gray-800 text-center text-sm">{transcript}</p>
          </div>
        )}

        {/* Voice control buttons */}
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

        {/* Error message */}
        {voiceError && <p className="text-red-500 text-center mt-4 text-sm">{voiceError}</p>}

        {/* Help text */}
        <p className="text-xs text-center text-gray-500 mt-6">
          Speak clearly or use the buttons to navigate. You can say "repeat" to hear the instructions again.
        </p>
      </div>
    </div>
  )
}
