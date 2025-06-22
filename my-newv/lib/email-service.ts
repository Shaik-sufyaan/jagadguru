// lib/email-service.ts
interface BookingDetails {
  id: string
  userName: string
  userEmail: string
  service: string
  date: string
  time: string
  price: string
  currency: string
  meetingLink: string
  duration: string
}

export class EmailService {
  static async sendBookingConfirmation(booking: BookingDetails): Promise<{ success: boolean; error?: string }> {
    // Mock implementation for now
    console.log("Sending booking confirmation to:", booking.userEmail)
    return { success: true }
  }

  static async sendReminder(booking: BookingDetails): Promise<{ success: boolean; error?: string }> {
    // Mock implementation for now
    console.log("Sending reminder to:", booking.userEmail)
    return { success: true }
  }

  static async sendCancellation(booking: BookingDetails): Promise<{ success: boolean; error?: string }> {
    // Mock implementation for now
    console.log("Sending cancellation notice to:", booking.userEmail)
    return { success: true }
  }
}