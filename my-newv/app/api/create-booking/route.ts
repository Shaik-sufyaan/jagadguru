// app/api/booking/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase-admin"
const nodemailer = require("nodemailer")

// if (process.env.NODE_ENV === "development") {
//   process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
// }

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
})

// Function to get Zoom access token
async function getZoomAccessToken() {
  const clientId = process.env.ZOOM_CLIENT_ID
  const clientSecret = process.env.ZOOM_CLIENT_SECRET
  const accountId = process.env.ZOOM_ACCOUNT_ID

  if (!clientId || !clientSecret || !accountId) {
    throw new Error("Missing Zoom credentials in environment variables")
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const response = await fetch("https://zoom.us/oauth/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "account_credentials",
      account_id: accountId,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get Zoom access token: ${error}`)
  }

  const data = await response.json()
  return data.access_token
}

// Function to create Zoom meeting
async function createZoomMeeting(bookingData: any) {
  try {
    const accessToken = await getZoomAccessToken()

    const baseDate = new Date(bookingData.date)
    const [time, modifier] = bookingData.time.split(" ")
    let [hours, minutes] = time.split(":").map(Number)

    if (modifier === "PM" && hours < 12) hours += 12
    if (modifier === "AM" && hours === 12) hours = 0

    baseDate.setHours(hours, minutes, 0, 0)

    const meetingData = {
      topic: `${bookingData.service} - ${bookingData.name}`,
      type: 2,
      start_time: baseDate.toISOString(),
      duration: Number.parseInt(bookingData.duration) || 30,
      timezone: bookingData.timezone || "America/New_York",
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: true,
        waiting_room: true,
        audio: "both",
        auto_recording: "none",
      },
    }

    const response = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(meetingData),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create Zoom meeting: ${error}`)
    }

    const meeting = await response.json()

    return {
      id: meeting.id.toString(),
      password: meeting.password,
      join_url: meeting.join_url,
      start_url: meeting.start_url,
      topic: meeting.topic,
      start_time: meeting.start_time,
    }
  } catch (error) {
    console.error("Error creating Zoom meeting:", error)
    throw error
  }
}

// // Helper function to check if selected time is in the past
// function isTimeInPast(selectedDate: string, selectedTime: string, timezone: string): boolean {
//   try {
//     // FIX: Use standardized YYYY-MM-DD format
//     const [year, month, day] = selectedDate.split('-').map(Number);
    
//     const [time, modifier] = selectedTime.split(" ")
//     let [hours, minutes] = time.split(":").map(Number)

//     if (modifier === "PM" && hours < 12) hours += 12
//     if (modifier === "AM" && hours === 12) hours = 0

//     // Create date in the specified timezone
//     const date = new Date(year, month - 1, day, hours, minutes)
    
//     // Get current time in the same timezone
//     const now = new Date();
//     const nowInTimezone = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
    
//     return date < nowInTimezone;
//   } catch (error) {
//     console.error("Error checking time:", error)
//     return true // Fail-safe: treat as past time if error occurs
//   }
// }

// // Helper function to validate email
// function isValidEmail(email: string): boolean {
//   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//   return re.test(email)
// }

