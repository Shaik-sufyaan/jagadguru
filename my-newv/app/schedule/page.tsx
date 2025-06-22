// C:\Users\sufya\OneDrive\Desktop\Website\my-newv\app\schedule\page.tsx

"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { ArrowLeft, CalendarIcon, Clock, CheckCircle, CreditCard } from "lucide-react"
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function SchedulePage() {
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedService, setSelectedService] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [lockedSlots, setLockedSlots] = useState<Set<string>>(new Set())
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9))
  const [currency, setCurrency] = useState("USD")
  const [exchangeRates] = useState({
    USD: 1,
    INR: 83.12,
    AED: 3.67,
    SAR: 3.75,
    AUD: 1.52,
    SGD: 1.34,
    ZAR: 18.45,
  })
  const [paymentStep, setPaymentStep] = useState(false)
  const [bookingData, setBookingData] = useState<any>(null)
  const sessionTimeoutRef = useRef<NodeJS.Timeout>()

  const detectCurrency = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (timezone.includes("Asia/Kolkata") || timezone.includes("Asia/Calcutta")) return "INR"
    if (timezone.includes("Asia/Dubai")) return "AED"
    if (timezone.includes("Asia/Riyadh")) return "SAR"
    if (timezone.includes("Australia")) return "AUD"
    if (timezone.includes("Asia/Singapore")) return "SGD"
    if (timezone.includes("Africa")) return "ZAR"
    return "USD"
  }

  const formatPrice = (priceUSD: number) => {
    const convertedPrice = Math.round(priceUSD * exchangeRates[currency as keyof typeof exchangeRates])
    const currencySymbols = {
      USD: "$",
      INR: "₹",
      AED: "د.إ",
      SAR: "﷼",
      AUD: "A$",
      SGD: "S$",
      ZAR: "R",
    }
    return `${currencySymbols[currency as keyof typeof currencySymbols]}${convertedPrice}`
  }

  const lockTimeSlot = (date: Date, time: string) => {
    const slotKey = `${date.toDateString()}-${time}`
    setLockedSlots((prev) => {
      const newSet = new Set(prev)
      newSet.add(slotKey)
      return newSet
    })

    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current)
    }

    sessionTimeoutRef.current = setTimeout(
      () => {
        setLockedSlots((prev) => {
          const newSet = new Set(prev)
          newSet.delete(slotKey)
          return newSet
        })
      },
      10 * 60 * 1000,
    )
  }

  const isSlotLocked = (time: string) => {
    if (!selectedDate) return false;
    
    // Combine both booked slots and locked slots
    const slotKey = `${selectedDate.toDateString()}-${time}`;
    
    // Check if booked by anyone
    if (bookedSlots.includes(time)) return true;
    
    // Check if temporarily locked
    if (lockedSlots.has(slotKey)) return true;
    
    // Check if in the past
    const now = new Date();
    const [timePart, period] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    const slotDate = new Date(selectedDate);
    slotDate.setHours(hours, minutes, 0, 0);
    
    return slotDate < now;
  };

  useEffect(() => {
    setCurrency(detectCurrency())

    return () => {
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDate) return;
      
      try {
        const dateStr = selectedDate.toISOString().split('T')[0];
        const response = await fetch(`/api/booked-slots?date=${dateStr}`);
        
        if (response.ok) {
          const data = await response.json();
          setBookedSlots(data.bookedSlots || []);
        } else {
          console.error('Failed to fetch booked slots');
        }
      } catch (error) {
        console.error('Error fetching booked slots:', error);
      }
    };

    fetchBookedSlots();
  }, [selectedDate]);

  const consultationTypes = [
    {
      id: "teacher-recruitment",
      name: "H1B Teacher Recruitment",
      price: 150,
      duration: "60 minutes",
      description: "Comprehensive consultation for educators seeking H1B visa sponsorship",
    },
    {
      id: "eb5-program",
      name: "EB5 Investor Program",
      price: 250,
      duration: "90 minutes",
      description: "Investment consultation for permanent residency through EB5",
    },
    {
      id: "it-projects",
      name: "IT Projects & Remote Work",
      price: 100,
      duration: "45 minutes",
      description: "Career guidance for tech professionals and remote opportunities",
    },
    {
      id: "general-consultation",
      name: "General Consultation",
      price: 125,
      duration: "60 minutes",
      description: "Comprehensive assessment of your U.S. immigration options",
    },
  ].map((consultation) => ({
    ...consultation,
    displayPrice: formatPrice(consultation.price),
  }))

  const selectedConsultation = consultationTypes.find((type) => type.id === selectedService)

  const handleBookingSubmit = async () => {
    if (!selectedDate || !selectedTime || !selectedConsultation) {
      alert("Please select date, time, and service");
      return;
    }

    setIsProcessing(true)

    try {
      // Lock the time slot
      lockTimeSlot(selectedDate, selectedTime);

      // Create booking data
      const tempBookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        service: selectedConsultation.name,
        serviceId: selectedService,
        selectedDate: selectedDate.toISOString(),
        date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD format
        time: selectedTime,
        duration: parseInt(selectedConsultation.duration.split(' ')[0]), // Extract number from "60 minutes"
        price: selectedConsultation.price, // Use original USD price for Stripe
        displayPrice: selectedConsultation.displayPrice,
        currency: currency,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }

      console.log("Booking data prepared:", tempBookingData);
      setBookingData(tempBookingData)
      setPaymentStep(true)
    } catch (error) {
      console.error("Booking preparation error:", error)
      alert("Booking preparation failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleStripePayment = async () => {
    if (!bookingData || !selectedConsultation) {
      alert("Booking data is missing");
      return;
    }
    
    setIsProcessing(true);

    try {
      console.log("Creating Stripe checkout session with data:", bookingData);

      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          // Send all the booking data
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone,
          message: bookingData.message,
          service: bookingData.service,
          serviceId: bookingData.serviceId,
          date: bookingData.date,
          time: bookingData.time,
          duration: bookingData.duration,
          price: bookingData.price,
          currency: bookingData.currency,
          timezone: bookingData.timezone,
          // Stripe-specific data
          successUrl: `${window.location.origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/schedule`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { sessionId, bookingId } = await response.json();
      console.log("Received session ID:", sessionId, "Booking ID:", bookingId);

      // Save booking ID to local storage or state for later reference
      localStorage.setItem('currentBookingId', bookingId);

      if (!sessionId) {
        throw new Error('No session ID received from server');
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      console.log("Redirecting to Stripe checkout...");
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        console.error('Stripe redirect error:', error);
        throw new Error(error.message || 'Payment redirect failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]

  // Payment Step UI
  if (paymentStep && bookingData) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-amber-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            <div className="text-center">
              <CreditCard className="mx-auto h-16 w-16 text-amber-600 mb-6" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Complete Your Payment</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Review your booking details and proceed to secure payment
              </p>
            </div>
          </div>
        </div>
        

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Booking Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong className="text-gray-900">Service:</strong>
                  <p className="text-gray-700">{bookingData.service}</p>
                </div>
                <div>
                  <strong className="text-gray-900">Duration:</strong>
                  <p className="text-gray-700">{bookingData.duration} minutes</p>
                </div>
                <div>
                  <strong className="text-gray-900">Date:</strong>
                  <p className="text-gray-700">{selectedDate?.toLocaleDateString()}</p>
                </div>
                <div>
                  <strong className="text-gray-900">Time:</strong>
                  <p className="text-gray-700">{bookingData.time} EST</p>
                </div>
                <div>
                  <strong className="text-gray-900">Name:</strong>
                  <p className="text-gray-700">{bookingData.name}</p>
                </div>
                <div>
                  <strong className="text-gray-900">Email:</strong>
                  <p className="text-gray-700">{bookingData.email}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-amber-600">{bookingData.displayPrice}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Buttons */}
          <div className="space-y-4">
            <Button
              onClick={handleStripePayment}
              disabled={isProcessing}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 text-lg"
            >
              {isProcessing ? (
                "Processing..."
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Pay {bookingData.displayPrice} with Stripe
                </>
              )}
            </Button>

            <div className="text-center text-sm text-gray-500">
              <p>🔒 Secure payment powered by Stripe</p>
              <p>You will receive a confirmation email with Zoom link after payment</p>
            </div>

            <Button
              variant="outline"
              onClick={() => setPaymentStep(false)}
              className="w-full border-gray-300"
            >
              Back to Booking Details
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Your consultation has been booked successfully. You will receive a confirmation email with the Zoom link
            shortly.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
            <h3 className="font-semibold mb-2 text-gray-900">Meeting Details:</h3>
            <p className="text-sm text-gray-600">
              <strong>Date:</strong> {selectedDate?.toLocaleDateString()}
              <br />
              <strong>Time:</strong> {selectedTime}
              <br />
              <strong>Service:</strong> {selectedConsultation?.name}
              <br />
              <strong>Price:</strong> {selectedConsultation?.displayPrice}
            </p>
          </div>
          <Link href="/">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">Return to Home</Button>
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
          <Link href="/" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <div className="text-center">
            <CalendarIcon className="mx-auto h-16 w-16 text-amber-600 mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Schedule a Consultation</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Book a consultation with our experts to discuss your U.S. journey and get personalized guidance.
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center space-x-8 mb-8">
          <div className={`flex items-center ${currentStep >= 1 ? "text-amber-600" : "text-gray-400"}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 1 ? "border-amber-600 bg-amber-600 text-white" : "border-gray-300"
              }`}
            >
              1
            </div>
            <span className="ml-2 font-medium">Service & Details</span>
          </div>
          <div className={`w-16 h-1 ${currentStep >= 2 ? "bg-amber-600" : "bg-gray-300"}`}></div>
          <div className={`flex items-center ${currentStep >= 2 ? "text-amber-600" : "text-gray-400"}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 2 ? "border-amber-600 bg-amber-600 text-white" : "border-gray-300"
              }`}
            >
              2
            </div>
            <span className="ml-2 font-medium">Date & Time</span>
          </div>
        </div>

        {/* Step 1: Service Selection */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Choose Your Consultation Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {consultationTypes.map((consultation) => (
                <Card
                  key={consultation.id}
                  className={`cursor-pointer border-2 transition-colors ${
                    selectedService === consultation.id
                      ? "border-amber-600 bg-amber-50"
                      : "border-gray-200 hover:border-amber-200"
                  }`}
                  onClick={() => setSelectedService(consultation.id)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{consultation.name}</CardTitle>
                        <CardDescription className="mt-2">{consultation.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-amber-600">{consultation.displayPrice}</div>
                        <div className="text-sm text-gray-500">{consultation.duration}</div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your goals and how we can help..."
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <Button
                onClick={() => setCurrentStep(2)}
                disabled={!selectedService || !formData.name.trim() || !formData.email.trim()}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                Continue to Date & Time
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Date & Time Selection + Booking */}
        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Select Date & Time</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    Select Date
                  </CardTitle>
                  <CardDescription>Choose your preferred consultation date</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                    className="rounded border border-gray-200"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Select Time
                  </CardTitle>
                  <CardDescription>Choose your preferred time (EST)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => {
                      const isLocked = isSlotLocked(time);
                      
                      return (
                        <Button
                          key={time}
                          type="button"
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => !isLocked && setSelectedTime(time)}
                          disabled={isLocked}
                          className={`text-xs ${
                            selectedTime === time
                              ? "bg-amber-600 hover:bg-amber-700 text-white"
                              : isLocked
                                ? "border-red-300 bg-red-50 text-red-400 cursor-not-allowed"
                                : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {time}
                          {isLocked && <span className="ml-1 text-xs">🔒</span>}
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
                      
            {selectedDate && selectedTime && selectedConsultation && (
              <Card className="mt-8 bg-amber-50 border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-900">Consultation Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <strong className="text-amber-900">Service:</strong>
                      <p className="text-amber-700">{selectedConsultation.name}</p>
                    </div>
                    <div>
                      <strong className="text-amber-900">Date:</strong>
                      <p className="text-amber-700">{selectedDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <strong className="text-amber-900">Time:</strong>
                      <p className="text-amber-700">{selectedTime} EST</p>
                    </div>
                    <div>
                      <strong className="text-amber-900">Price:</strong>
                      <p className="text-amber-700">{selectedConsultation?.displayPrice}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setCurrentStep(1)} className="border-gray-300">
                Back to Service Selection
              </Button>
              <Button
                onClick={handleBookingSubmit}
                disabled={!selectedDate || !selectedTime || isProcessing}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                {isProcessing ? "Preparing..." : "Continue to Payment"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}