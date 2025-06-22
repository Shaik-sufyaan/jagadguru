"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Video, Mail, Phone, Search, MoreHorizontal, Edit, Trash2, CalendarIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Booking {
  id: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  service: string
  date: string
  time: string
  status: "upcoming" | "completed" | "cancelled" | "rescheduled"
  price: string
  meetingLink: string
  duration: string
  notes?: string
}

export default function BookingDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "BK001",
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
    },
    {
      id: "BK002",
      clientName: "Michael Rodriguez",
      clientEmail: "m.rodriguez@email.com",
      service: "H1B Teacher Recruitment",
      date: "2024-12-18",
      time: "10:30 AM",
      status: "completed",
      price: "$150",
      meetingLink: "https://zoom.us/j/987654321",
      duration: "60 minutes",
    },
    {
      id: "BK003",
      clientName: "Priya Patel",
      clientEmail: "priya.patel@email.com",
      service: "IT Projects & Remote Work",
      date: "2024-12-25",
      time: "3:30 PM",
      status: "upcoming",
      price: "$100",
      meetingLink: "https://zoom.us/j/456789123",
      duration: "45 minutes",
    },
  ])

  const [filteredBookings, setFilteredBookings] = useState<Booking[]>(bookings)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")

  useEffect(() => {
    let filtered = bookings

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.service.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    // Date filter
    if (dateFilter !== "all") {
      const today = new Date()

      switch (dateFilter) {
        case "today":
          filtered = filtered.filter((booking) => {
            const bookingDate = new Date(booking.date)
            return bookingDate.toDateString() === today.toDateString()
          })
          break
        case "week":
          const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
          filtered = filtered.filter((booking) => {
            const bookingDate = new Date(booking.date)
            return bookingDate >= today && bookingDate <= weekFromNow
          })
          break
        case "month":
          const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
          filtered = filtered.filter((booking) => {
            const bookingDate = new Date(booking.date)
            return bookingDate >= today && bookingDate <= monthFromNow
          })
          break
      }
    }

    setFilteredBookings(filtered)
  }, [bookings, searchTerm, statusFilter, dateFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "rescheduled":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleReschedule = (bookingId: string) => {
    console.log("Reschedule booking:", bookingId)
    // Implement reschedule logic
  }

  const handleCancel = (bookingId: string) => {
    console.log("Cancel booking:", bookingId)
    setBookings((prev) =>
      prev.map((booking) => (booking.id === bookingId ? { ...booking, status: "cancelled" as const } : booking)),
    )
  }

  const sendReminder = (bookingId: string) => {
    console.log("Send reminder for booking:", bookingId)
    // Implement reminder logic
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Dashboard</h1>
          <p className="text-gray-600">Manage your consultations and appointments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="backdrop-blur-lg bg-white/60 border border-white/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-lg bg-white/60 border border-white/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {bookings.filter((b) => b.status === "upcoming").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-lg bg-white/60 border border-white/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {bookings.filter((b) => b.status === "completed").length}
                  </p>
                </div>
                <Video className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-lg bg-white/60 border border-white/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-amber-600">$500</p>
                </div>
                <div className="text-amber-600">💰</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="backdrop-blur-lg bg-white/60 border border-white/20 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 backdrop-blur-sm"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rescheduled">Rescheduled</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <Card className="backdrop-blur-lg bg-white/60 border border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">All Bookings</CardTitle>
            <CardDescription>Manage your consultation bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-6 rounded-lg bg-white/40 backdrop-blur-sm border border-white/20 hover:bg-white/60 transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{booking.clientName}</h3>
                          <p className="text-sm text-gray-600 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {booking.clientEmail}
                          </p>
                          {booking.clientPhone && (
                            <p className="text-sm text-gray-600 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {booking.clientPhone}
                            </p>
                          )}
                        </div>
                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">Service</p>
                          <p className="text-gray-600">{booking.service}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Date & Time</p>
                          <p className="text-gray-600">
                            {booking.date} at {booking.time}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Duration</p>
                          <p className="text-gray-600">{booking.duration}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Price</p>
                          <p className="text-gray-600">{booking.price}</p>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mt-3">
                          <p className="font-medium text-gray-900 text-sm">Notes</p>
                          <p className="text-gray-600 text-sm">{booking.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {booking.status === "upcoming" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(booking.meetingLink, "_blank")}
                            className="bg-white/50"
                          >
                            <Video className="h-4 w-4 mr-1" />
                            Join
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendReminder(booking.id)}
                            className="bg-white/50"
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Remind
                          </Button>
                        </>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="bg-white/50">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleReschedule(booking.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Reschedule
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCancel(booking.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Cancel
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Add to Calendar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}

              {filteredBookings.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
