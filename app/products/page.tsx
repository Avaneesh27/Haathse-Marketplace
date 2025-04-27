"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Filter, Search, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function ProductListingPage() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedRegion, setSelectedRegion] = useState("all")

  useEffect(() => {
    // Fetch products (mock data for now)
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock product data
        const mockProducts = [
          {
            id: "1",
            name: "Handcrafted Pottery Bowl",
            description: "Beautiful handmade pottery bowl crafted by local artisans",
            category: "handicraft",
            price: 450,
            quantity: 5,
            unit: "piece",
            photos: "products/rec1.webp",
            sellerId: "seller1",
            region: "Tamil Nadu",
            sellerName: "Lakshmi Devi",
            sellerVerified: true,
          },
          {
            id: "2",
            name: "Embroidered Wall Hanging",
            description: "Traditional embroidery wall hanging with intricate designs",
            category: "handicraft",
            price: 850,
            quantity: 3,
            unit: "piece",
            photos: "products/rec2.webp",
            sellerId: "seller2",
            region: "Rajasthan",
            sellerName: "Priya Singh",
            sellerVerified: true,
          },
          {
            id: "3",
            name: "Organic Honey",
            description: "Pure organic honey collected from forest beehives",
            category: "food",
            price: 350,
            quantity: 10,
            unit: "bottle",
            photos: "products/rec3.webp",
            sellerId: "seller3",
            region: "Uttarakhand",
            sellerName: "Ramesh Kumar",
            sellerVerified: false,
          },
          {
            id: "4",
            name: "Hand-woven Cotton Saree",
            description: "Traditional hand-woven cotton saree with natural dyes",
            category: "textiles",
            price: 1200,
            quantity: 2,
            unit: "piece",
            photos: "products/rec4.webp",
            sellerId: "seller4",
            region: "West Bengal",
            sellerName: "Anjali Das",
            sellerVerified: true,
          },
          {
            id: "5",
            name: "Wooden Carved Elephant",
            description: "Intricately carved wooden elephant figurine",
            category: "handicraft",
            price: 650,
            quantity: 8,
            unit: "piece",
            photos: "products/rec5.webp",
            sellerId: "seller5",
            region: "Kerala",
            sellerName: "Suresh Nair",
            sellerVerified: true,
          },
          {
            id: "6",
            name: "Organic Spice Mix",
            description: "Traditional blend of organic spices for cooking",
            category: "food",
            price: 180,
            quantity: 15,
            unit: "packet",
            photos: "products/rec6.webp",
            sellerId: "seller6",
            region: "Karnataka",
            sellerName: "Meena Rao",
            sellerVerified: false,
          },
          {
            id: "7",
            name: "Bamboo Basket Set",
            description: "Set of 3 handcrafted bamboo baskets of different sizes",
            category: "handicraft",
            price: 550,
            quantity: 4,
            unit: "set",
            photos: "products/rec7.webp",
            sellerId: "seller7",
            region: "Assam",
            sellerName: "Bimal Borah",
            sellerVerified: true,
          },
          {
            id: "8",
            name: "Hand-painted Terracotta Pots",
            description: "Set of hand-painted terracotta pots for plants",
            category: "handicraft",
            price: 750,
            quantity: 6,
            unit: "set",
            photos: "products/rec8.webp",
            sellerId: "seller8",
            region: "Madhya Pradesh",
            sellerName: "Geeta Patel",
            sellerVerified: true,
          },
        ]

        setProducts(mockProducts)
        setFilteredProducts(mockProducts)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Apply filters
  useEffect(() => {
    let result = [...products]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter((product) => product.category === selectedCategory)
    }

    // Apply region filter
    if (selectedRegion !== "all") {
      result = result.filter((product) => product.region === selectedRegion)
    }

    // Apply price range filter
    result = result.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    setFilteredProducts(result)
  }, [searchTerm, selectedCategory, selectedRegion, priceRange, products])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already applied via useEffect
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
  }

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`)
  }

  // Get unique regions for filter
  const regions = ["all", ...new Set(products.map((product) => product.region))]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
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
                <SheetDescription>Narrow down your product search</SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Category</h3>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="handicraft">Handicrafts</SelectItem>
                      <SelectItem value="food">Food Products</SelectItem>
                      <SelectItem value="textiles">Textiles</SelectItem>
                      <SelectItem value="art">Art</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Region</h3>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region === "all" ? "All Regions" : region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium">Price Range</h3>
                    <p className="text-sm text-gray-500">
                      ₹{priceRange[0]} - ₹{priceRange[1]}
                    </p>
                  </div>
                  <Slider
                    defaultValue={[0, 5000]}
                    max={5000}
                    step={100}
                    value={priceRange}
                    onValueChange={handlePriceChange}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop filters */}
        <div className="hidden md:block w-1/4 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Category</h3>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="handicraft">Handicrafts</SelectItem>
                  <SelectItem value="food">Food Products</SelectItem>
                  <SelectItem value="textiles">Textiles</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Region</h3>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region === "all" ? "All Regions" : region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium">Price Range</h3>
                <p className="text-sm text-gray-500">
                  ₹{priceRange[0]} - ₹{priceRange[1]}
                </p>
              </div>
              <Slider
                defaultValue={[0, 5000]}
                max={5000}
                step={100}
                value={priceRange}
                onValueChange={handlePriceChange}
              />
            </div>
          </div>
        </div>

        {/* Product listing */}
        <div className="w-full md:w-3/4">
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search products..."
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

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <ShoppingBag className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
              <p className="mt-2 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="aspect-square relative">
                    <img
                      src={product.photos}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <Badge variant={product.sellerVerified ? "default" : "outline"}>
                        {product.sellerVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-orange-600 font-bold text-xl">₹{product.price}</p>
                    <p className="text-sm text-gray-500">
                      {product.quantity} {product.unit} available
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      <span>{product.region}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span>By {product.sellerName}</span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
