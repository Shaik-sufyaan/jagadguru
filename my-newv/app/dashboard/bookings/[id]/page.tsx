"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarService } from "@/lib/calendar-service"
import { EmailService } from "@/lib/email-service"
import { Video, Mail, Calendar, Download, Edit, Trash2, Clock } from "lucide-react"

export default function BookingDetailsPage() {
  const params = useParams()
  const bookingId = params.id as string

  // Mock booking data - in real app, fetch from API
  const [booking] = useState({
    id: bookingId,
    clientName: "Sarah Chen",
    clientEmail: "sarah.chen@email.com",
    clientPhone: "+1-555-0123",
    service: "EB5 Investor Program",
    date: "2024-12-20",
    time: "2:00 PM",
    status: "upcoming",
    price: "$250",
    meetingLink: "https://zoom.us/j/123456789",
    duration: "90 minutes",
    notes: "Interested in real estate investment options",
    paymentId: "pi_1234567890",
    receiptUrl: "https://pay.stripe.com/receipts/pi_1234567890",
  })

  const handleAddToCalendar = (type: "google" | "outlook" | "ics") => {
    const event = {
      title: `${booking.service} - JAGADGURU Consultation`,
      description: `Consultation with ${booking.clientName} for ${booking.service}`,
      startTime: new Date(`${booking.date} ${booking.time}`).toISOString(),
      endTime: new Date(new Date(`${booking.date} ${booking.time}`).getTime() + 90 * 60000).toISOString(),
      attendees: [booking.clientEmail],
      meetingLink: booking.meetingLink,
    }

    switch (type) {
      case "google":
        window.open(CalendarService.generateGoogleCalendarLink(event), "_blank")
        break
      case "outlook":
        window.open(CalendarService.generateOutlookCalendarLink(event), "_blank")
        break
      case "ics":
        const icsContent = CalendarService.generateICSFile(event)
        const blob = new Blob([icsContent], { type: "text/calendar" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `booking-${booking.id}.ics`
        a.click()
        break
    }
  }

  const sendReminder = async () => {
    await EmailService.sendReminder({
      id: booking.id,
      userName: booking.clientName,
      userEmail: booking.clientEmail,
      service: booking.service,
      date: booking.date,
      time: booking.time,
      price: booking.price,
      currency: "USD",
      meetingLink: booking.meetingLink,
      duration: booking.duration,
    })
    alert("Reminder sent successfully!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Details</h1>
          <p className="text-gray-600">Booking ID: {booking.id}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="backdrop-blur-lg bg-white/60 border border-white/20 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Consultation Details</CardTitle>
                  <Badge
                    className={
                      booking.status === "upcoming"
                        ? "bg-blue-100 text-blue-800"
                        : booking.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {booking.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Service</h4>
                    <p className="text-gray-600">{booking.service}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Duration</h4>
                    <p className="text-gray-600">{booking.duration}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Date</h4>
                    <p className="text-gray-600">{booking.date}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Time</h4>
                    <p className="text-gray-600">{booking.time} EST</p>
                  </div>
                </div>

                {booking.notes && (
                  <div>
                    <h4 className="font-medium text-gray-900">Notes</h4>
                    <p className="text-gray-600">{booking.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="backdrop-blur-lg bg-white/60 border border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">Name</h4>
                  <p className="text-gray-600">{booking.clientName}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Email</h4>
                  <p className="text-gray-600">{booking.clientEmail}</p>
                </div>
                {booking.clientPhone && (
                  <div>
                    <h4 className="font-medium text-gray-900">Phone</h4>
                    <p className="text-gray-600">{booking.clientPhone}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="backdrop-blur-lg bg-white/60 border border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Amount</span>
                  <span className="text-gray-600">{booking.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Payment ID</span>
                  <span className="text-gray-600 font-mono text-sm">{booking.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Receipt</span>
                  <a
                    href={booking.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:text-amber-700 flex items-center"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            <Card className="backdrop-blur-lg bg-white/60 border border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {booking.status === "upcoming" && (
                  <>
                    <Button
                      className="w-full bg-amber-600 hover:bg-amber-700"
                      onClick={() => window.open(booking.meetingLink, "_blank")}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Join Meeting
                    </Button>

                    <Button variant="outline" className="w-full bg-white/50" onClick={sendReminder}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Reminder
                    </Button>
                  </>
                )}

                <Button variant="outline" className="w-full bg-white/50">
                  <Edit className="h-4 w-4 mr-2" />
                  Reschedule
                </Button>

                <Button variant="outline" className="w-full bg-white/50 text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cancel Booking
                </Button>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-lg bg-white/60 border border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle>Add to Calendar</CardTitle>
                <CardDescription>Sync this booking with your calendar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full bg-white/50" onClick={() => handleAddToCalendar("google")}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Google Calendar
                </Button>

                <Button variant="outline" className="w-full bg-white/50" onClick={() => handleAddToCalendar("outlook")}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Outlook
                </Button>

                <Button variant="outline" className="w-full bg-white/50" onClick={() => handleAddToCalendar("ics")}>
                  <Download className="h-4 w-4 mr-2" />
                  Download .ics
                </Button>
              </CardContent>
            </Card>

            {booking.status === "upcoming" && (
              <Card className="backdrop-blur-lg bg-white/60 border border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Meeting Countdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">2 days</div>
                    <div className="text-sm text-gray-600">until meeting</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
