"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShoppingCart, Phone, Heart, Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

// Complete mock products database with all required fields
//const MOCK_PRODUCTS_DB = {
  const MOCK_PRODUCTS_DB = [
    {
      id: "1",
      name: "Handcrafted Pottery Bowl",
      description: "Beautiful handmade pottery bowl crafted by local artisans",
      longDescription: "This exquisite pottery bowl is handcrafted by skilled artisans in rural Tamil Nadu using clay sourced from local riverbeds and traditional firing techniques.",
      category: "handicraft",
      price: 450,
      quantity: 5,
      unit: "piece",
      photos: "products/rec1.webp",
      additionalPhotos: [
        "products/pottery-1.webp",
        "products/pottery-2.webp",
        "products/pottery-3.webp"
      ],
      sellerId: "seller1",
      sellerName: "Lakshmi Devi",
      sellerVerified: true,
      region: "Tamil Nadu",
      materials: "Natural clay, mineral pigments",
      dimensions: "Diameter: 8 inches, Height: 3 inches",
      care: "Hand wash only. Not microwave safe.",
      shipping: "Ships within 2-3 business days",
      reviews: [
        {
          id: "r1",
          userName: "Anita Sharma",
          rating: 5,
          comment: "Beautiful craftsmanship! The bowl is even more stunning in person.",
          date: "2023-10-15",
        },
        {
          id: "r2",
          userName: "Rajesh Patel",
          rating: 4,
          comment: "Good quality product. Shipping was quick.",
          date: "2023-09-22",
        }
      ]
    },
    {
      id: "2",
      name: "Embroidered Wall Hanging",
      description: "Traditional embroidery wall hanging with intricate designs",
      longDescription: "Hand-embroidered by artisans in Rajasthan using traditional mirror work and thread techniques, each piece takes about 2 weeks to complete.",
      category: "handicraft",
      price: 850,
      quantity: 3,
      unit: "piece",
      photos: "products/rec2.webp",
      additionalPhotos: [
        "products/embroidery-1.webp",
        "products/embroidery-2.webp"
      ],
      sellerId: "seller2",
      sellerName: "Priya Singh",
      sellerVerified: true,
      region: "Rajasthan",
      materials: "Cotton fabric, silk threads, mirrors",
      dimensions: "24 x 36 inches",
      care: "Dry clean only",
      shipping: "Ships within 3-5 business days",
      reviews: [
        {
          id: "r3",
          userName: "Neha Gupta",
          rating: 5,
          comment: "Absolutely stunning craftsmanship. The colors are vibrant!",
          date: "2023-11-10",
        }
      ]
    },
    {
      id: "3",
      name: "Organic Honey",
      description: "Pure organic honey collected from forest beehives",
      longDescription: "Sourced directly from beekeepers in Uttarakhand's forests, this raw honey is unprocessed and retains all natural enzymes and health benefits.",
      category: "food",
      price: 350,
      quantity: 10,
      unit: "bottle",
      photos: "products/rec3.webp",
      additionalPhotos: [
        "products/honey-1.webp",
        "products/honey-2.webp"
      ],
      sellerId: "seller3",
      sellerName: "Ramesh Kumar",
      sellerVerified: false,
      region: "Uttarakhand",
      materials: "100% pure forest honey",
      dimensions: "500ml glass jar",
      care: "Store in cool place away from sunlight",
      shipping: "Ships within 1-2 business days",
      reviews: [
        {
          id: "r4",
          userName: "Amit Joshi",
          rating: 4,
          comment: "Authentic taste and good quality packaging.",
          date: "2023-10-28",
        },
        {
          id: "r5",
          userName: "Sunita Reddy",
          rating: 5,
          comment: "Best honey I've ever tasted! Will order again.",
          date: "2023-11-15",
        }
      ]
    },
    {
      id: "4",
      name: "Hand-woven Cotton Saree",
      description: "Traditional hand-woven cotton saree with natural dyes",
      longDescription: "Made by master weavers in West Bengal using traditional handloom techniques and natural dyes, each saree takes 5-7 days to complete.",
      category: "textiles",
      price: 1200,
      quantity: 2,
      unit: "piece",
      photos: "products/rec4.webp",
      additionalPhotos: [
        "products/saree-1.webp",
        "products/saree-2.webp"
      ],
      sellerId: "seller4",
      sellerName: "Anjali Das",
      sellerVerified: true,
      region: "West Bengal",
      materials: "Pure cotton, natural dyes",
      dimensions: "5.5 meters length",
      care: "Dry clean recommended",
      shipping: "Ships within 1-3 business days",
      reviews: []
    },
    {
      id: "5",
      name: "Wooden Carved Elephant",
      description: "Intricately carved wooden elephant figurine",
      longDescription: "Hand-carved from sustainable rosewood by artisans in Kerala, this elephant figurine represents traditional South Indian wood carving techniques.",
      category: "handicraft",
      price: 650,
      quantity: 8,
      unit: "piece",
      photos: "products/rec5.webp",
      additionalPhotos: [
        "products/elephant-1.webp",
        "products/elephant-2.webp"
      ],
      sellerId: "seller5",
      sellerName: "Suresh Nair",
      sellerVerified: true,
      region: "Kerala",
      materials: "Rosewood",
      dimensions: "6 x 4 x 3 inches",
      care: "Dust with dry cloth",
      shipping: "Ships within 2-4 business days",
      reviews: []
    },
    {
      id: "6",
      name: "Organic Spice Mix",
      description: "Traditional blend of organic spices for cooking",
      longDescription: "This authentic spice blend is made from organically grown spices in Karnataka, carefully mixed according to traditional family recipes.",
      category: "food",
      price: 180,
      quantity: 15,
      unit: "packet",
      photos: "products/rec6.webp",
      additionalPhotos: [
        "products/spices-1.webp"
      ],
      sellerId: "seller6",
      sellerName: "Meena Rao",
      sellerVerified: false,
      region: "Karnataka",
      materials: "Organic spices",
      dimensions: "100g packet",
      care: "Store in cool, dry place",
      shipping: "Ships within 1-2 business days",
      reviews: []
    },
    {
      id: "7",
      name: "Bamboo Basket Set",
      description: "Set of 3 handcrafted bamboo baskets of different sizes",
      longDescription: "This practical set of bamboo baskets is made by artisans in Assam using traditional weaving patterns. Each basket is unique with its own character.",
      category: "handicraft",
      price: 550,
      quantity: 4,
      unit: "set",
      photos: "products/rec7.webp",
      additionalPhotos: [
        "products/basket-1.webp",
        "products/basket-2.webp"
      ],
      sellerId: "seller7",
      sellerName: "Bimal Borah",
      sellerVerified: true,
      region: "Assam",
      materials: "Bamboo, natural fibers",
      dimensions: "Various sizes (small: 6\", medium: 9\", large: 12\" diameter)",
      care: "Wipe clean with damp cloth",
      shipping: "Ships within 1-2 business days",
      reviews: []
    },
    {
      id: "8",
      name: "Hand-painted Terracotta Pots",
      description: "Set of hand-painted terracotta pots for plants",
      longDescription: "These vibrant terracotta pots are hand-painted by women artisans in Madhya Pradesh using natural mineral pigments in traditional designs.",
      category: "handicraft",
      price: 750,
      quantity: 6,
      unit: "set",
      photos: "products/rec8.webp",
      additionalPhotos: [
        "products/pots-1.webp",
        "products/pots-2.webp"
      ],
      sellerId: "seller8",
      sellerName: "Geeta Patel",
      sellerVerified: true,
      region: "Madhya Pradesh",
      materials: "Terracotta, mineral pigments",
      dimensions: "Set of 3 (small: 4\", medium: 6\", large: 8\" diameter)",
      care: "Protect from frost",
      shipping: "Ships within 2-3 business days",
      reviews: []
    }
  ];
  
