// import nodemailer from "nodemailer"

// interface BookingDetails {
//   id: string
//   userName: string
//   userEmail: string
//   service: string
//   date: string
//   time: string
//   price: string
//   currency: string
//   meetingLink: string
//   duration: string
// }

// export class EmailService {
//   private static transporter = nodemailer.createTransporter({
//     // Option 1: Gmail SMTP
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER, // your-email@gmail.com
//       pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password
//     },

//   static async sendBookingConfirmation(booking: BookingDetails) {
//     try {
//       // User confirmation email
//       const userEmailOptions = {
//         from: {
//           name: "JAGADGURU",
//           address: process.env.EMAIL_FROM || "noreply@jagadguru.com",
//         },
//         to: booking.userEmail,
//         subject: `✅ Booking Confirmed - ${booking.service}`,
//         html: this.getUserConfirmationTemplate(booking),
//       }

//       // Host notification email
//       const hostEmailOptions = {
//         from: {
//           name: "JAGADGURU Booking System",
//           address: process.env.EMAIL_FROM || "noreply@jagadguru.com",
//         },
//         to: process.env.HOST_EMAIL || "admin@jagadguru.com", // Your email
//         subject: `🔔 New Booking Alert - ${booking.service}`,
//         html: this.getHostNotificationTemplate(booking),
//       }

//       // Send both emails
//       const userResult = await this.transporter.sendMail(userEmailOptions)
//       const hostResult = await this.transporter.sendMail(hostEmailOptions)

//       console.log("User email sent:", userResult.messageId)
//       console.log("Host email sent:", hostResult.messageId)

//       return { success: true, userMessageId: userResult.messageId, hostMessageId: hostResult.messageId }
//     } catch (error) {
//       console.error("Email sending failed:", error)
//       return { success: false, error: error.message }
//     }
//   }

//   static async sendReminder(booking: BookingDetails) {
//     try {
//       const reminderOptions = {
//         from: {
//           name: "JAGADGURU",
//           address: process.env.EMAIL_FROM || "noreply@jagadguru.com",
//         },
//         to: booking.userEmail,
//         subject: `⏰ Meeting Reminder - ${booking.service} in 1 hour`,
//         html: this.getReminderTemplate(booking),
//       }

//       const result = await this.transporter.sendMail(reminderOptions)
//       console.log("Reminder email sent:", result.messageId)
//       return { success: true, messageId: result.messageId }
//     } catch (error) {
//       console.error("Reminder email failed:", error)
//       return { success: false, error: error.message }
//     }
//   }

//   private static getUserConfirmationTemplate(booking: BookingDetails): string {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="utf-8">
//         <title>Booking Confirmation - JAGADGURU</title>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
//           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//           .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
//           .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
//           .meeting-details { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; }
//           .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
//           .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>🎉 Booking Confirmed!</h1>
//             <p>Your consultation with JAGADGURU is all set</p>
//           </div>
          
//           <div class="content">
//             <h2>Hello ${booking.userName},</h2>
//             <p>Thank you for booking a consultation with us. Your payment has been processed successfully.</p>
            
//             <div class="meeting-details">
//               <h3>📅 Meeting Details</h3>
//               <p><strong>Service:</strong> ${booking.service}</p>
//               <p><strong>Date:</strong> ${booking.date}</p>
//               <p><strong>Time:</strong> ${booking.time} EST</p>
//               <p><strong>Duration:</strong> ${booking.duration}</p>
//               <p><strong>Amount Paid:</strong> ${booking.price}</p>
//               <p><strong>Booking ID:</strong> ${booking.id}</p>
//             </div>
            
//             <div style="text-align: center; margin: 30px 0;">
//               <a href="${booking.meetingLink}" class="button">🎥 Join Meeting</a>
//               <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/bookings/${booking.id}" class="button">📋 Manage Booking</a>
//             </div>
            
//             <h3>📝 What's Next?</h3>
//             <ul>
//               <li>You'll receive a calendar invite shortly</li>
//               <li>We'll send a reminder 1 hour before the meeting</li>
//               <li>Click the meeting link above to join at the scheduled time</li>
//               <li>Prepare any questions or documents you'd like to discuss</li>
//             </ul>
            
//             <h3>🔄 Need to Reschedule or Cancel?</h3>
//             <p>You can reschedule or cancel up to 24 hours before your appointment through your dashboard.</p>
            
//             <div style="background: #fee2e2; padding: 15px; border-radius: 6px; margin: 20px 0;">
//               <p><strong>⚠️ Important:</strong> Please join the meeting 5 minutes early to ensure a smooth start.</p>
//             </div>
//           </div>
          
//           <div class="footer">
//             <p>Questions? Reply to this email or contact us at ${process.env.SUPPORT_EMAIL || "support@jagadguru.com"}</p>
//             <p>© 2024 JAGADGURU. All rights reserved.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `
//   }

//   private static getHostNotificationTemplate(booking: BookingDetails): string {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="utf-8">
//         <title>New Booking - JAGADGURU</title>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
//           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//           .header { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
//           .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
//           .client-details { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
//           .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>📋 New Booking Alert</h1>
//           </div>
          
//           <div class="content">
//             <h2>New consultation booked!</h2>
            
//             <div class="client-details">
//               <h3>Client Information</h3>
//               <p><strong>Name:</strong> ${booking.userName}</p>
//               <p><strong>Email:</strong> ${booking.userEmail}</p>
//               <p><strong>Service:</strong> ${booking.service}</p>
//               <p><strong>Date & Time:</strong> ${booking.date} at ${booking.time} EST</p>
//               <p><strong>Duration:</strong> ${booking.duration}</p>
//               <p><strong>Amount:</strong> ${booking.price}</p>
//               <p><strong>Booking ID:</strong> ${booking.id}</p>
//             </div>
            
//             <div style="text-align: center; margin: 30px 0;">
//               <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/bookings/${booking.id}" class="button">View in Dashboard</a>
//               <a href="${booking.meetingLink}" class="button">Join Meeting</a>
//             </div>
//           </div>
//         </div>
//       </body>
//       </html>
//     `
//   }

//   private static getReminderTemplate(booking: BookingDetails): string {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="utf-8">
//         <title>Meeting Reminder - JAGADGURU</title>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
//           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//           .header { background: #fbbf24; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
//           .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
//           .meeting-details { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; }
//           .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>⏰ Meeting Reminder</h1>
//             <p>Your consultation starts in 1 hour!</p>
//           </div>
          
//           <div class="content">
//             <h2>Hello ${booking.userName},</h2>
//             <p>This is a friendly reminder that your consultation with JAGADGURU is starting soon.</p>
            
//             <div class="meeting-details">
//               <p><strong>Service:</strong> ${booking.service}</p>
//               <p><strong>Time:</strong> ${booking.time} EST (in 1 hour)</p>
//               <p><strong>Duration:</strong> ${booking.duration}</p>
//             </div>
            
//             <div style="text-align: center; margin: 30px 0;">
//               <a href="${booking.meetingLink}" class="button">Join Meeting Now</a>
//             </div>
            
//             <p>We recommend joining 5 minutes early to test your audio and video.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `
//   }
// }
