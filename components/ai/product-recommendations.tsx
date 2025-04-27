"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

type Product = {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
}

export default function ProductRecommendations({ userInterests = "", userLocation = "" }) {
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getRecommendations = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const cachedRecommendations = localStorage.getItem("cachedRecommendations")
      const cacheTimestamp = localStorage.getItem("recommendationsCacheTime")

      if (cachedRecommendations && cacheTimestamp) {
        const cacheAge = Date.now() - Number.parseInt(cacheTimestamp)
        const cacheValidFor = 60 * 60 * 1000

        if (cacheAge < cacheValidFor) {
          setRecommendations(JSON.parse(cachedRecommendations))
          setIsLoading(false)
          return
        }
      }

      const interests = userInterests || "handicrafts, traditional art, home decor"
      const location = userLocation || "India"

      console.log("Using mock recommendations")
      const mockRecommendations = getMockRecommendations()
      setRecommendations(mockRecommendations)

      localStorage.setItem("cachedRecommendations", JSON.stringify(mockRecommendations))
      localStorage.setItem("recommendationsCacheTime", Date.now().toString())

      if (process.env.NODE_ENV !== "development") {
        try {
          const { text } = await generateText({
            model: groq("llama3-8b-8192"),
            prompt: `Generate 3 product recommendations...`, // your existing prompt
            temperature: 0.7,
            maxTokens: 500,
          })

          try {
            const parsedRecommendations = JSON.parse(text)
            localStorage.setItem("cachedRecommendations", JSON.stringify(parsedRecommendations))
            localStorage.setItem("recommendationsCacheTime", Date.now().toString())
            setRecommendations(parsedRecommendations)
          } catch (parseError) {
            console.error("Error parsing recommendations:", parseError)
          }
        } catch (apiError) {
          console.error("Background API call failed:", apiError)
        }
      }
    } catch (err) {
      console.error("Error getting recommendations:", err)
      setError("Failed to get recommendations")
      setRecommendations(getMockRecommendations())
    } finally {
      setIsLoading(false)
    }
  }

  const getMockRecommendations = (): Product[] => {
    const possibleProducts = [
      {
        id: "1",
        name: "Handwoven Bamboo Basket",
        description: "Traditional bamboo basket handcrafted by artisans from Northeast India",
        price: 450,
        category: "Home Decor",
        image: "products/rec1.webp", // Added leading slash
      },
      {
        id: "2",
        name: "Wall Hanging",
        description: "Authentic Madhubani painting depicting rural life scenes from Bihar",
        price: 1200,
        category: "Art",
        image: "products/rec2.webp", // Changed to consistent naming
      },
      {
        id: "3",
        name: "Brass Dhokra Figurine",
        description: "Traditional Dhokra art figurine made using lost-wax casting technique",
        price: 850,
        category: "Handicraft",
        image: "products/rec3.webp", // Changed to consistent naming
      },
      {
        id: "4",
        name: "Cotton Saree",
        description: "Intricately embroidered cushion cover from Rajasthan",
        price: 550,
        category: "Home Decor",
        image: "products/rec4.webp", // Changed to consistent naming
      },
      {
        id: "5",
        name: "Terracotta Wall Hanging",
        description: "Decorative terracotta wall hanging from West Bengal",
        price: 650,
        category: "Home Decor",
        image: "products/rec5.webp", // Changed to consistent naming
      }
    ]

    const shuffled = [...possibleProducts].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 3)
  }

  useEffect(() => {
    getRecommendations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-orange-500" />
            AI-Powered Recommendations
          </CardTitle>
          <CardDescription>Finding perfect products for you...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-orange-500" />
            AI-Powered Recommendations
          </CardTitle>
          <CardDescription>Personalized product suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">
            We couldn't load recommendations right now. Please try again later.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-orange-500" />
          AI-Powered Recommendations
        </CardTitle>
        <CardDescription>Personalized product suggestions based on your interests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/products/${product.id}`)}
            >
              <div className="aspect-square relative"> 
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full"
                 />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm">{product.name}</h3>
                <Badge variant="outline" className="mt-1 mb-2">
                  {product.category}
                </Badge>
                <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
                <p className="font-bold text-orange-600 mt-2">₹{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => router.push("/products")}>
          View All Products
        </Button>
      </CardFooter>
    </Card>
  )
}