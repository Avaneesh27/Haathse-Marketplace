import HeroSection from "@/components/home/hero-section"
import FeaturesSection from "@/components/home/features-section"
import HowItWorks from "@/components/home/how-it-works"
import Testimonials from "@/components/home/testimonials"
import CallToAction from "@/components/home/call-to-action"
import Navbar from "@/components/common/navbar"
import VoiceAssistantButton from "@/components/voice/voice-assistant-button"
import ProductRecommendations from "@/components/ai/product-recommendations"

export default function Home() {
  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      <main>
        <HeroSection />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ProductRecommendations />
        </div>
        <FeaturesSection />
        <HowItWorks />
        <Testimonials />
        <CallToAction />
      </main>
      <VoiceAssistantButton />
    </div>
  )
}
