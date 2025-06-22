import Link from "next/link"
import { ArrowLeft, GraduationCap, MapPin, Briefcase, Star } from "lucide-react"

export default function AlumniPage() {
  const successStories = [
    {
      name: "Dr. Anita Sharma",
      origin: "Mumbai, India",
      currentRole: "Principal, Lincoln Elementary School",
      location: "Atlanta, Georgia",
      year: "2019",
      story: "From teaching in Mumbai to leading an American school - JAGADGURU made my H1B journey seamless.",
      achievement: "Promoted to Principal within 3 years",
    },
    {
      name: "Carlos Mendoza",
      origin: "Mexico City, Mexico",
      currentRole: "Senior Software Engineer",
      location: "San Francisco, California",
      year: "2020",
      story: "The IT placement program connected me with my dream job at a Fortune 500 company.",
      achievement: "$150K+ annual salary",
    },
    {
      name: "Li Wei Chen",
      origin: "Shanghai, China",
      currentRole: "Real Estate Investor",
      location: "Miami, Florida",
      year: "2018",
      story: "EB5 investment guidance helped me secure permanent residency and build a successful business.",
      achievement: "$2M+ portfolio value",
    },
    {
      name: "Fatima Al-Rashid",
      origin: "Dubai, UAE",
      currentRole: "Mathematics Teacher",
      location: "Houston, Texas",
      year: "2021",
      story: "GACE preparation and visa support made my transition to American education smooth and successful.",
      achievement: "Teacher of the Year 2023",
    },
    {
      name: "Raj Patel",
      origin: "Ahmedabad, India",
      currentRole: "Data Scientist",
      location: "Seattle, Washington",
      year: "2022",
      story: "Remote work opportunities through JAGADGURU led to my current position at Microsoft.",
      achievement: "H1B sponsored within 1 year",
    },
    {
      name: "Elena Popovic",
      origin: "Belgrade, Serbia",
      currentRole: "Investment Advisor",
      location: "New York, New York",
      year: "2020",
      story: "EB5 program guidance and financial planning expertise helped me establish my practice in NYC.",
      achievement: "Managing $10M+ in assets",
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
            <GraduationCap className="mx-auto h-16 w-16 text-amber-600 mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Alumni</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Celebrating the success stories of professionals who have achieved their American dreams with JAGADGURU.
            </p>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From teachers to tech professionals to investors - see how our alumni are thriving across America.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {successStories.map((story, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mr-4">
                    <GraduationCap className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{story.name}</h3>
                    <p className="text-sm text-gray-500">Class of {story.year}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-amber-600 mr-2" />
                    <span>From {story.origin}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="h-4 w-4 text-amber-600 mr-2" />
                    <span>{story.currentRole}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-amber-600 mr-2" />
                    <span>Now in {story.location}</span>
                  </div>
                </div>

                <blockquote className="text-gray-700 italic mb-4">"{story.story}"</blockquote>

                <div className="bg-amber-50 border border-amber-200 rounded p-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-amber-600 mr-2" />
                    <span className="text-sm font-medium text-amber-800">{story.achievement}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Alumni Network Stats */}
          <div className="bg-amber-50 border border-amber-200 rounded p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Alumni Network Impact</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-amber-600 mb-2">2,500+</div>
                <div className="text-gray-600">Successful Alumni</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-600 mb-2">50</div>
                <div className="text-gray-600">U.S. States</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-600 mb-2">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-600 mb-2">$85K</div>
                <div className="text-gray-600">Average Starting Salary</div>
              </div>
            </div>
          </div>

          {/* Join Alumni Network CTA */}
          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Join Our Alumni Network?</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Take the first step towards your American dream. Schedule a consultation with our experts today.
            </p>
            <Link href="/schedule">
              <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded font-medium transition-colors">
                Start Your Journey
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
