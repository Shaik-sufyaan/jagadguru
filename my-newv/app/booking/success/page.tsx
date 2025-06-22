"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Calendar, Clock, User, Mail } from "lucide-react"

// Component that uses useSearchParams - must be wrapped in Suspense
function BookingSuccessContent() {
  const searchParams = useSearchParams()
  const [bookingDetails, setBookingDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    
    if (!sessionId) {
      setError("No session ID found")
      setLoading(false)
      return
    }

    const fetchBookingDetails = async () => {
      try {
        const response = await fetch(`/api/booking-details?session_id=${sessionId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch booking details')
        }

        const data = await response.json()
        setBookingDetails(data)
      } catch (err) {
        console.error('Error fetching booking details:', err)
        setError('Failed to load booking details')
      } finally {
        setLoading(false)
      }
    }

    fetchBookingDetails()
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your booking details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/schedule">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              Try Booking Again
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-amber-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your consultation has been booked successfully. You will receive a confirmation email with the Zoom link shortly.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {bookingDetails && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-amber-600" />
                  Booking Details
                </CardTitle>
                <CardDescription>Your consultation information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Service</p>
                      <p className="text-gray-600">{bookingDetails.service}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Date & Time</p>
                      <p className="text-gray-600">
                        {new Date(bookingDetails.date).toLocaleDateString()} at {bookingDetails.time} EST
                      </p>
                      <p className="text-sm text-gray-500">Duration: {bookingDetails.duration} minutes</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Contact Information</p>
                      <p className="text-gray-600">{bookingDetails.name}</p>
                      <p className="text-gray-600">{bookingDetails.email}</p>
                      {bookingDetails.phone && (
                        <p className="text-gray-600">{bookingDetails.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Payment Status</p>
                      <p className="text-green-600 font-medium">Paid - {bookingDetails.displayPrice || `$${bookingDetails.price}`}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-amber-600" />
                  What happens next?
                </CardTitle>
                <CardDescription>Your next steps</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Confirmation Email</p>
                      <p className="text-gray-600 text-sm">
                        You will receive a confirmation email with your Zoom meeting link within the next few minutes.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Calendar Reminder</p>
                      <p className="text-gray-600 text-sm">
                        Add the meeting to your calendar so you don't miss your consultation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Prepare for Your Meeting</p>
                      <p className="text-gray-600 text-sm">
                        Think about your goals and questions you'd like to discuss during the consultation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800 text-sm font-medium mb-2">Need to reschedule?</p>
                  <p className="text-amber-700 text-sm">
                    Contact us at least 24 hours before your appointment if you need to reschedule.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link href="/">
            <Button variant="outline" className="border-gray-300">
              Return to Home
            </Button>
          </Link>
          <Link href="/schedule">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              Book Another Consultation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

// Main component with Suspense wrapper
export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  )
}