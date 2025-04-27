import { Mic, ShoppingBag, Truck, Shield, Globe, Users } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      name: "Voice-First Interface",
      description: "Simply speak to navigate, create listings, and make purchases - no tech expertise required.",
      icon: Mic,
    },
    {
      name: "Direct Market Access",
      description: "Connect directly with buyers across India and beyond, eliminating middlemen.",
      icon: ShoppingBag,
    },
    {
      name: "Simplified Logistics",
      description: "Easy pickup and delivery options designed for rural areas with limited connectivity.",
      icon: Truck,
    },
    {
      name: "Trust & Verification",
      description: "Built-in verification system to establish trust between buyers and sellers.",
      icon: Shield,
    },
    {
      name: "Multilingual Support",
      description: "Use the app in Hindi, Tamil, Telugu, or English - whatever is most comfortable for you.",
      icon: Globe,
    },
    {
      name: "Community Building",
      description: "Connect with other artisans to share knowledge and collaborate on larger orders.",
      icon: Users,
    },
  ]

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-orange-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A better way to connect artisans with buyers
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            HaathSe is designed specifically for rural artisans with limited smartphone literacy.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{feature.name}</h3>
                  <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
