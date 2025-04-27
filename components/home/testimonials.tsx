export default function Testimonials() {
  const testimonials = [
    {
      content:
        "I never thought I could sell my handmade pottery online. With HaathSe, I just speak and my products are listed. My income has doubled in just three months!",
      author: "Lakshmi Devi",
      role: "Potter from Tamil Nadu",
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      content:
        "As someone who can't read or write well, other apps were impossible to use. HaathSe lets me speak in Hindi to sell my handwoven baskets. It's changed my life.",
      author: "Ramesh Kumar",
      role: "Basket Weaver from Uttar Pradesh",
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      content:
        "I love buying directly from artisans. The voice search makes it easy to find exactly what I'm looking for, and I know I'm supporting rural communities.",
      author: "Priya Sharma",
      role: "Customer from Delhi",
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
  ]

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-orange-600 font-semibold tracking-wide uppercase">Testimonials</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Hear from our community
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.author} className="bg-orange-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={testimonial.imageUrl || "/placeholder.svg"}
                    alt={testimonial.author}
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-gray-900">{testimonial.author}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
