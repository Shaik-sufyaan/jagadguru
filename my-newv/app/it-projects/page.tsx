import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Smartphone, Globe, Database, CheckCircle, ArrowLeft, Laptop, Cloud, Shield, Zap } from "lucide-react"

export default function ITProjectsPage() {
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
            <Code className="mx-auto h-16 w-16 text-amber-600 mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">IT Projects & Remote Work</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with cutting-edge technology projects and remote work opportunities. Build your portfolio while
              working with U.S. companies from anywhere in the world.
            </p>
          </div>
        </div>
      </div>

      {/* Services Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our IT Services</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Web Development</CardTitle>
                <CardDescription>Full-stack web applications using modern frameworks and technologies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">Next.js</Badge>
                    <Badge variant="secondary">Node.js</Badge>
                    <Badge variant="secondary">TypeScript</Badge>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      E-commerce platforms
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Business applications
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      API development
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Smartphone className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Mobile Development</CardTitle>
                <CardDescription>Native and cross-platform mobile applications for iOS and Android</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">React Native</Badge>
                    <Badge variant="secondary">Flutter</Badge>
                    <Badge variant="secondary">Swift</Badge>
                    <Badge variant="secondary">Kotlin</Badge>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      iOS applications
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Android applications
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Cross-platform solutions
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Cloud className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Cloud Solutions</CardTitle>
                <CardDescription>Scalable cloud infrastructure and DevOps implementation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">AWS</Badge>
                    <Badge variant="secondary">Azure</Badge>
                    <Badge variant="secondary">Docker</Badge>
                    <Badge variant="secondary">Kubernetes</Badge>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Cloud migration
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      CI/CD pipelines
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Infrastructure automation
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Database className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Data Analytics</CardTitle>
                <CardDescription>Business intelligence and data science solutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Python</Badge>
                    <Badge variant="secondary">R</Badge>
                    <Badge variant="secondary">SQL</Badge>
                    <Badge variant="secondary">Tableau</Badge>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Data visualization
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Machine learning
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Predictive analytics
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Cybersecurity</CardTitle>
                <CardDescription>Security audits, penetration testing, and compliance solutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Security Audits</Badge>
                    <Badge variant="secondary">Penetration Testing</Badge>
                    <Badge variant="secondary">GDPR</Badge>
                    <Badge variant="secondary">SOC 2</Badge>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Vulnerability assessment
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Compliance consulting
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Security training
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-yellow-600 mb-2" />
                <CardTitle>AI & Automation</CardTitle>
                <CardDescription>Artificial intelligence and process automation solutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">OpenAI</Badge>
                    <Badge variant="secondary">TensorFlow</Badge>
                    <Badge variant="secondary">RPA</Badge>
                    <Badge variant="secondary">Chatbots</Badge>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      AI integration
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Process automation
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Custom AI solutions
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Current Projects */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Current Project Opportunities</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 border-amber-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>E-commerce Platform Redesign</CardTitle>
                  <Badge className="bg-amber-100 text-amber-800">Remote</Badge>
                </div>
                <CardDescription>Modernize a legacy e-commerce platform for a Fortune 500 retailer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">React</Badge>
                    <Badge variant="outline">Node.js</Badge>
                    <Badge variant="outline">AWS</Badge>
                    <Badge variant="outline">PostgreSQL</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Duration:</span>
                      <span className="font-semibold">6 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Team Size:</span>
                      <span className="font-semibold">5-8 developers</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rate:</span>
                      <span className="font-semibold">$75-95/hour</span>
                    </div>
                  </div>
                  <Button className="w-full">Apply Now</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Healthcare Data Analytics</CardTitle>
                  <Badge className="bg-amber-100 text-amber-800">Remote</Badge>
                </div>
                <CardDescription>Build predictive analytics dashboard for healthcare provider network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Python</Badge>
                    <Badge variant="outline">Pandas</Badge>
                    <Badge variant="outline">Tableau</Badge>
                    <Badge variant="outline">Azure</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Duration:</span>
                      <span className="font-semibold">4 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Team Size:</span>
                      <span className="font-semibold">3-5 analysts</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rate:</span>
                      <span className="font-semibold">$80-100/hour</span>
                    </div>
                  </div>
                  <Button className="w-full">Apply Now</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Mobile Banking App</CardTitle>
                  <Badge className="bg-amber-100 text-amber-800">Remote</Badge>
                </div>
                <CardDescription>
                  Develop secure mobile banking application with biometric authentication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">React Native</Badge>
                    <Badge variant="outline">TypeScript</Badge>
                    <Badge variant="outline">Firebase</Badge>
                    <Badge variant="outline">Biometrics</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Duration:</span>
                      <span className="font-semibold">8 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Team Size:</span>
                      <span className="font-semibold">6-10 developers</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rate:</span>
                      <span className="font-semibold">$85-110/hour</span>
                    </div>
                  </div>
                  <Button className="w-full">Apply Now</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>AI Chatbot Integration</CardTitle>
                  <Badge className="bg-amber-100 text-amber-800">Remote</Badge>
                </div>
                <CardDescription>Integrate advanced AI chatbot for customer service automation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">OpenAI</Badge>
                    <Badge variant="outline">Python</Badge>
                    <Badge variant="outline">FastAPI</Badge>
                    <Badge variant="outline">NLP</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Duration:</span>
                      <span className="font-semibold">3 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Team Size:</span>
                      <span className="font-semibold">2-4 developers</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rate:</span>
                      <span className="font-semibold">$90-120/hour</span>
                    </div>
                  </div>
                  <Button className="w-full">Apply Now</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Remote Work Benefits */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Remote IT Work?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Laptop className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Work From Anywhere</h3>
              <p className="text-gray-600">Complete projects from the comfort of your home or any location worldwide</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Opportunities</h3>
              <p className="text-gray-600">Access to projects from leading U.S. companies and startups</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cutting-Edge Tech</h3>
              <p className="text-gray-600">Work with the latest technologies and frameworks in the industry</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Competitive Rates</h3>
              <p className="text-gray-600">Earn competitive hourly rates with performance-based bonuses</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our IT Network?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Connect with exciting projects and build your career with leading U.S. technology companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/schedule">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                Schedule Technical Interview
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              View All Projects
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
