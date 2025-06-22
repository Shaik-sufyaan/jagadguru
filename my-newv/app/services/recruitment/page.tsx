import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, Search, CheckCircle, Target, Award, Briefcase, TrendingUp } from "lucide-react"

export default function RecruitmentPage() {
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
            <Users className="mx-auto h-16 w-16 text-amber-600 mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Talent Acquisition & Recruitment</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Customized recruitment strategies that align with your organization's unique culture and goals, delivering
              top-tier talent.
            </p>
          </div>
        </div>
      </div>

      {/* Services Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Recruitment Services</h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              End-to-end hiring solutions from executive search to bulk recruitment across all industries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border border-gray-200 hover:border-amber-200 transition-colors">
              <CardHeader>
                <Search className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle>Executive Search</CardTitle>
                <CardDescription>
                  Strategic leadership recruitment for C-suite and senior management positions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    CEO, CFO, CTO placements
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Board member recruitment
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Succession planning
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:border-amber-200 transition-colors">
              <CardHeader>
                <Briefcase className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle>Professional Staffing</CardTitle>
                <CardDescription>
                  Mid-level and senior professional recruitment across finance, technology, and consulting.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Finance & accounting roles
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Technology specialists
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Management consultants
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:border-amber-200 transition-colors">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle>Bulk Recruitment</CardTitle>
                <CardDescription>
                  Large-scale hiring solutions for rapid team expansion and project-based staffing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Campus recruitment drives
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Project team assembly
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Seasonal staffing
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:border-amber-200 transition-colors">
              <CardHeader>
                <Target className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle>Specialized Recruitment</CardTitle>
                <CardDescription>
                  Niche talent acquisition for specialized roles and emerging technology sectors.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    AI/ML specialists
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Blockchain developers
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Cybersecurity experts
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:border-amber-200 transition-colors">
              <CardHeader>
                <Award className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle>Talent Assessment</CardTitle>
                <CardDescription>
                  Comprehensive evaluation and testing services to ensure the right cultural and skill fit.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Psychometric testing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Technical assessments
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Cultural fit evaluation
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:border-amber-200 transition-colors">
              <CardHeader>
                <Users className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle>Recruitment Process Outsourcing</CardTitle>
                <CardDescription>
                  Complete outsourcing of your recruitment function with dedicated teams and processes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Dedicated recruitment teams
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Custom recruitment processes
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Performance metrics & reporting
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Recruitment Process</h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A systematic approach to finding and securing the best talent for your organization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Requirements Analysis</h3>
              <p className="text-gray-600 text-sm">
                Deep dive into role requirements, company culture, and success criteria.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Talent Sourcing</h3>
              <p className="text-gray-600 text-sm">
                Multi-channel sourcing including our network, databases, and market research.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Screening & Assessment</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive evaluation including technical, cultural, and leadership assessments.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Client Presentation</h3>
              <p className="text-gray-600 text-sm">
                Present shortlisted candidates with detailed profiles and recommendations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">5</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Offer & Onboarding</h3>
              <p className="text-gray-600 text-sm">Support through offer negotiation and smooth onboarding process.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Track Record</h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-amber-600 mb-2">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-600 mb-2">30</div>
                <div className="text-gray-600">Days Average Fill Time</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-600 mb-2">500+</div>
                <div className="text-gray-600">Companies Served</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-600 mb-2">5,000+</div>
                <div className="text-gray-600">Successful Placements</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white border border-gray-200 rounded p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Find Your Next Star Performer?</h2>
            <p className="text-gray-600 mb-8">
              Partner with us to access top-tier talent and streamline your recruitment process with proven results.
            </p>
            <Link href="/schedule">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
                Schedule Recruitment Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
