import Link from "next/link"
import { ArrowLeft, Users, CheckCircle, Clock, Shield } from "lucide-react"

export default function ApproachPage() {
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
            <Users className="mx-auto h-16 w-16 text-amber-600 mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Approach</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive, client-centered methodology that ensures success at every step of your journey.
            </p>
          </div>
        </div>
      </div>

      {/* Approach Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The JAGADGURU Method</h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our proven 4-pillar approach ensures comprehensive support and maximum success rates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Personalized Assessment</h3>
              <p className="text-gray-600">
                We begin with a comprehensive evaluation of your background, goals, and unique circumstances to create a
                tailored strategy.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Strategic Planning</h3>
              <p className="text-gray-600">
                Our experts develop a detailed roadmap with clear milestones, timelines, and actionable steps to achieve
                your objectives.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Active Implementation</h3>
              <p className="text-gray-600">
                We work alongside you to execute the plan, providing hands-on support, documentation assistance, and
                expert guidance.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">4. Ongoing Support</h3>
              <p className="text-gray-600">
                Our relationship doesn't end with success. We provide continued support to ensure your long-term
                prosperity in the U.S.
              </p>
            </div>
          </div>

          {/* Detailed Approach */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">What Makes Us Different</h3>

            <div className="space-y-8">
              <div className="bg-white border border-gray-200 rounded p-8">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Holistic Service Integration</h4>
                <p className="text-gray-600 mb-4">
                  Unlike other firms that specialize in just one area, JAGADGURU offers comprehensive services spanning
                  visa support, career placement, and investment guidance. This integrated approach ensures consistency
                  and maximizes your chances of success.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-amber-600 mr-3" />
                    Coordinated visa and career strategies
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-amber-600 mr-3" />
                    Investment opportunities aligned with immigration goals
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-amber-600 mr-3" />
                    Single point of contact for all services
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded p-8">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Data-Driven Decision Making</h4>
                <p className="text-gray-600 mb-4">
                  Our recommendations are backed by extensive data analysis, market research, and success metrics. We
                  continuously refine our approach based on outcomes and industry trends.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-amber-600 mr-3" />
                    Real-time visa processing statistics
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-amber-600 mr-3" />
                    Job market analysis and placement rates
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-amber-600 mr-3" />
                    Investment performance tracking
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded p-8">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Cultural Sensitivity & Global Perspective</h4>
                <p className="text-gray-600 mb-4">
                  Having served clients from over 30 countries, we understand the unique challenges faced by
                  international professionals. Our team includes multilingual experts who appreciate cultural nuances.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-amber-600 mr-3" />
                    Multilingual support team
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-amber-600 mr-3" />
                    Cultural adaptation guidance
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-amber-600 mr-3" />
                    Country-specific expertise
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
