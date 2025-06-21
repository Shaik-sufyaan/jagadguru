import Link from "next/link"
import { ArrowLeft, Target, Heart, Globe } from "lucide-react"

export default function PurposePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-amber-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <div className="text-center">
            <Target className="mx-auto h-16 w-16 text-amber-600 mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Purpose</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering global talent to achieve their American dreams through comprehensive support and guidance.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
          </div>

          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="text-xl leading-relaxed mb-8">
              At JAGADGURU, we believe that talent knows no borders. Our mission is to bridge the gap between
              international professionals and the opportunities that await them in the United States.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Compassionate Support</h3>
                <p className="text-gray-600">
                  We understand the challenges of immigration and provide personalized, empathetic guidance throughout
                  your journey.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Results-Driven</h3>
                <p className="text-gray-600">
                  Our proven track record speaks for itself - we've helped thousands achieve their U.S. immigration and
                  career goals.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Perspective</h3>
                <p className="text-gray-600">
                  With clients from over 30 countries, we bring a truly international perspective to U.S. immigration
                  and career services.
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why We Exist</h3>
            <p className="mb-6">
              The United States has always been a land of opportunity, attracting the world's brightest minds and most
              ambitious individuals. However, navigating the complex landscape of visas, career placement, and
              investment opportunities can be overwhelming.
            </p>

            <p className="mb-6">
              JAGADGURU was founded to simplify this journey. We recognized that talented individuals worldwide needed a
              trusted partner who could provide comprehensive support - from visa applications to career placement to
              investment guidance - all under one roof.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Impact</h3>
            <div className="bg-amber-50 border border-amber-200 rounded p-6 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-amber-600">2,500+</div>
                  <div className="text-sm text-gray-600">Successful Visa Applications</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-600">1,200+</div>
                  <div className="text-sm text-gray-600">Teachers Placed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-600">$50M+</div>
                  <div className="text-sm text-gray-600">EB5 Investments Facilitated</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-600">30+</div>
                  <div className="text-sm text-gray-600">Countries Served</div>
                </div>
              </div>
            </div>

            <p>
              Every success story reinforces our purpose: to be the bridge that connects global talent with American
              opportunities, creating a pathway for dreams to become reality.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
