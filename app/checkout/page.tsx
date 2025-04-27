"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Truck, MapPin, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: "",
    phone: "",
    address: "",
    village: "",
    district: "",
    state: "",
    pincode: "",
  })
  const [upiId, setUpiId] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Fetch cart items (mock data for now)
    const fetchCartItems = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock cart data
        const mockCartItems = [
          {
            id: "1",
            name: "Handcrafted Pottery Bowl",
            image: "/placeholder.svg?height=80&width=80",
            price: 450,
            quantity: 1,
            seller: "Lakshmi Devi",
          },
        ]

        setCartItems(mockCartItems)

        // Try to get user data from localStorage for pre-filling address
        const storedUserData = localStorage.getItem("userData")
        if (storedUserData) {
          const userData = JSON.parse(storedUserData)
          setDeliveryAddress({
            name: userData.name || "",
            phone: userData.phone || "",
            address: "",
            village: userData.village || "",
            district: userData.district || "",
            state: userData.state || "",
            pincode: "",
          })
        }
      } catch (error) {
        console.error("Error fetching cart items:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCartItems()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDeliveryAddress((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const calculateShipping = () => {
    // Simple shipping calculation
    const subtotal = calculateSubtotal()
    return subtotal > 1000 ? 0 : 50
  }

  const calculateTax = () => {
    // Simple tax calculation (5%)
    return Math.round(calculateSubtotal() * 0.05)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax()
  }

  const handlePlaceOrder = async () => {
    // Validate form
    if (
      !deliveryAddress.name ||
      !deliveryAddress.phone ||
      !deliveryAddress.address ||
      !deliveryAddress.village ||
      !deliveryAddress.district ||
      !deliveryAddress.state ||
      !deliveryAddress.pincode
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all address fields",
        variant: "destructive",
      })
      return
    }

    if (paymentMethod === "upi" && !upiId) {
      toast({
        title: "Missing UPI ID",
        description: "Please enter your UPI ID",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock order creation
      const orderId = "ORD" + Math.floor(Math.random() * 100000)

      toast({
        title: "Order placed successfully!",
        description: `Your order #${orderId} has been placed`,
      })

      // Redirect to order confirmation
      router.push(`/orders/${orderId}`)
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Error placing order",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
          <p className="mt-2 text-sm text-gray-500">Add some products to your cart before proceeding to checkout</p>
          <Button onClick={() => router.push("/products")} className="mt-4">
            Browse Products
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.push("/cart")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Cart
      </Button>

      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Checkout Form */}
        <div className="md:col-span-2 space-y-6">
          {/* Delivery Address */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={deliveryAddress.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={deliveryAddress.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={deliveryAddress.address}
                  onChange={handleInputChange}
                  placeholder="Enter your street address"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="village">Village/Town</Label>
                  <Input
                    id="village"
                    name="village"
                    value={deliveryAddress.village}
                    onChange={handleInputChange}
                    placeholder="Enter your village or town"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    name="district"
                    value={deliveryAddress.district}
                    onChange={handleInputChange}
                    placeholder="Enter your district"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={deliveryAddress.state}
                    onChange={handleInputChange}
                    placeholder="Enter your state"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={deliveryAddress.pincode}
                    onChange={handleInputChange}
                    placeholder="Enter your PIN code"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upi" onValueChange={(value) => setPaymentMethod(value)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="upi">UPI</TabsTrigger>
                  <TabsTrigger value="cod">Cash on Delivery</TabsTrigger>
                  <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
                </TabsList>
                <TabsContent value="upi" className="pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        id="upiId"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="Enter your UPI ID (e.g., name@upi)"
                      />
                    </div>
                    <div className="bg-orange-50 p-4 rounded-md flex items-start">
                      <AlertCircle className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-orange-700">
                        You will receive a payment request on your UPI app after placing the order.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="cod" className="pt-4">
                  <div className="space-y-4">
                    <RadioGroup defaultValue="cash">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash">Cash on Delivery</Label>
                      </div>
                    </RadioGroup>
                    <div className="bg-orange-50 p-4 rounded-md flex items-start">
                      <AlertCircle className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-orange-700">Please keep exact change ready at the time of delivery.</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="bank" className="pt-4">
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-md flex items-start">
                      <AlertCircle className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-orange-700">
                        Bank transfer details will be shared with you after placing the order.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Shipping Method */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Shipping Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue="standard">
                <div className="flex items-start space-x-2 mb-3">
                  <RadioGroupItem value="standard" id="standard" className="mt-1" />
                  <div>
                    <Label htmlFor="standard" className="font-medium">
                      Standard Delivery
                    </Label>
                    <p className="text-sm text-gray-500">Delivery within 5-7 business days</p>
                    <p className="text-sm font-medium">
                      {calculateShipping() === 0 ? "Free" : `₹${calculateShipping()}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="express" id="express" className="mt-1" disabled />
                  <div>
                    <Label htmlFor="express" className="font-medium text-gray-400">
                      Express Delivery
                    </Label>
                    <p className="text-sm text-gray-400">Delivery within 2-3 business days</p>
                    <p className="text-sm font-medium text-gray-400">₹120</p>
                    <p className="text-xs text-gray-400 mt-1">(Not available in your area)</p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">Seller: {item.seller}</p>
                      <div className="flex justify-between mt-1">
                        <p className="text-sm">Qty: {item.quantity}</p>
                        <p className="font-medium">₹{item.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Subtotal:</span>
                  <span>₹{calculateSubtotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Shipping:</span>
                  <span>{calculateShipping() === 0 ? "Free" : `₹${calculateShipping()}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Tax (5%):</span>
                  <span>₹{calculateTax()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button onClick={handlePlaceOrder} className="w-full" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Place Order
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-gray-500">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
