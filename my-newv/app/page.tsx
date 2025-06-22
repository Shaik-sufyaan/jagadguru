"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Rocket,
  FileText,
  BarChart3,
  GraduationCap,
  Users,
  GraduationCapIcon,
  Building2,
  Phone,
  Menu,
  X,
  ChevronDown,
  CheckCircle,
  Home,
} from "lucide-react"

import TestimonialsSection from "@/components/testimonials-section"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  
  return (
    <div className="relative min-h-screen">
      {/* CSS Wave Background */}
      <div className="wave-background" />
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white/80 border border-gray-200 rounded-full shadow-xl backdrop-blur-md py-3 px-8 w-[90%] max-w-4xl">
        <div className="flex space-x-8 items-center justify-between">
          {/* Logo and Company Name - Matched to footer */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-500 flex items-center justify-center bg-white">
            <Image
              src="/images/jagadguru-logo-new.png"
              alt="JAGADGURU Logo"
              width={36}
              height={36}
              className="object-contain scale-110"
            />
          </div>
          <span className="text-sm font-bold text-gray-900">JAGADGURU</span>
        </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 text-[13px] font-bold text-gray-900">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>

            {/* About Us dropdown */}
            <div className="relative group">
              <button className="inline-flex items-center hover:text-amber-400 transition-colors">
                About Us
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white/80 backdrop-blur-lg rounded border border-gray-200 shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50">
                <Link
                  href="/about/purpose"
                  className="block px-4 py-3 hover:bg-amber-50 text-gray-900 transition-colors border-b border-gray-100"
                >
                  Purpose
                </Link>
                <Link
                  href="/about/approach"
                  className="block px-4 py-3 hover:bg-amber-50 text-gray-900 transition-colors border-b border-gray-100"
                >
                  Approach
                </Link>
                <Link
                  href="/about/people"
                  className="block px-4 py-3 hover:bg-amber-50 text-gray-900 transition-colors border-b border-gray-100"
                >
                  Our People
                </Link>
                <Link
                  href="/about/alumni"
                  className="block px-4 py-3 hover:bg-amber-50 text-gray-900 transition-colors"
                >
                  Our Alumni
                </Link>
              </div>
            </div>

            {/* Services dropdown */}
            <div className="relative group">
              <button className="inline-flex items-center hover:text-amber-400 transition-colors">
                Services
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-72 bg-white/80 backdrop-blur-lg rounded border border-white/20 shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50 group-hover:delay-100">
                <Link
                  href="/services/training"
                  className="block px-4 py-3 hover:bg-amber-50 text-gray-900 transition-colors border-b border-gray-100"
                >
                  Training & Development
                </Link>
                <Link
                  href="/services/research"
                  className="block px-4 py-3 hover:bg-amber-50 text-gray-900 transition-colors border-b border-gray-100"
                >
                  Research & Data Analytics
                </Link>
                <Link
                  href="/services/recruitment"
                  className="block px-4 py-3 hover:bg-amber-50 text-gray-900 transition-colors"
                >
                  Talent Acquisition & Recruitment
                </Link>
              </div>
            </div>

            <Link href="/teacher-recruitment" className="hover:text-amber-400 transition-colors">
              Teacher Recruitment
            </Link>
            <Link href="/eb5-program" className="hover:text-amber-400 transition-colors">
              EB5 VISA
            </Link>
            <Link href="/it-projects" className="hover:text-amber-400 transition-colors">
              IT Projects
            </Link>
          </div>

          <Link href="/schedule">
            <Button className="text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white rounded-full py-1.5 px-3">
              Contact Us
            </Button>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-900 hover:text-amber-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white rounded-lg border border-gray-200 mt-4 shadow-lg absolute left-0 right-0">
            <div className="px-4 py-2 space-y-2">
              <Link href="/" className="block py-2 text-gray-900 hover:text-amber-600">
                Home
              </Link>
              <Link href="/teacher-recruitment" className="block py-2 text-gray-900 hover:text-amber-600">
                Teacher Recruitment
              </Link>
              <Link href="/eb5-program" className="block py-2 text-gray-900 hover:text-amber-600">
                EB5 Program
              </Link>
              <Link href="/it-projects" className="block py-2 text-gray-900 hover:text-amber-600">
                IT Projects
              </Link>
              <Link href="/schedule" className="block">
                <Button className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-white">Contact Us</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 sm:pt-40 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <div className="text-center max-w-3xl">
              <div className="inline-block px-4 py-2 bg-amber-50/80 rounded text-sm font-medium text-amber-800 mb-6 backdrop-blur-sm">
                🚀 Transform Your American Dream
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-white">
                Transform Your
                <br />
                <span className="text-amber-300">Future in the U.S.</span>
              </h1>
              <p className="text-xl leading-8 text-amber-100 mb-8">
                The only platform that combines U.S. visa support, career placement, and investment guidance in one
                streamlined service. Trusted by professionals, educators, and investors from over 30 countries
                worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/schedule">
                  <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
                    <Rocket className="mr-2 h-5 w-5" />
                    Get Started Today
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/60 backdrop-blur-sm" style={{ position: "relative", zIndex: 1 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-gray-900">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Empowering your U.S. journey—no matter where you're starting from
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature Cards */}
            <div className="bg-amber-400 border-4 border-amber-600 rounded-lg p-8 shadow-lg transition-colors hover:shadow-xl">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded bg-amber-50 text-amber-900">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-amber-900">Audit, Assurance & Advisory</h3>
              <p className="text-amber-900 leading-relaxed mb-4">
                Beyond compliance audits—we deliver strategic insights tailored to cost and management efficiency.
              </p>
              <div className="flex items-center text-amber-950 text-sm font-medium">
                <CheckCircle className="h-4 w-4 mr-2" />
                Strategic, compliance-driven approach
              </div>
            </div>

            <div className="bg-amber-400 border-4 border-amber-600 rounded-lg p-8 shadow-lg transition-colors hover:shadow-xl">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded bg-amber-50 text-amber-900">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-amber-900">Research & Data Analytics</h3>
              <p className="text-amber-900 leading-relaxed mb-4">
                Optimize performance with tailored analytics—from operations efficiency to market expansion.
              </p>
              <div className="flex items-center text-amber-950 text-sm font-medium">
                <CheckCircle className="h-4 w-4 mr-2" />
                Data-driven solutions
              </div>
            </div>

            <div className="bg-amber-400 border-4 border-amber-600 rounded-lg p-8 shadow-lg transition-colors hover:shadow-xl">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded bg-amber-50 text-amber-900">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-amber-900">Training & Development</h3>
              <p className="text-amber-900 leading-relaxed mb-4">
                Partnering with universities and individuals to build finance domain expertise and career readiness.
              </p>
              <div className="flex items-center text-amber-950 text-sm font-medium">
                <CheckCircle className="h-4 w-4 mr-2" />
                Expert-led programs
              </div>
            </div>

            <div className="bg-amber-400 border-4 border-amber-600 rounded-lg p-8 shadow-lg transition-colors hover:shadow-xl">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded bg-amber-50 text-amber-900">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-amber-900">Talent Management & Recruitment</h3>
              <p className="text-amber-900 leading-relaxed mb-4">
                Customized recruitment strategies that align with your organization's unique culture and goals.
              </p>
              <div className="flex items-center text-amber-950 text-sm font-medium">
                <CheckCircle className="h-4 w-4 mr-2" />
                End-to-end hiring
              </div>
            </div>

            <Link
              href="/teacher-recruitment"
              className="bg-amber-400 border-4 border-amber-600 rounded-lg p-8 shadow-lg transition-colors hover:shadow-xl block"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded bg-amber-50 text-amber-900">
                <GraduationCapIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-amber-900">H1B Teacher Recruitment</h3>
              <p className="text-amber-900 leading-relaxed mb-4">
                Support for credential evaluation, GACE prep, and visa processing—helping educators teach in the U.S.
              </p>
              <div className="flex items-center text-amber-950 text-sm font-medium">
                <CheckCircle className="h-4 w-4 mr-2" />
                Smooth visa process →
              </div>
            </Link>

            <Link
              href="/eb5-program"
              className="bg-amber-400 border-4 border-amber-600 rounded-lg p-8 shadow-lg transition-colors hover:shadow-xl block"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded bg-amber-50 text-amber-900">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-amber-900">EB5 Investor Program</h3>
              <p className="text-amber-900 leading-relaxed mb-4">
                Guidance through vetted investment opportunities and full application support for U.S. residency.
              </p>
              <div className="flex items-center text-amber-950 text-sm font-medium">
                <CheckCircle className="h-4 w-4 mr-2" />
                Residency through investment →
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24" style={{ position: "relative", zIndex: 1 }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-10 backdrop-blur-sm">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 mb-4">
              Looking to Teach, Invest, or Grow in the U.S.?
            </h2>
            <p className="text-gray-600 mb-8">
              Whether you're an educator seeking an H1B visa, a tech professional exploring remote projects, or an
              investor pursuing residency through the EB5 program—we're here to guide you every step of the way.
            </p>
            <Link href="/schedule">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
                <Phone className="mr-2 h-4 w-4" />
                Schedule a Meeting
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <TestimonialsSection />
      </div>

      {/* Updated Footer */}
      <footer className="border-t border-white/10 py-12 bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-500 flex items-center justify-center bg-white">
              <Image
                src="/images/jagadguru-logo-new.png"
                alt="Jagadguru Logo"
                width={42}
                height={42}
                className="object-contain scale-110"
              />
            </div>
            <span className="text-lg font-semibold text-white">JAGADGURU</span>
          </div>
          <p className="text-white/70 text-sm">© 2025 Jagadguru. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}