"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Edit, Check, X, Shield, Award, Star, ShoppingBag, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      // In a real app, this would check authentication status
      // For demo purposes, we'll use mock data
      const isAuthenticated = localStorage.getItem("isOnboarded") === "true"

      if (!isAuthenticated) {
        router.push("/login")
        return
      }

      // Fetch user data
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Try to get user data from localStorage
        const storedUserData = localStorage.getItem("userData")

        // Mock user data
        const mockUser = storedUserData
          ? JSON.parse(storedUserData)
          : {
              id: "user123",
              name: "Rajesh Kumar",
              phone: "9876543210",
              village: "Chandpur",
              district: "Varanasi",
              role: "SELLER",
              aadhaarLast4: "1234",
              preferredLanguage: "hi-IN",
              verificationStatus: "VERIFIED",
              trustScore: 85,
              trustLevel: "GOLD",
              joinedDate: "2023-01-15",
              profilePhoto: "/placeholder.svg?height=100&width=100",
              orders: [
                {
                  id: "order1",
                  date: "2023-10-15",
                  productName: "Handcrafted Pottery Bowl",
                  status: "DELIVERED",
                  amount: 450,
                },
                {
                  id: "order2",
                  date: "2023-09-22",
                  productName: "Embroidered Wall Hanging",
                  status: "SHIPPED",
                  amount: 850,
                },
              ],
              products: [
                {
                  id: "product1",
                  name: "Handcrafted Pottery Bowl",
                  price: 450,
                  status: "ACTIVE",
                  sales: 12,
                },
                {
                  id: "product2",
                  name: "Embroidered Wall Hanging",
                  price: 850,
                  status: "ACTIVE",
                  sales: 8,
                },
              ],
              reviews: [
                {
                  id: "review1",
                  productName: "Handcrafted Pottery Bowl",
                  rating: 5,
                  comment: "Beautiful craftsmanship!",
                  reviewerName: "Anita Sharma",
                  date: "2023-10-20",
                },
              ],
            }

        setUser(mockUser)
        setEditedUser(mockUser)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleEditProfile = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedUser(user)
  }

  const handleSaveProfile = () => {
    setUser(editedUser)
    setIsEditing(false)

    // Save to localStorage for demo purposes
    localStorage.setItem("userData", JSON.stringify(editedUser))

    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedUser((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleVerifyAccount = () => {
    toast({
      title: "Verification initiated",
      description: "Your verification process has been started. You will be notified once completed.",
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="mt-4 text-lg font-medium text-gray-900">User not found</h3>
          <p className="mt-2 text-sm text-gray-500">Please log in to view your profile</p>
          <Button onClick={() => router.push("/login")} className="mt-4">
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                    {user.profilePhoto ? (
                      <img
                        src={user.profilePhoto || "/placeholder.svg"}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-orange-800 text-3xl font-bold">{user.name.charAt(0)}</span>
                    )}
                  </div>
                  <CardTitle className="text-xl text-center">{user.name}</CardTitle>
                  <CardDescription className="text-center">
                    {user.village}, {user.district}
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button variant="ghost" size="icon" onClick={handleEditProfile}>
                    <Edit className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
                      <X className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleSaveProfile}>
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" value={editedUser.name} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" value={editedUser.phone} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="village">Village</Label>
                      <Input id="village" name="village" value={editedUser.village} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">District</Label>
                      <Input id="district" name="district" value={editedUser.district} onChange={handleInputChange} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Phone:</span>
                      <span>{user.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Role:</span>
                      <Badge variant="outline">{user.role === "SELLER" ? "Seller" : "Buyer"}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Member since:</span>
                      <span>{new Date(user.joinedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Preferred language:</span>
                      <span>
                        {user.preferredLanguage === "hi-IN"
                          ? "Hindi"
                          : user.preferredLanguage === "en-IN"
                            ? "English"
                            : user.preferredLanguage === "ta-IN"
                              ? "Tamil"
                              : user.preferredLanguage === "te-IN"
                                ? "Telugu"
                                : user.preferredLanguage}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch pt-0">
              <Separator className="my-4" />
              <div className="space-y-4 w-full">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Trust Score</span>
                    <span className="text-sm font-medium">{user.trustScore}%</span>
                  </div>
                  <Progress value={user.trustScore} className="h-2" />
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Trust Level:</span>
                  <Badge
                    className={
                      user.trustLevel === "PLATINUM"
                        ? "bg-blue-500"
                        : user.trustLevel === "GOLD"
                          ? "bg-yellow-500"
                          : user.trustLevel === "SILVER"
                            ? "bg-gray-400"
                            : "bg-amber-600"
                    }
                  >
                    <Award className="h-3 w-3 mr-1" />
                    {user.trustLevel}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Verification:</span>
                  <Badge
                    variant={user.verificationStatus === "VERIFIED" ? "default" : "outline"}
                    className={
                      user.verificationStatus === "VERIFIED"
                        ? "bg-green-500"
                        : user.verificationStatus === "PENDING"
                          ? "text-yellow-600 border-yellow-600"
                          : "text-red-600 border-red-600"
                    }
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    {user.verificationStatus}
                  </Badge>
                </div>
                {user.verificationStatus !== "VERIFIED" && (
                  <Button onClick={handleVerifyAccount} className="w-full mt-2">
                    <Shield className="h-4 w-4 mr-2" />
                    Verify Account
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <ShoppingBag className="h-6 w-6 mx-auto text-orange-600 mb-2" />
                      <p className="text-2xl font-bold">{user.orders?.length || 0}</p>
                      <p className="text-sm text-gray-500">Orders</p>
                    </div>
                    {user.role === "SELLER" && (
                      <div className="bg-orange-50 p-4 rounded-lg text-center">
                        <Star className="h-6 w-6 mx-auto text-orange-600 mb-2" />
                        <p className="text-2xl font-bold">{user.products?.length || 0}</p>
                        <p className="text-sm text-gray-500">Products</p>
                      </div>
                    )}
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <Award className="h-6 w-6 mx-auto text-orange-600 mb-2" />
                      <p className="text-2xl font-bold">{user.reviews?.length || 0}</p>
                      <p className="text-sm text-gray-500">Reviews</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {user.orders && user.orders.length > 0 ? (
                    <div className="space-y-4">
                      {user.orders.slice(0, 3).map((order: any) => (
                        <div key={order.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{order.productName}</p>
                            <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center">
                            <Badge
                              variant="outline"
                              className={
                                order.status === "DELIVERED"
                                  ? "text-green-600 border-green-600"
                                  : order.status === "SHIPPED"
                                    ? "text-blue-600 border-blue-600"
                                    : "text-yellow-600 border-yellow-600"
                              }
                            >
                              {order.status}
                            </Badge>
                            <span className="ml-4 font-medium">₹{order.amount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent activity</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/orders")}>
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Notification Preferences</p>
                        <p className="text-sm text-gray-500">Manage how you receive notifications</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => router.push("/settings/notifications")}>
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Privacy Settings</p>
                        <p className="text-sm text-gray-500">Control your data and privacy</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => router.push("/settings/privacy")}>
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Language Preferences</p>
                        <p className="text-sm text-gray-500">Change your preferred language</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => router.push("/settings/language")}>
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Orders</CardTitle>
                  <CardDescription>View and manage all your orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {user.orders && user.orders.length > 0 ? (
                    <div className="space-y-4">
                      {user.orders.map((order: any) => (
                        <div
                          key={order.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => router.push(`/orders/${order.id}`)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{order.productName}</p>
                              <p className="text-sm text-gray-500">
                                Order #{order.id} • {new Date(order.date).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                order.status === "DELIVERED"
                                  ? "text-green-600 border-green-600"
                                  : order.status === "SHIPPED"
                                    ? "text-blue-600 border-blue-600"
                                    : "text-yellow-600 border-yellow-600"
                              }
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <span className="font-bold">₹{order.amount}</span>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
                      <p className="mt-2 text-sm text-gray-500">Start shopping to see your orders here</p>
                      <Button onClick={() => router.push("/products")} className="mt-4">
                        Browse Products
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab (for sellers) */}
            <TabsContent value="products" className="pt-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Your Products</CardTitle>
                      <CardDescription>Manage your product listings</CardDescription>
                    </div>
                    {user.role === "SELLER" && (
                      <Button onClick={() => router.push("/seller/products/new")}>Add New Product</Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {user.role === "SELLER" ? (
                    user.products && user.products.length > 0 ? (
                      <div className="space-y-4">
                        {user.products.map((product: any) => (
                          <div
                            key={product.id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => router.push(`/seller/products/${product.id}`)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-500">{product.sales} sales</p>
                              </div>
                              <Badge
                                variant={product.status === "ACTIVE" ? "default" : "outline"}
                                className={
                                  product.status === "ACTIVE" ? "bg-green-500" : "text-gray-600 border-gray-600"
                                }
                              >
                                {product.status}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                              <span className="font-bold">₹{product.price}</span>
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ShoppingBag className="h-12 w-12 mx-auto text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No products yet</h3>
                        <p className="mt-2 text-sm text-gray-500">Start selling by adding your first product</p>
                        <Button onClick={() => router.push("/seller/products/new")} className="mt-4">
                          Add Product
                        </Button>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium text-gray-900">Buyer Account</h3>
                      <p className="mt-2 text-sm text-gray-500">This section is only available for seller accounts</p>
                      <Button
                        onClick={() => {
                          setUser({ ...user, role: "SELLER" })
                          localStorage.setItem("userData", JSON.stringify({ ...user, role: "SELLER" }))
                          toast({
                            title: "Account upgraded",
                            description: "Your account has been upgraded to a seller account.",
                          })
                        }}
                        className="mt-4"
                      >
                        Upgrade to Seller
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reviews</CardTitle>
                  <CardDescription>
                    {user.role === "SELLER" ? "Reviews from your customers" : "Your reviews on products"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user.reviews && user.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {user.reviews.map((review: any) => (
                        <div key={review.id} className="border-b pb-4">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{review.productName}</h3>
                            <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center my-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            {user.role === "SELLER" ? `By ${review.reviewerName}` : `For ${review.productName}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Star className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No reviews yet</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        {user.role === "SELLER"
                          ? "When customers review your products, they will appear here"
                          : "When you review products, they will appear here"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
