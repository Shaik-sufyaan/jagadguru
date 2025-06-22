import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BookOpen, Users, Award, CheckCircle, Target, TrendingUp } from "lucide-react"

export default function TrainingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/images/jagadguru-logo-new.png"
                alt="JAGADGURU Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-xl font-bold text-gray-900">JAGADGURU</span>
            </Link>
            <Link href="/schedule">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">Contact Us</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-amber-50 py-24 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <div className="text-center">
            <BookOpen className="mx-auto h-16 w-16 text-amber-600 mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Training & Development</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive training programs designed to build finance domain expertise and career readiness for global
              professionals.
            </p>
          </div>
        </div>
      </div>

      {/* Programs Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Training Programs</h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Expert-led programs partnering with universities and industry leaders to accelerate your career growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border border-gray-200 hover:border-amber-200 transition-colors">
              <CardHeader>
                <Award className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle>Financial Analysis Certification</CardTitle>
                <CardDescription>
                  Master financial modeling, valuation, and analysis techniques used by top investment firms.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Advanced Excel & Financial Modeling
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    DCF & Comparable Analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Industry-specific Case Studies
                  </li>
                </ul>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">12 weeks</span>
                  <span className="text-lg font-bold text-amber-600">$2,499</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:border-amber-200 transition-colors">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle>Investment Banking Prep</CardTitle>
                <CardDescription>
                  Comprehensive preparation for investment banking roles with real-world project experience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    M&A Transaction Modeling
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Pitch Book Creation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Interview Preparation
                  </li>
                </ul>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">16 weeks</span>
                  <span className="text-lg font-bold text-amber-600">$3,999</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:border-amber-200 transition-colors">
              <CardHeader>
                <Users className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle>Corporate Finance Mastery</CardTitle>
                <CardDescription>
                  Essential skills for corporate finance roles including budgeting, forecasting, and strategic planning.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Financial Planning & Analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Capital Structure Optimization
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Risk Management
                  </li>
                </ul>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">10 weeks</span>
                  <span className="text-lg font-bold text-amber-600">$1,999</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* University Partnerships */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">University Partnerships</h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Collaborating with leading academic institutions to provide world-class education and certification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ivy League Faculty</h3>
              <p className="text-gray-600">
                Learn from professors and industry experts from Harvard, Wharton, and other top-tier institutions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Accredited Programs</h3>
              <p className="text-gray-600">
                All our programs are accredited and recognized by leading professional organizations and employers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Career Placement</h3>
              <p className="text-gray-600">
                95% of our graduates secure positions at top financial institutions within 6 months of completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-amber-50 border border-amber-200 rounded p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Advance Your Finance Career?</h2>
            <p className="text-gray-600 mb-8">
              Join thousands of professionals who have accelerated their careers through our expert-led training
              programs.
            </p>
            <Link href="/schedule">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
                Schedule Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
