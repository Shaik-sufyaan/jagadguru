"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    title: "Mathematics Teacher",
    company: "Georgia Public Schools",
    
    rating: 5,
    text: "JAGADGURU made my H1B teacher visa process seamless. From credential evaluation to GACE prep, they guided me every step. Now I'm teaching in Atlanta and loving my new life in America!",
  },
  {
    id: 2,
    name: "Chen Wei",
    title: "Software Engineer",
    company: "Tech Startup, California",
    
    rating: 5,
    text: "The IT project placement program connected me with amazing remote opportunities. I've been working with U.S. companies for 2 years now, building my portfolio while earning competitive rates.",
  },
  {
    id: 3,
    name: "Ahmed Hassan",
    title: "EB5 Investor",
    company: "Real Estate Development",
     
    rating: 5,
    text: "Their EB5 program guidance was exceptional. They helped me navigate the complex investment process and now my family has permanent residency. The ROI on both investment and immigration was worth it.",
  },
  {
    id: 4,
    name: "Maria Rodriguez",
    title: "Science Teacher",
    company: "Texas School District",
    
    rating: 4,
    text: "From credential evaluation to visa processing, JAGADGURU's teacher recruitment program was comprehensive. The GACE preparation materials were excellent and the support team was always available.",
  },
  {
    id: 5,
    name: "Raj Patel",
    title: "Data Scientist",
    company: "Fortune 500 Company",
    
    rating: 5,
    text: "The remote IT opportunities opened doors I never imagined. Working on cutting-edge AI projects with American companies while building my experience for future visa applications. Highly recommended!",
  },
  {
    id: 6,
    name: "Sarah Kim",
    title: "Investment Consultant",
    company: "EB5 Success Story",
    
    rating: 5,
    text: "JAGADGURU's investment guidance was thorough and professional. They connected me with vetted EB5 projects and handled all the legal documentation. My green card was approved in record time.",
  },
]

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cardsPerView, setCardsPerView] = useState(3)

  const memoizedTestimonials = useMemo(() => testimonials, [])

  const handleResize = useCallback(() => {
    const width = window.innerWidth
    if (width >= 1024) {
      setCardsPerView(3)
    } else if (width >= 768) {
      setCardsPerView(2)
    } else {
      setCardsPerView(1)
    }
  }, [])

  useEffect(() => {
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [handleResize])

  const maxIndex = Math.max(0, memoizedTestimonials.length - cardsPerView)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }, [maxIndex])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }, [maxIndex])

  const renderStars = useCallback((rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-amber-500 fill-current" : "text-gray-300"}`} />
    ))
  }, [])

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold tracking-widest text-amber-600 uppercase mb-2">Testimonials</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Success Stories from Our Clients</h3>
          <div className="w-24 h-1 bg-amber-600 mx-auto rounded mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From teachers to investors to tech professionals - see how JAGADGURU has helped transform lives and careers
            across the globe.
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
              }}
            >
              {memoizedTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className={`flex-none px-4 ${cardsPerView === 1 ? "w-full" : cardsPerView === 2 ? "w-1/2" : "w-1/3"}`}
                >
                  <div className="bg-white rounded border border-gray-200 p-8 h-full">
                    <div className="flex items-center mb-6">
                      <div className="relative">
                        
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="font-semibold text-gray-900 text-lg">{testimonial.name}</h4>
                        <p className="text-amber-600 text-sm font-medium">{testimonial.title}</p>
                        <p className="text-gray-500 text-sm">{testimonial.company}</p>
                      </div>
                    </div>

                    <div className="flex mb-4">{renderStars(testimonial.rating)}</div>

                    <blockquote className="text-gray-700 text-lg leading-relaxed italic">
                      "{testimonial.text}"
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-center mt-8 space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="rounded border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="rounded border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "bg-amber-600" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