// // Helper function to format date as YYYY-MM-DD
// function formatDateToYYYYMMDD(dateString: string | Date): string {
//   const date = new Date(dateString);
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// }


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("📨 Received booking request:", body)

    // Handle both direct booking calls and webhook calls
    const bookingData = {
      name: body.name,
      email: body.email,
      phone: body.phone || "",
      // Handle different date formats
      date: body.date || (body.selectedDate ? formatDateToYYYYMMDD(body.selectedDate) : ""),
      time: body.time,
      service: body.service || "Consultation",
      duration: body.duration || "30",
      notes: body.message || body.notes || "",
      timezone: body.timezone || "America/New_York",
      currency: body.currency || "USD",
      price: body.price || "$0",
    }

    // Validate required fields
    if (!bookingData.name || !bookingData.email || !bookingData.date || !bookingData.time) {
      console.error("❌ Missing required fields:", bookingData)
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          message: "Name, email, date, and time are required.",
        },
        { status: 400 }
      )
    }

    // Validate email format
    if (!isValidEmail(bookingData.email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email format",
          message: "Please provide a valid email address.",
        },
        { status: 400 }
      )
    }

    console.log("✅ Processing booking for:", bookingData)

    // Check if time is in the past (but be more lenient for webhook calls)
    if (!body.bookingId && isTimeInPast(bookingData.date, bookingData.time, bookingData.timezone)) {
      return NextResponse.json(
        {
          success: false,
          error: "Time slot in past",
          message: "You cannot book a time slot that has already passed. Please select a future time.",
          code: "TIME_IN_PAST",
        },
        { status: 400 }
      )
    }

    // Check slot availability (skip for webhook calls that already have a booking ID)
    if (!body.bookingId) {
      const bookingsRef = db.collection("bookings")
      let snapshot
      try {
        snapshot = await bookingsRef
          .where("date", "==", bookingData.date)
          .where("time", "==", bookingData.time)
          .get()
      } catch (firestoreError) {
        console.error("❌ Firestore query error:", firestoreError)
        return NextResponse.json(
          {
            success: false,
            error: "Database error",
            message: "Failed to check slot availability. Please try again.",
          },
          { status: 500 }
        )
      }

      if (!snapshot.empty) {
        console.log(`❌ Slot already booked: ${bookingData.date} at ${bookingData.time}`)
        return NextResponse.json(
          {
            success: false,
            error: "Time slot already booked",
            message: "This time slot has been taken by another user. Please select a different time.",
            code: "SLOT_UNAVAILABLE",
          },
          { status: 409 }
        )
      }
    }
    // Create Zoom meeting
    let meetingData
    try {
      console.log('🔄 Creating Zoom meeting with data:', {
        date: bookingData.date,
        time: bookingData.time,
        timezone: bookingData.timezone,
        duration: bookingData.duration,
        service: bookingData.service
      })
      
      meetingData = await createZoomMeeting(bookingData)
      console.log("✅ Zoom meeting created successfully:", meetingData.id)
      
      if (!meetingData || !meetingData.id) {
        throw new Error('Invalid meeting data received from Zoom API')
      }
    } catch (error) {
      console.error("❌ Failed to create Zoom meeting:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create meeting",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      )
    }

    // Save booking to Firebase (use provided booking ID if available)
    let savedBooking
    try {
      const bookingRecord = {
        ...bookingData,
        status: "confirmed",
        meetingId: meetingData.id,
        meetingUrl: meetingData.join_url,
        createdAt: new Date().toISOString(),
      }
      
      let docRef
      if (body.bookingId) {
        // Use provided booking ID (from webhook)
        docRef = db.collection("bookings").doc(body.bookingId)
        await docRef.set(bookingRecord, { merge: true })
        savedBooking = { id: body.bookingId, ...bookingRecord }
      } else {
        // Create new booking
        docRef = await db.collection("bookings").add(bookingRecord)
        savedBooking = { id: docRef.id, ...bookingRecord }
      }
      
      console.log("✅ Booking saved to Firebase:", savedBooking.id)
    } catch (error) {
      console.error("❌ Failed to save booking to Firebase:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to save booking",
          message: "Could not save your booking. Please try again.",
        },
        { status: 500 }
      )
    }

    // Send emails
    let emailsSuccess = false
    try {
      console.log("📧 Sending confirmation emails...")
      
      const adminMailOptions = {
        from: {
          name: "JAGADGURU Booking System",
          address: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        },
        to: process.env.EMAIL_USER,
        subject: `🆕 New Booking: ${bookingData.name} - ${bookingData.service}`,
        html: generateAdminEmailContent(bookingData, savedBooking, meetingData),
      }

      const customerMailOptions = {
        from: {
          name: "JAGADGURU",
          address: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        },
        to: bookingData.email,
        subject: `✅ Meeting Confirmed: ${bookingData.service} on ${new Date(bookingData.date).toLocaleDateString()}`,
        html: generateCustomerEmailContent(bookingData, meetingData),
      }

      await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(customerMailOptions),
      ])
      
      emailsSuccess = true
      console.log("✅ All emails sent successfully")
    } catch (emailError) {
      console.error("❌ Failed to send emails:", emailError)
      // Continue since booking was created successfully
    }

    // Prepare response data
    const responseData = {
      success: true,
      message: "Booking created successfully",
      booking: savedBooking,
      meeting: {
        id: meetingData.id,
        join_url: meetingData.join_url,
        start_url: meetingData.start_url,
        password: meetingData.password,
        start_time: meetingData.start_time,
      },
      emailsSent: emailsSuccess,
    }

    console.log('✅ Sending success response with meeting data')
    
    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error("❌ Booking process failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Booking failed",
        message: error.message || "An unexpected error occurred",
        details: "Please try again or contact support if the issue persists",
      },
      { status: 500 }
    )
  }
}

  // Helper function to format date as YYYY-MM-DD
  function formatDateToYYYYMMDD(dateString: string | Date): string {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Helper function to validate email
  function isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  // Helper function to check if selected time is in the past
  function isTimeInPast(selectedDate: string, selectedTime: string, timezone: string): boolean {
    try {
      const [year, month, day] = selectedDate.split('-').map(Number)
      
      const [time, modifier] = selectedTime.split(" ")
      let [hours, minutes] = time.split(":").map(Number)

      if (modifier === "PM" && hours < 12) hours += 12
      if (modifier === "AM" && hours === 12) hours = 0

      const date = new Date(year, month - 1, day, hours, minutes)
      const now = new Date()
      const nowInTimezone = new Date(now.toLocaleString("en-US", { timeZone: timezone }))
      
      return date < nowInTimezone
    } catch (error) {
      console.error("Error checking time:", error)
      return true
    }
  }

// Helper functions for email content generation
function generateAdminEmailContent(bookingData: any, savedBooking: any, meetingData: any): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">New Booking Request</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
        <p><strong>👤 Name:</strong> ${bookingData.name}</p>
        <p><strong>✉️ Email:</strong> ${bookingData.email}</p>
        <p><strong>📞 Phone:</strong> ${bookingData.phone}</p>
        <p><strong>🔧 Service:</strong> ${bookingData.service}</p>
        <p><strong>📅 Date:</strong> ${new Date(bookingData.date).toLocaleDateString()}</p>
        <p><strong>⏰ Time:</strong> ${bookingData.time}</p>
        <p><strong>🌍 Timezone:</strong> ${bookingData.timezone}</p>
        <p><strong>💰 Price:</strong> ${bookingData.price} (${bookingData.currency})</p>
        <p><strong>⏱️ Duration:</strong> ${bookingData.duration} minutes</p>
        ${bookingData.notes ? `<p><strong>📝 Notes:</strong> ${bookingData.notes}</p>` : ""}
        <p><strong>🆔 Booking ID:</strong> ${savedBooking.id}</p>
      </div>
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-top: 15px;">
        <h3 style="color: #1976d2;">🎥 Zoom Meeting Details</h3>
        <p><strong>Meeting ID:</strong> ${meetingData.id}</p>
        <p><strong>Password:</strong> ${meetingData.password}</p>
        <p><strong>Host URL:</strong> <a href="${meetingData.start_url}">Start Meeting</a></p>
        <p><strong>Join URL:</strong> <a href="${meetingData.join_url}">Join Meeting</a></p>
      </div>
    </div>
  `
}

function generateCustomerEmailContent(bookingData: any, meetingData: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Confirmation - JAGADGURU</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { padding: 30px; border: 1px solid #ddd; border-radius: 0 0 12px 12px; }
        .meeting-details { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        .zoom-details { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1976d2; }
        .button { display: inline-block; background: #1976d2; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 10px 5px; font-weight: bold; }
        .button:hover { background: #1565c0; }
        .important { background: #fff3cd; padding: 15px; border-radius: 8px; border: 1px solid #ffeaa7; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Booking Confirmed!</h1>
        <p>Your consultation with JAGADGURU has been scheduled</p>
      </div>
      <div class="content">
        <h2>Hello ${bookingData.name},</h2>
        <p>Thank you for booking a consultation with us! Your Zoom meeting has been created and is ready.</p>
        
        <div class="meeting-details">
          <h3>📅 Appointment Details</h3>
          <p><strong>Service:</strong> ${bookingData.service}</p>
          <p><strong>Date:</strong> ${new Date(bookingData.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          <p><strong>Time:</strong> ${bookingData.time} (${bookingData.timezone})</p>
          <p><strong>Duration:</strong> ${bookingData.duration} minutes</p>
          <p><strong>Price:</strong> ${bookingData.price} (${bookingData.currency})</p>
        </div>

        <div class="zoom-details">
          <h3>🎥 Zoom Meeting Information</h3>
          <p><strong>Meeting ID:</strong> ${meetingData.id}</p>
          <p><strong>Password:</strong> ${meetingData.password}</p>
          <p><strong>Topic:</strong> ${meetingData.topic}</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${meetingData.join_url}" class="button">🎥 Join Zoom Meeting</a>
          </div>
          
          <p style="font-size: 12px; color: #666;">
            <strong>Join by phone:</strong><br>
            Dial: +1 346 248 7799<br>
            Meeting ID: ${meetingData.id}<br>
            Password: ${meetingData.password}
          </p>
        </div>

        <div class="important">
          <h4>📋 Important Instructions:</h4>
          <ul>
            <li><strong>Join 5 minutes early</strong> - The meeting has a waiting room enabled</li>
            <li><strong>Test your audio/video</strong> beforehand at <a href="https://zoom.us/test">zoom.us/test</a></li>
            <li><strong>Have a stable internet connection</strong></li>
            <li><strong>Find a quiet, well-lit space</strong> for the best experience</li>
            <li><strong>To reschedule:</strong> Contact us at least 24 hours in advance</li>
          </ul>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <h4>Need Help?</h4>
          <p>If you have any questions or technical issues, please contact us:</p>
          <p>📧 Email: ${process.env.EMAIL_USER}</p>
        </div>

        <p style="margin-top: 30px;">We look forward to speaking with you!</p>
        <p><strong>Best regards,<br>The JAGADGURU Team</strong></p>
      </div>
      <div class="footer">
        <p>This is an automated confirmation. Please save this email for your records.</p>
        <p>© ${new Date().getFullYear()} JAGADGURU. All rights reserved.</p>
      </div>
    </body>
    </html>
  `
}