"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShoppingBag, ChevronRight, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  useEffect(() => {
    // Fetch orders (mock data for now)
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock order data
        const mockOrders = [
          {
            id: "ORD12345",
            date: "2023-10-15",
            productName: "Handcrafted Pottery Bowl",
            productImage: "/placeholder.svg?height=80&width=80",
            sellerName: "Lakshmi Devi",
            status: "DELIVERED",
            amount: 450,
            paymentMethod: "UPI",
            deliveryAddress: "123 Main St, Kanchipuram, Tamil Nadu",
            trackingId: "TRK987654",
          },
          {
            id: "ORD12346",
            date: "2023-09-22",
            productName: "Embroidered Wall Hanging",
            productImage: "/placeholder.svg?height=80&width=80",
            sellerName: "Priya Singh",
            status: "SHIPPED",
            amount: 850,
            paymentMethod: "Cash on Delivery",
            deliveryAddress: "456 Park Ave, Jaipur, Rajasthan",
            trackingId: "TRK987655",
          },
          {
            id: "ORD12347",
            date: "2023-11-05",
            productName: "Organic Honey",
            productImage: "/placeholder.svg?height=80&width=80",
            sellerName: "Ramesh Kumar",
            status: "PROCESSING",
            amount: 350,
            paymentMethod: "UPI",
            deliveryAddress: "789 River Rd, Dehradun, Uttarakhand",
            trackingId: null,
          },
          {
            id: "ORD12348",
            date: "2023-11-10",
            productName: "Hand-woven Cotton Saree",
            productImage: "/placeholder.svg?height=80&width=80",
            sellerName: "Anjali Das",
            status: "PENDING",
            amount: 1200,
            paymentMethod: "Cash on Delivery",
            deliveryAddress: "321 Lake View, Kolkata, West Bengal",
            trackingId: null,
          },
        ]

        setOrders(mockOrders)
        setFilteredOrders(mockOrders)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Apply filters
  useEffect(() => {
    let result = [...orders]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (order) =>
          order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.sellerName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter)
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date()
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
      const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 60)) // already subtracted 30, so 60 more for 90 total

      if (dateFilter === "30days") {
        result = result.filter((order) => new Date(order.date) >= thirtyDaysAgo)
      } else if (dateFilter === "90days") {
        result = result.filter((order) => new Date(order.date) >= ninetyDaysAgo)
      }
    }

    setFilteredOrders(result)
  }, [searchTerm, statusFilter, dateFilter, orders])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already applied via useEffect
  }

  const handleOrderClick = (orderId: string) => {
    router.push(`/orders/${orderId}`)
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-500"
      case "SHIPPED":
        return "bg-blue-500"
      case "PROCESSING":
        return "bg-yellow-500"
      case "PENDING":
        return "bg-gray-500"
      case "CANCELLED":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

      <div className="mb-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" onClick={() => setStatusFilter("all")}>
              All
            </TabsTrigger>
            <TabsTrigger value="processing" onClick={() => setStatusFilter("PROCESSING")}>
              Processing
            </TabsTrigger>
            <TabsTrigger value="shipped" onClick={() => setStatusFilter("SHIPPED")}>
              Shipped
            </TabsTrigger>
            <TabsTrigger value="delivered" onClick={() => setStatusFilter("DELIVERED")}>
              Delivered
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
        {/* Mobile filter button */}
        <div className="md:hidden w-full">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Filter your orders</SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Order Status</h3>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PROCESSING">Processing</SelectItem>
                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Order Date</h3>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="90days">Last 90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Search bar */}
        <div className="w-full">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </div>

        {/* Desktop filters */}
        <div className="hidden md:flex space-x-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <ShoppingBag className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
          <p className="mt-2 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
          <Button onClick={() => router.push("/products")} className="mt-4">
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleOrderClick(order.id)}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={order.productImage || "/placeholder.svg"}
                    alt={order.productName}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div>
                      <h3 className="font-medium">{order.productName}</h3>
                      <p className="text-sm text-gray-500">
                        Order #{order.id} • {new Date(order.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">Seller: {order.sellerName}</p>
                    </div>
                    <div className="mt-2 md:mt-0 flex flex-col items-start md:items-end">
                      <Badge className={getStatusBadgeColor(order.status)}>{order.status}</Badge>
                      <p className="font-bold mt-1">₹{order.amount}</p>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 self-center">
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
