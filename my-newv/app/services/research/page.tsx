import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BarChart3, TrendingUp, Database, CheckCircle, PieChart, LineChart, Target } from "lucide-react"

export default function ResearchPage() {
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
            <BarChart3 className="mx-auto h-16 w-16 text-amber-600 mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Research & Data Analytics</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Data-driven insights and analytics solutions to optimize performance, from operations efficiency to market
              expansion strategies.
            </p>
          </div>
        </div>
      </div>

      {/* Services Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Research Services</h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive analytics solutions tailored to your business needs and strategic objectives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border border-gray-200 hover:border-amber-200 transition-colors">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle>Market Research & Analysis</CardTitle>
                <CardDescription>
                  Comprehensive market studies and competitive analysis to inform strategic decisions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Industry trend analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Competitive benchmarking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Market sizing & forecasting
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:border-amber-200 transition-colors">
              <CardHeader>
                <Database className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle>Business Intelligence</CardTitle>
                <CardDescription>
                  Transform raw data into actionable insights with advanced BI solutions and dashboards.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Custom dashboard development
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    KPI tracking & monitoring
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Automated reporting systems
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:border-amber-200 transition-colors">
              <CardHeader>
                <PieChart className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle>Financial Analytics</CardTitle>
                <CardDescription>
                  Advanced financial modeling and analysis to optimize performance and profitability.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Revenue optimization models
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Cost analysis & reduction
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Risk assessment modeling
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:border-amber-200 transition-colors">
              <CardHeader>
                <LineChart className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle>Predictive Analytics</CardTitle>
                <CardDescription>
                  Machine learning and statistical models to forecast trends and optimize operations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Demand forecasting
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Customer behavior analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Operational optimization
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:border-amber-200 transition-colors">
              <CardHeader>
                <Target className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle>Strategic Consulting</CardTitle>
                <CardDescription>
                  Data-backed strategic recommendations for business growth and market expansion.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Growth strategy development
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Market entry analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Performance optimization
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:border-amber-200 transition-colors">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle>Data Visualization</CardTitle>
                <CardDescription>
                  Transform complex data into clear, actionable visual insights and presentations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Interactive dashboards
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Executive presentations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Real-time monitoring
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Research Process</h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A systematic approach to delivering actionable insights and data-driven recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Collection</h3>
              <p className="text-gray-600 text-sm">
                Gather relevant data from multiple sources including internal systems, market databases, and primary
                research.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analysis & Modeling</h3>
              <p className="text-gray-600 text-sm">
                Apply advanced statistical methods and machine learning algorithms to uncover patterns and insights.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Visualization</h3>
              <p className="text-gray-600 text-sm">
                Create compelling visualizations and dashboards that make complex data easy to understand and act upon.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Recommendations</h3>
              <p className="text-gray-600 text-sm">
                Deliver actionable recommendations with clear implementation roadmaps and success metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-amber-50 border border-amber-200 rounded p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Unlock Your Data's Potential?</h2>
            <p className="text-gray-600 mb-8">
              Transform your business with data-driven insights and strategic analytics solutions tailored to your
              needs.
            </p>
            <Link href="/schedule">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
                Schedule Analytics Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