// Mock sellers database
const MOCK_SELLERS_DB = {
  "seller1": {
    name: "Lakshmi Devi",
    village: "Kanchipuram",
    district: "Tamil Nadu",
    phone: "9876543210",
    joinedDate: "2022-05-10",
    verificationStatus: "VERIFIED",
    trustScore: 92,
    products: 15,
    sales: 78,
    bio: "Third-generation potter creating traditional pottery for over 80 years.",
    photo: "/sellers/seller1.webp"
  },
  "seller2": {
    name: "Arjun Das",
    village: "Guwahati",
    district: "Assam",
    phone: "9876543211",
    joinedDate: "2021-11-15",
    verificationStatus: "VERIFIED",
    trustScore: 88,
    products: 12,
    sales: 45,
    bio: "Specializes in traditional bamboo crafts from Northeast India.",
    photo: "/sellers/seller2.webp"
  },
  "seller3": {
    name: "Meena Kumari",
    village: "Madhubani",
    district: "Bihar",
    phone: "9876543212",
    joinedDate: "2023-02-20",
    verificationStatus: "PENDING",
    trustScore: 75,
    products: 8,
    sales: 12,
    bio: "Traditional Madhubani artist trained by her grandmother.",
    photo: "/sellers/seller3.webp"
  }
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [product, setProduct] = useState<any>(null)
  const [seller, setSeller] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true)
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Get product from database
        const productData = MOCK_PRODUCTS_DB.find(
          (product) => product.id === unwrappedParams.id
        );
        
        if (!productData) {
          setProduct(null);
          return;
        }
        
        // Now productData is correctly typed as the full product
        
        const productWithId = {
          
          ...productData,
        };
        
        const sellerData = MOCK_SELLERS_DB[productData.sellerId as keyof typeof MOCK_SELLERS_DB];
        
        setProduct(productWithId);
        setSeller(sellerData);
        setSelectedImage(0);
        }
      catch (error) {
        console.error("Error fetching product details:", error)
        setProduct(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductDetails()
  }, [unwrappedParams.id])

  const handleAddToCart = () => {
    if (!product) return
    
    toast({
      title: "Added to cart",
      description: `${quantity} ${product.name} added to your cart`,
    })
  }

  const handleBuyNow = () => {
    if (!product) return
    
    toast({
      title: "Proceeding to checkout",
      description: `${quantity} ${product.name} added to your cart`,
    })
    router.push("/checkout")
  }

  const handleContactSeller = () => {
    if (!seller) return
    
    toast({
      title: "Contact initiated",
      description: `You will receive a call from ${seller.name} shortly`,
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="mt-4 text-lg font-medium text-gray-900">Product not found</h3>
          <p className="mt-2 text-sm text-gray-500">The product you're looking for doesn't exist or has been removed</p>
          <Button onClick={() => router.push("/products")} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.push("/products")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
        <div className="bg-white rounded-lg overflow-hidden shadow aspect-square">
  <Image
    src={[
      product.photos, 
      ...product.additionalPhotos
    ][selectedImage] }
    alt={product.name}
    width={600}
    height={600}
    className="w-full h-full object-cover"
    priority
  />
</div>
          {product.additionalPhotos.length > 0 && (
 <div className="flex space-x-2 overflow-x-auto py-2">
 {[
   product.photos, 
   ...product.additionalPhotos
 ].map((photo: string, index: number) => (
   <button
     key={index}
     onClick={() => setSelectedImage(index)}
     className={`w-24 h-24 rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-orange-500' : 'border-transparent'} cursor-pointer`}
   >
     <Image
       src={`/${photo}` || "/placeholder.webp"}  
       alt={`${product.name} view ${index + 1}`}
       width={100}
       height={100}
       className="w-full h-full object-cover"
     />
   </button>
 ))}
</div>
)}

        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={() => toast({ title: "Added to favorites" })}>
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  toast({ title: "Link copied to clipboard" })
                }}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-orange-600 font-bold text-3xl mt-2">₹{product.price}</p>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="mr-2">
                {product.category}
              </Badge>
              <span className="text-sm text-gray-500">
                {product.quantity} {product.unit}s available
              </span>
            </div>
          </div>

          <Separator />

          {/* Seller Info */}
          {seller && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                      <Image
                        src={seller.photo || "/placeholder.webp"}
                        alt={seller.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-base flex items-center">
                        {seller.name}
                        {seller.verificationStatus === "VERIFIED" && (
                          <Badge className="ml-2 bg-green-500">
                            <Check className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {seller.village}, {seller.district}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleContactSeller}>
                    <Phone className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-gray-600 line-clamp-2">{seller.bio}</p>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex justify-between w-full text-xs text-gray-500">
                  <span>Trust Score: {seller.trustScore}%</span>
                  <span>{seller.sales} sales</span>
                  <span>Member since {new Date(seller.joinedDate).getFullYear()}</span>
                </div>
              </CardFooter>
            </Card>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                disabled={quantity >= product.quantity}
              >
                +
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button className="flex-1 bg-orange-600 hover:bg-orange-700" onClick={handleBuyNow}>
              Buy Now
            </Button>
          </div>

          <Separator />

          {/* Product Details Tabs */}
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviews.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-4">
              <p className="text-gray-700 whitespace-pre-line">{product.longDescription}</p>
            </TabsContent>
            <TabsContent value="details" className="pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Materials</h3>
                  <p className="text-gray-600">{product.materials}</p>
                </div>
                <div>
                  <h3 className="font-medium">Dimensions</h3>
                  <p className="text-gray-600">{product.dimensions}</p>
                </div>
                <div>
                  <h3 className="font-medium">Care Instructions</h3>
                  <p className="text-gray-600">{product.care}</p>
                </div>
                <div>
                  <h3 className="font-medium">Shipping</h3>
                  <p className="text-gray-600">{product.shipping}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="pt-4">
              {product.reviews.length > 0 ? (
                <div className="space-y-4">
                  {product.reviews.map((review: any) => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{review.userName}</h3>
                        <span className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center my-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No reviews yet for this product.</p>
                  <Button variant="outline" className="mt-4">
                    Be the first to review
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}