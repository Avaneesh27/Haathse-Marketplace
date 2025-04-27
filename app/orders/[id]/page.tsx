"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock order data based on ID
        const mockOrder = {
          id: params.id,
          date: "2023-10-15",
          productName: "Handcrafted Pottery Bowl",
          productImage: "/placeholder.svg?height=200&width=200",
          productDescription: "Beautiful handmade pottery bowl crafted by local artisans",
          quantity: 1,
          unitPrice: 450,
          totalAmount: 450,
          shippingFee: 50,
          tax: 25,
          grandTotal: 525,
          paymentMethod: "UPI",
          paymentStatus: "PAID",
          paymentDate: "2023-10-15",
          transactionId: "TXN123456789",
          status: "DELIVERED",
          statusHistory: [
            {
              status: "ORDERED",
              date: "2023-10-15T10:30:00Z",
              description: "Order placed successfully",
            },
            {
              status: "PROCESSING",
              date: "2023-10-16T09:15:00Z",
              description: "Seller is preparing your order",
            },
            {
              status: "SHIPPED",
              date: "2023-10-17T14:20:00Z",
              description: "Order has been shipped",
            },
            {
              status: "DELIVERED",
              date: "2023-10-20T11:45:00Z",
              description: "Order has been delivered",
            },
          ],
          deliveryAddress: {
            name: "Rajesh Kumar",
            phone: "9876543210",
            address: "123 Main Street",
            village: "Chandpur",
            district: "Varanasi",
            state: "Uttar Pradesh",
            pincode: "221001",
          },
          seller: {
            id: "seller1",
            name: "Lakshmi Devi",
            phone: "9876543210",
            village: "Kanchipuram",
            district: "Tamil Nadu",
          },
          trackingId: "TRK987654",
          trackingUrl: "https://example.com/track/TRK987654",
          estimatedDelivery: "2023-10-20",
          actualDelivery: "2023-10-20",
        }

        setOrder(mockOrder)
      } catch (error) {
        console.error("Error fetching order details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [params.id])

  const handleContactSeller = () => {
    toast({
      title: "Contact initiated",
      description: `You will receive a call from ${order.seller.name} shortly`,
    })
  }

  const handleTrackOrder = () => {
    if (order.trackingUrl) {
      window.open(order.trackingUrl, "_blank")
    } else {
      toast({
        title: "Tracking unavailable",
        description: "Tracking information is not available for this order",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ORDERED":
        return <Clock className="h-6 w-6 text-blue-500" />
      case "PROCESSING":
        return <Package className="h-6 w-6 text-yellow-500" />
      case "SHIPPED":
        return <Truck className="h-6 w-6 text-purple-500" />
      case "DELIVERED":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      default:
        return <Clock className="h-6 w-6 text-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="mt-4 text-lg font-medium text-gray-900">Order not found</h3>
          <p className="mt-2 text-sm text-gray-500">The order you're looking for doesn't exist or has been removed</p>
          <Button onClick={() => router.push("/orders")} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.push("/orders")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Orders
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">Order #{order.id}</CardTitle>
                  <p className="text-sm text-gray-500">Placed on {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <Badge
                  className={
                    order.status === "DELIVERED"
                      ? "bg-green-500"
                      : order.status === "SHIPPED"
                        ? "bg-blue-500"
                        : order.status === "PROCESSING"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                  }
                >
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="flex-shrink-0">
                  <img
                    src={order.productImage || "/placeholder.svg"}
                    alt={order.productName}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium">{order.productName}</h3>
                  <p className="text-sm text-gray-600">{order.productDescription}</p>
                  <div className="flex justify-between mt-2">
                    <p className="text-sm">
                      Quantity: <span className="font-medium">{order.quantity}</span>
                    </p>
                    <p className="font-bold">₹{order.unitPrice}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Order Timeline */}
              <div>
                <h3 className="font-medium mb-4">Order Timeline</h3>
                <div className="space-y-6">
                  {order.statusHistory.map((status: any, index: number) => (
                    <div key={status.status} className="flex">
                      <div className="flex flex-col items-center mr-4">
                        {getStatusIcon(status.status)}
                        {index < order.statusHistory.length - 1 && (
                          <div className="h-full w-0.5 bg-gray-200 my-1"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{status.status}</p>
                        <p className="text-sm text-gray-600">{status.description}</p>
                        <p className="text-xs text-gray-500">{new Date(status.date).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {order.trackingId && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="font-medium mb-2">Tracking Information</h3>
                    <p className="text-sm">
                      Tracking ID: <span className="font-medium">{order.trackingId}</span>
                    </p>
                    {order.estimatedDelivery && (
                      <p className="text-sm mt-1">
                        Estimated Delivery:{" "}
                        <span className="font-medium">{new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                      </p>
                    )}
                    <Button onClick={handleTrackOrder} className="mt-3" variant="outline">
                      <Truck className="h-4 w-4 mr-2" />
                      Track Order
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Details Sidebar */}
        <div className="md:col-span-1 space-y-6">
          {/* Payment Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Payment Method:</span>
                  <span>{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Payment Status:</span>
                  <Badge
                    variant="outline"
                    className={
                      order.paymentStatus === "PAID"
                        ? "text-green-600 border-green-600"
                        : "text-yellow-600 border-yellow-600"
                    }
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
                {order.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Transaction ID:</span>
                    <span className="text-sm">{order.transactionId}</span>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Subtotal:</span>
                  <span>₹{order.totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Shipping Fee:</span>
                  <span>₹{order.shippingFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Tax:</span>
                  <span>₹{order.tax}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>₹{order.grandTotal}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Delivery Address
                  </h3>
                  <p className="mt-1">{order.deliveryAddress.name}</p>
                  <p className="text-sm text-gray-600">
                    {order.deliveryAddress.address}, {order.deliveryAddress.village}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.deliveryAddress.district}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                  </p>
                  <p className="text-sm text-gray-600">Phone: {order.deliveryAddress.phone}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    Seller Information
                  </h3>
                  <p className="mt-1">{order.seller.name}</p>
                  <p className="text-sm text-gray-600">
                    {order.seller.village}, {order.seller.district}
                  </p>
                  <Button onClick={handleContactSeller} className="mt-2 w-full" variant="outline" size="sm">
                    Contact Seller
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full" onClick={() => router.push(`/support/order/${order.id}`)}>
                Report an Issue
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  if (order.status === "DELIVERED") {
                    router.push(`/review/order/${order.id}`)
                  } else {
                    toast({
                      title: "Cannot review yet",
                      description: "You can only review products after they have been delivered",
                    })
                  }
                }}
              >
                Write a Review
              </Button>
              {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                <Button
                  variant="outline"
                  className="w-full text-red-600 border-red-600 hover:bg-red-50"
                  onClick={() => {
                    toast({
                      title: "Cancel request submitted",
                      description: "Your cancellation request has been submitted for review",
                    })
                  }}
                >
                  Cancel Order
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
