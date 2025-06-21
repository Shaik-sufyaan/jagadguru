import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, DollarSign, Users, Shield, CheckCircle, ArrowLeft, TrendingUp, Globe, Home } from "lucide-react"

export default function EB5ProgramPage() {
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
            <Building2 className="mx-auto h-16 w-16 text-amber-600 mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">EB5 Investor Program</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Secure your path to U.S. permanent residency through strategic investment. Our comprehensive EB5 program
              offers vetted opportunities and expert guidance.
            </p>
          </div>
        </div>
      </div>

      {/* Program Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">What is the EB5 Program?</h2>
              <p className="text-gray-600 mb-6">
                The EB5 Immigrant Investor Program provides a pathway to U.S. permanent residency for qualified foreign
                investors who invest in job-creating enterprises in the United States.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold">Investment Requirements</h4>
                    <p className="text-gray-600">
                      Minimum $800,000 in Targeted Employment Areas or $1,050,000 in other areas
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold">Job Creation</h4>
                    <p className="text-gray-600">Must create or preserve at least 10 full-time jobs for U.S. workers</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold">Family Benefits</h4>
                    <p className="text-gray-600">Includes spouse and unmarried children under 21</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-100 to-amber-100 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6 text-center">Investment Options</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">TEA Investment</span>
                    <span className="text-2xl font-bold text-amber-600">$800K</span>
                  </div>
                  <p className="text-sm text-gray-600">Targeted Employment Areas (rural or high unemployment)</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Standard Investment</span>
                    <span className="text-2xl font-bold text-amber-600">$1.05M</span>
                  </div>
                  <p className="text-sm text-gray-600">Non-targeted employment areas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our EB5 Services</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle>Investment Due Diligence</CardTitle>
                <CardDescription>
                  Comprehensive analysis of investment opportunities and risk assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Project evaluation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Financial analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Risk mitigation strategies
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle>Legal Documentation</CardTitle>
                <CardDescription>Expert preparation of all required legal documents and filings</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    I-526E petition
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Source of funds documentation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    I-829 removal of conditions
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle>Family Immigration</CardTitle>
                <CardDescription>Complete support for your family's immigration process</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Spouse & children inclusion
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Consular processing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Adjustment of status
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle>Regional Center Projects</CardTitle>
                <CardDescription>Access to pre-approved regional center investment opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    USCIS-approved projects
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Diversified portfolios
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Job creation compliance
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <DollarSign className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle>Financial Planning</CardTitle>
                <CardDescription>
                  Strategic financial planning for your investment and immigration goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Tax optimization
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Asset structuring
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Exit strategies
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Home className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle>Relocation Services</CardTitle>
                <CardDescription>
                  Comprehensive support for your transition to life in the United States
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Housing assistance
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    School enrollment
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Community integration
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Investment Projects */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Investment Opportunities</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-amber-200">
              <CardHeader>
                <CardTitle>Healthcare Development</CardTitle>
                <CardDescription>Modern medical facility construction in TEA</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Investment Amount:</span>
                    <span className="font-semibold">$800,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Jobs Created:</span>
                    <span className="font-semibold">15+ per investor</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Location:</span>
                    <span className="font-semibold">Texas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="text-green-600 font-semibold">Available</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200">
              <CardHeader>
                <CardTitle>Infrastructure Project</CardTitle>
                <CardDescription>Transportation infrastructure in rural area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Investment Amount:</span>
                    <span className="font-semibold">$800,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Jobs Created:</span>
                    <span className="font-semibold">12+ per investor</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Location:</span>
                    <span className="font-semibold">Georgia</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="text-green-600 font-semibold">Available</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200">
              <CardHeader>
                <CardTitle>Mixed-Use Development</CardTitle>
                <CardDescription>Commercial and residential complex</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Investment Amount:</span>
                    <span className="font-semibold">$1,050,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Jobs Created:</span>
                    <span className="font-semibold">20+ per investor</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Location:</span>
                    <span className="font-semibold">Florida</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="text-yellow-600 font-semibold">Limited Spots</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Invest in Your American Dream?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join successful investors from around the world who have secured their U.S. permanent residency through our
            EB5 program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/schedule">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                Schedule Investment Consultation
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Download Investment Guide
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
