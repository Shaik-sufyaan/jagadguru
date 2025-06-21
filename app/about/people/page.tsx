import Link from "next/link"
import { ArrowLeft, Users, Award, Globe, BookOpen } from "lucide-react"

export default function PeoplePage() {
  const teamMembers = [
    {
      name: "Dr. Rajesh Gupta",
      title: "Founder & CEO",
      expertise: "Immigration Law, Business Strategy",
      experience: "15+ years",
      education: "JD Harvard Law, MBA Wharton",
      description: "Former immigration attorney with extensive experience in EB5 and H1B cases.",
    },
    {
      name: "Sarah Chen",
      title: "Director of Education Services",
      expertise: "Teacher Recruitment, Credential Evaluation",
      experience: "12+ years",
      education: "M.Ed Stanford, TESOL Certified",
      description: "Specialized in international teacher placement and GACE preparation programs.",
    },
    {
      name: "Michael Rodriguez",
      title: "Head of Investment Advisory",
      expertise: "EB5 Investments, Financial Planning",
      experience: "18+ years",
      education: "CFA, MBA Columbia",
      description: "Former investment banker with expertise in immigration-linked investments.",
    },
    {
      name: "Priya Patel",
      title: "IT Recruitment Manager",
      expertise: "Technology Placement, Remote Work",
      experience: "10+ years",
      education: "MS Computer Science, PMP",
      description: "Connects international tech talent with U.S. companies and remote opportunities.",
    },
  ]

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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our People</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the experienced professionals dedicated to making your American dream a reality.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our diverse team brings together decades of experience in immigration, education, finance, and technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center">
                    <Users className="h-10 w-10 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-amber-600 font-medium mb-2">{member.title}</p>
                    <p className="text-gray-600 mb-4">{member.description}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Award className="h-4 w-4 text-amber-600 mr-2" />
                        <span className="font-medium">Expertise:</span> {member.expertise}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Globe className="h-4 w-4 text-amber-600 mr-2" />
                        <span className="font-medium">Experience:</span> {member.experience}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <BookOpen className="h-4 w-4 text-amber-600 mr-2" />
                        <span className="font-medium">Education:</span> {member.education}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Team Values */}
          <div className="bg-amber-50 border border-amber-200 rounded p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Team Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-amber-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Excellence</h4>
                <p className="text-gray-600">
                  We maintain the highest standards in everything we do, from client service to professional expertise.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-amber-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Collaboration</h4>
                <p className="text-gray-600">
                  Our interdisciplinary approach ensures seamless coordination across all service areas.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-amber-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Global Mindset</h4>
                <p className="text-gray-600">
                  We embrace diversity and bring international perspectives to solve complex challenges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
