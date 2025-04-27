import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/common/navbar"
import VoiceAssistantButton from "@/components/voice/voice-assistant-button"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">About HaathSe</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              HaathSe is a voice-first rural marketplace designed to empower Indian artisans by connecting them directly
              with buyers across the country. Our mission is to preserve traditional crafts while providing sustainable
              livelihoods for rural communities.
            </p>
            <p className="text-gray-700 mb-4">
              By leveraging voice technology, we've made e-commerce accessible to artisans with minimal smartphone
              literacy, removing barriers to entry and enabling them to showcase their unique products to a global
              audience.
            </p>
          </div>
          <div className="flex items-center justify-center">
             <img
             src="/artisans.webp"
             alt="Rural artisans working on traditional crafts"
             className="rounded-lg shadow-md max-w-full h-auto"
             />
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How HaathSe Works</CardTitle>
            <CardDescription>A voice-first marketplace connecting artisans and buyers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-orange-100 rounded-lg">
                <h3 className="font-semibold mb-2">For Artisans</h3>
                <p className="text-sm text-gray-700">
                  Artisans can use voice commands to create product listings, manage orders, and communicate with buyers
                  - all without needing to read or write.
                </p>
              </div>
              <div className="text-center p-4 bg-orange-100 rounded-lg">
                <h3 className="font-semibold mb-2">For Buyers</h3>
                <p className="text-sm text-gray-700">
                  Buyers can discover authentic handcrafted products, communicate directly with artisans, and support
                  rural communities through their purchases.
                </p>
              </div>
              <div className="text-center p-4 bg-orange-100 rounded-lg">
                <h3 className="font-semibold mb-2">For Communities</h3>
                <p className="text-sm text-gray-700">
                  Rural communities benefit from increased economic opportunities, preservation of traditional crafts,
                  and connection to global markets.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Disclaimer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-700">
              <p>
                <strong>Beta Version:</strong> HaathSe is currently in beta testing. While we strive to provide a
                seamless experience, you may encounter occasional issues as we continue to improve the platform.
              </p>
              <p>
                <strong>Voice Recognition Limitations:</strong> Our voice recognition technology works best in quiet
                environments and may have difficulty with certain accents or dialects. We're continuously improving our
                voice recognition capabilities.
              </p>
              <p>
                <strong>Verification Process:</strong> While we verify sellers through a basic KYC process, buyers
                should exercise normal caution when making purchases. We recommend starting with smaller orders to build
                trust with sellers.
              </p>
              <p>
                <strong>Payment Security:</strong> All payments are processed through secure third-party payment
                gateways. HaathSe does not store your payment information.
              </p>
              <p>
                <strong>Privacy:</strong> We collect certain data to improve our services. Please refer to our Privacy
                Policy for details on how we handle your information.
              </p>
              <p>
                <strong>Intellectual Property:</strong> All content and trademarks on this platform are the property of
                HaathSe or the respective artisans and sellers. Unauthorized use is prohibited.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <VoiceAssistantButton />
    </div>
  )
}
