"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, Calendar, DollarSign, TrendingUp, Clock, Bell, Settings, Search, Filter } from "lucide-react"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30">
      {/* Glassmorphism Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <span className="text-xl font-bold text-gray-900">JAGADGURU Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Admin</h1>
          <p className="text-gray-600">Here's what's happening with your consultations and services today.</p>
        </div>

        {/* Glassmorphism Tab Navigation */}
        <div className="mb-8">
          <div className="backdrop-blur-lg bg-white/60 rounded-xl border border-white/20 shadow-lg p-1 inline-flex">
            {[
              { id: "overview", label: "Overview" },
              { id: "bookings", label: "Bookings" },
              { id: "analytics", label: "Analytics" },
              { id: "clients", label: "Clients" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-amber-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="backdrop-blur-lg bg-white/60 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">$45,231</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-lg bg-white/60 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Clients</CardTitle>
                  <Users className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">2,350</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +180 new this month
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-lg bg-white/60 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Consultations</CardTitle>
                  <Calendar className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">573</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +19% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-lg bg-white/60 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
                  <BarChart3 className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">94.5%</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2.1% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="backdrop-blur-lg bg-white/60 border border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Recent Bookings</CardTitle>
                  <CardDescription>Latest consultation bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Sarah Chen",
                        service: "EB5 Consultation",
                        time: "2:00 PM Today",
                        status: "confirmed",
                      },
                      {
                        name: "Michael Rodriguez",
                        service: "Teacher Recruitment",
                        time: "10:30 AM Tomorrow",
                        status: "pending",
                      },
                      {
                        name: "Priya Patel",
                        service: "IT Projects",
                        time: "3:30 PM Tomorrow",
                        status: "confirmed",
                      },
                    ].map((booking, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/40">
                        <div>
                          <p className="font-medium text-gray-900">{booking.name}</p>
                          <p className="text-sm text-gray-600">{booking.service}</p>
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {booking.time}
                          </p>
                        </div>
                        <Badge
                          variant={booking.status === "confirmed" ? "default" : "secondary"}
                          className={
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-lg bg-white/60 border border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Service Performance</CardTitle>
                  <CardDescription>This month's service metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { service: "EB5 Program", bookings: 45, revenue: "$11,250", growth: "+15%" },
                      { service: "Teacher Recruitment", bookings: 32, revenue: "$4,800", growth: "+8%" },
                      { service: "IT Projects", bookings: 28, revenue: "$2,800", growth: "+22%" },
                      { service: "General Consultation", bookings: 18, revenue: "$2,250", growth: "+5%" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/40">
                        <div>
                          <p className="font-medium text-gray-900">{item.service}</p>
                          <p className="text-sm text-gray-600">{item.bookings} bookings</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{item.revenue}</p>
                          <p className="text-sm text-green-600">{item.growth}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <Card className="backdrop-blur-lg bg-white/60 border border-white/20 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <Button variant="outline" className="bg-white/50 backdrop-blur-sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Bookings List */}
            <Card className="backdrop-blur-lg bg-white/60 border border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">All Bookings</CardTitle>
                <CardDescription>Manage and track consultation bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: "BK001",
                      client: "Sarah Chen",
                      email: "sarah.chen@email.com",
                      service: "EB5 Investor Program",
                      date: "Dec 15, 2024",
                      time: "2:00 PM",
                      status: "confirmed",
                      amount: "$250",
                    },
                    {
                      id: "BK002",
                      client: "Michael Rodriguez",
                      email: "m.rodriguez@email.com",
                      service: "H1B Teacher Recruitment",
                      date: "Dec 16, 2024",
                      time: "10:30 AM",
                      status: "pending",
                      amount: "$150",
                    },
                    {
                      id: "BK003",
                      client: "Priya Patel",
                      email: "priya.patel@email.com",
                      service: "IT Projects & Remote Work",
                      date: "Dec 16, 2024",
                      time: "3:30 PM",
                      status: "confirmed",
                      amount: "$100",
                    },
                  ].map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/20 hover:bg-white/60 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="font-medium text-gray-900">{booking.client}</p>
                              <p className="text-sm text-gray-600">{booking.email}</p>
                            </div>
                            <div className="hidden sm:block">
                              <p className="text-sm font-medium text-gray-900">{booking.service}</p>
                              <p className="text-xs text-gray-600">
                                {booking.date} at {booking.time}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{booking.amount}</p>
                            <Badge
                              variant={booking.status === "confirmed" ? "default" : "secondary"}
                              className={
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {booking.status}
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm" className="bg-white/50">
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <Card className="backdrop-blur-lg bg-white/60 border border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Analytics Dashboard</CardTitle>
                <CardDescription>Detailed insights and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-600">
                    Advanced analytics and reporting features will be available in the next update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === "clients" && (
          <div className="space-y-6">
            <Card className="backdrop-blur-lg bg-white/60 border border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Client Management</CardTitle>
                <CardDescription>View and manage your client relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Client Portal Coming Soon</h3>
                  <p className="text-gray-600">
                    Comprehensive client management tools will be available in the next update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
