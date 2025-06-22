import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'Not implemented yet' });
}

// // app/api/booking/route.ts
// //
// //  THE CODE HELPS WITH BOOKING A MEETING AND SENDING MAILS TO THE HOST AND THE USER.
// //  THIS IS LIKE THE BACKEND OF MY WEBSITE
// if (process.env.NODE_ENV === "development") {
//   process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" // Remove these lines after deploying. These lines will help with sll connection.
// }

// import { type NextRequest, NextResponse } from "next/server"
// const nodemailer = require("nodemailer")

// export const runtime = "nodejs"
// export const dynamic = "force-dynamic"

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_APP_PASSWORD,
//   },
// })

// // Function to get Zoom access token
// async function getZoomAccessToken() {
//   const clientId = process.env.ZOOM_CLIENT_ID
//   const clientSecret = process.env.ZOOM_CLIENT_SECRET
//   const accountId = process.env.ZOOM_ACCOUNT_ID

//   if (!clientId || !clientSecret || !accountId) {
//     throw new Error("Missing Zoom credentials in environment variables")
//   }

//   const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

//   const response = await fetch("https://zoom.us/oauth/token", {
//     method: "POST",
//     headers: {
//       Authorization: `Basic ${credentials}`,
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: new URLSearchParams({
//       grant_type: "account_credentials",
//       account_id: accountId,
//     }),
//   })

//   if (!response.ok) {
//     const error = await response.text()
//     throw new Error(`Failed to get Zoom access token: ${error}`)
//   }

//   const data = await response.json()
//   return data.access_token
// }

// // Function to create Zoom meeting
// async function createZoomMeeting(bookingData: any) {
//   try {
//     const accessToken = await getZoomAccessToken()

//     // Convert date and time to ISO format
//     const baseDate = new Date(bookingData.date) // ISO string is fine
//     const [time, modifier] = bookingData.time.split(" ") // e.g. "9:00 AM"
//     let [hours, minutes] = time.split(":").map(Number)

//     if (modifier === "PM" && hours < 12) hours += 12
//     if (modifier === "AM" && hours === 12) hours = 0

//     baseDate.setHours(hours, minutes, 0, 0)

//     const meetingDateTime = baseDate

//     const meetingData = {
//       topic: `${bookingData.service} - ${bookingData.name}`,
//       type: 2, // Scheduled meeting
//       start_time: meetingDateTime.toISOString(),
//       duration: Number.parseInt(bookingData.duration) || 30, // Duration in minutes
//       timezone: bookingData.timezone || "America/New_York", // Use user's timezone
//       settings: {
//         host_video: true,
//         participant_video: true,
//         join_before_host: false,
//         mute_upon_entry: true,
//         waiting_room: true,
//         audio: "both",
//         auto_recording: "none",
//       },
//     }

//     const response = await fetch("https://api.zoom.us/v2/users/me/meetings", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(meetingData),
//     })

//     if (!response.ok) {
//       const error = await response.text()
//       throw new Error(`Failed to create Zoom meeting: ${error}`)
//     }

//     const meeting = await response.json()

//     return {
//       id: meeting.id.toString(),
//       password: meeting.password,
//       join_url: meeting.join_url,
//       start_url: meeting.start_url,
//       topic: meeting.topic,
//       start_time: meeting.start_time,
//     }
//   } catch (error) {
//     console.error("Error creating Zoom meeting:", error)
//     throw error
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
//     console.log("Received booking request:", body)

//     // Validate and normalize data
//     if (!body.name || !body.email || !body.selectedDate) {
//       return NextResponse.json(
//         {
//           error: "Missing required fields",
//           required: ["name", "email", "selectedDate"],
//           received: Object.keys(body),
//         },
//         { status: 400 },
//       )
//     }

//     const bookingData = {
//       name: body.name,
//       email: body.email,
//       phone: body.phone || "",
//       date: body.selectedDate, // Use selectedDate to match frontend
//       time: body.time || "10:00 AM",
//       service: body.service || "Consultation",
//       duration: body.duration || "30",
//       notes: body.message || body.notes || "", // Handle both message and notes
//       timezone: body.timezone || "America/New_York",
//       currency: body.currency || "USD",
//       price: body.price || "$0",
//     }

//     console.log("Processing booking for:", bookingData)

//     // Step 1: Check if slot is already booked using memory database
//     try {
//       const { memoryDB } = await import("@/lib/memory-db")
//       const bookingDate = new Date(bookingData.date)

//       if (memoryDB.isSlotBooked(bookingDate, bookingData.time)) {
//         console.log(`Slot already booked: ${bookingDate.toDateString()}-${bookingData.time}`)
//         return NextResponse.json(
//           {
//             success: false,
//             error: "Time slot already booked",
//             message: "This time slot has been taken by another user. Please select a different time.",
//             code: "SLOT_UNAVAILABLE",
//           },
//           { status: 409 }, // Conflict status
//         )
//       }

//       console.log(`Slot available: ${bookingDate.toDateString()}-${bookingData.time}`)
//     } catch (error) {
//       console.error("Error checking slot availability:", error)
//       // Continue with booking but log the error
//     }

//     // Step 2: Create Zoom meeting
//     let meetingData
//     try {
//       meetingData = await createZoomMeeting(bookingData)
//       console.log("Zoom meeting created successfully:", meetingData.id)
//     } catch (error) {
//       console.error("Failed to create Zoom meeting:", error)
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Failed to create meeting",
//           details: error instanceof Error ? error.message : "Unknown error",
//         },
//         { status: 500 },
//       )
//     }

//     // Step 3: Save booking to memory database BEFORE sending emails
//     let savedBooking
//     try {
//       const { memoryDB } = await import("@/lib/memory-db")
//       savedBooking = memoryDB.addBooking({
//         name: bookingData.name,
//         email: bookingData.email,
//         phone: bookingData.phone,
//         service: bookingData.service,
//         date: bookingData.date,
//         time: bookingData.time,
//         timezone: bookingData.timezone,
//         status: "confirmed",
//         meetingId: meetingData.id,
//         meetingUrl: meetingData.join_url,
//       })
//       console.log("Booking saved to memory database:", savedBooking.id)
//     } catch (error) {
//       console.error("Failed to save to memory database:", error)
//       // Continue with email sending even if memory save fails
//     }

//     // Step 4: Send notification email to admin
//     const adminMailOptions = {
//       from: {
//         name: "JAGADGURU Booking System",
//         address: process.env.EMAIL_FROM || process.env.EMAIL_USER,
//       },
//       to: process.env.EMAIL_USER,
//       subject: `🆕 New Booking: ${bookingData.name} - ${bookingData.service}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #f59e0b;">New Booking Request</h2>
//           <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
//             <p><strong>👤 Name:</strong> ${bookingData.name}</p>
//             <p><strong>✉️ Email:</strong> ${bookingData.email}</p>
//             <p><strong>📞 Phone:</strong> ${bookingData.phone}</p>
//             <p><strong>🔧 Service:</strong> ${bookingData.service}</p>
//             <p><strong>📅 Date:</strong> ${new Date(bookingData.date).toLocaleDateString()}</p>
//             <p><strong>⏰ Time:</strong> ${bookingData.time}</p>
//             <p><strong>🌍 Timezone:</strong> ${bookingData.timezone}</p>
//             <p><strong>💰 Price:</strong> ${bookingData.price} (${bookingData.currency})</p>
//             <p><strong>⏱️ Duration:</strong> ${bookingData.duration} minutes</p>
//             ${bookingData.notes ? `<p><strong>📝 Notes:</strong> ${bookingData.notes}</p>` : ""}
//             ${savedBooking ? `<p><strong>🆔 Booking ID:</strong> ${savedBooking.id}</p>` : ""}
//           </div>
//           <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-top: 15px;">
//             <h3 style="color: #1976d2;">🎥 Zoom Meeting Details</h3>
//             <p><strong>Meeting ID:</strong> ${meetingData.id}</p>
//             <p><strong>Password:</strong> ${meetingData.password}</p>
//             <p><strong>Host URL:</strong> <a href="${meetingData.start_url}">Start Meeting</a></p>
//             <p><strong>Join URL:</strong> <a href="${meetingData.join_url}">Join Meeting</a></p>
//           </div>
//         </div>
//       `,
//     }

//     // Step 5: Send confirmation email to customer
//     const customerEmailHtml = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="utf-8">
//         <title>Booking Confirmation - JAGADGURU</title>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
//           .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
//           .content { padding: 30px; border: 1px solid #ddd; border-radius: 0 0 12px 12px; }
//           .meeting-details { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
//           .zoom-details { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1976d2; }
//           .button { display: inline-block; background: #1976d2; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 10px 5px; font-weight: bold; }
//           .button:hover { background: #1565c0; }
//           .important { background: #fff3cd; padding: 15px; border-radius: 8px; border: 1px solid #ffeaa7; margin: 20px 0; }
//           .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
//         </style>
//       </head>
//       <body>
//         <div class="header">
//           <h1>🎉 Booking Confirmed!</h1>
//           <p>Your consultation with JAGADGURU has been scheduled</p>
//         </div>
//         <div class="content">
//           <h2>Hello ${bookingData.name},</h2>
//           <p>Thank you for booking a consultation with us! Your Zoom meeting has been created and is ready.</p>
          
//           <div class="meeting-details">
//             <h3>📅 Appointment Details</h3>
//             <p><strong>Service:</strong> ${bookingData.service}</p>
//             <p><strong>Date:</strong> ${new Date(bookingData.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
//             <p><strong>Time:</strong> ${bookingData.time} (${bookingData.timezone})</p>
//             <p><strong>Duration:</strong> ${bookingData.duration} minutes</p>
//             <p><strong>Price:</strong> ${bookingData.price} (${bookingData.currency})</p>
//             ${savedBooking ? `<p><strong>Booking Reference:</strong> ${savedBooking.id}</p>` : ""}
//           </div>

//           <div class="zoom-details">
//             <h3>🎥 Zoom Meeting Information</h3>
//             <p><strong>Meeting ID:</strong> ${meetingData.id}</p>
//             <p><strong>Password:</strong> ${meetingData.password}</p>
//             <p><strong>Topic:</strong> ${meetingData.topic}</p>
            
//             <div style="text-align: center; margin: 20px 0;">
//               <a href="${meetingData.join_url}" class="button">🎥 Join Zoom Meeting</a>
//             </div>
            
//             <p style="font-size: 12px; color: #666;">
//               <strong>Join by phone:</strong><br>
//               Dial: +1 346 248 7799<br>
//               Meeting ID: ${meetingData.id}<br>
//               Password: ${meetingData.password}
//             </p>
//           </div>

//           <div class="important">
//             <h4>📋 Important Instructions:</h4>
//             <ul>
//               <li><strong>Join 5 minutes early</strong> - The meeting has a waiting room enabled</li>
//               <li><strong>Test your audio/video</strong> beforehand at <a href="https://zoom.us/test">zoom.us/test</a></li>
//               <li><strong>Have a stable internet connection</strong></li>
//               <li><strong>Find a quiet, well-lit space</strong> for the best experience</li>
//               <li><strong>To reschedule:</strong> Contact us at least 24 hours in advance</li>
//             </ul>
//           </div>

//           <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
//             <h4>Need Help?</h4>
//             <p>If you have any questions or technical issues, please contact us:</p>
//             <p>📧 Email: ${process.env.EMAIL_USER}</p>
//           </div>

//           <p style="margin-top: 30px;">We look forward to speaking with you!</p>
//           <p><strong>Best regards,<br>The JAGADGURU Team</strong></p>
//         </div>
//         <div class="footer">
//           <p>This is an automated confirmation. Please save this email for your records.</p>
//           <p>© ${new Date().getFullYear()} JAGADGURU. All rights reserved.</p>
//         </div>
//       </body>
//       </html>
//     `

//     const customerMailOptions = {
//       from: {
//         name: "JAGADGURU",
//         address: process.env.EMAIL_FROM || process.env.EMAIL_USER,
//       },
//       to: bookingData.email,
//       subject: `✅ Meeting Confirmed: ${bookingData.service} on ${new Date(bookingData.date).toLocaleDateString()}`,
//       html: customerEmailHtml,
//     }

//     // Step 6: Send both emails
//     console.log("Sending confirmation emails...")
//     const [adminResult, customerResult] = await Promise.all([
//       transporter.sendMail(adminMailOptions),
//       transporter.sendMail(customerMailOptions),
//     ])

//     console.log("All emails sent successfully")

//     // Step 7: Return success response
//     return NextResponse.json({
//       success: true,
//       message: "Booking created successfully",
//       booking: {
//         id: savedBooking?.id || `booking-${Date.now()}`,
//         ...bookingData,
//         status: "confirmed",
//         created_at: new Date().toISOString(),
//       },
//       meeting: {
//         id: meetingData.id,
//         join_url: meetingData.join_url,
//         password: meetingData.password,
//         start_time: meetingData.start_time,
//       },
//       emails: {
//         admin_sent: !!adminResult.messageId,
//         customer_sent: !!customerResult.messageId,
//       },
//       memoryDB: {
//         saved: !!savedBooking,
//         bookingId: savedBooking?.id,
//       },
//     })
//   } catch (error: any) {
//     console.error("Booking process failed:", error)
//     return NextResponse.json(
//       {
//         success: false,
//         error: "Booking failed",
//         message: error.message || "An unexpected error occurred",
//         details: "Please try again or contact support if the issue persists",
//       },
//       { status: 500 },
//     )
//   }
// }
