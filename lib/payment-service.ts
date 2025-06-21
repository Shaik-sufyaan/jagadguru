// \lib\payment-service.ts

interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  client_secret: string
}

interface PaymentDetails {
  amount: number
  currency: string
  description: string
  customerEmail: string
  metadata: Record<string, string>
}

export class PaymentService {
  private static readonly STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

  static async createPaymentIntent(details: PaymentDetails): Promise<PaymentIntent> {
    // In a real implementation, you would use Stripe's API
    const mockPaymentIntent: PaymentIntent = {
      id: `pi_${Math.random().toString(36).substr(2, 24)}`,
      amount: details.amount * 100, // Stripe uses cents
      currency: details.currency.toLowerCase(),
      status: "requires_payment_method",
      client_secret: `pi_${Math.random().toString(36).substr(2, 24)}_secret_${Math.random().toString(36).substr(2, 16)}`,
    }

    console.log("Created payment intent:", mockPaymentIntent)
    return mockPaymentIntent
  }

  static async confirmPayment(paymentIntentId: string): Promise<{ success: boolean; receipt_url?: string }> {
    console.log("Confirming payment:", paymentIntentId)

    // Mock successful payment
    return {
      success: true,
      receipt_url: `https://pay.stripe.com/receipts/${paymentIntentId}`,
    }
  }

  static async refundPayment(
    paymentIntentId: string,
    amount?: number,
  ): Promise<{ success: boolean; refund_id: string }> {
    console.log("Processing refund for:", paymentIntentId, "Amount:", amount)

    return {
      success: true,
      refund_id: `re_${Math.random().toString(36).substr(2, 24)}`,
    }
  }

  static generateInvoice(booking: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice - JAGADGURU</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
          .invoice-details { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .total { background: #fef3c7; padding: 15px; border-radius: 8px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>JAGADGURU</h1>
            <p>Professional Consultation Services</p>
          </div>
          <div>
            <h2>INVOICE</h2>
            <p>Invoice #: ${booking.id}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div class="invoice-details">
          <h3>Bill To:</h3>
          <p><strong>${booking.clientName}</strong></p>
          <p>${booking.clientEmail}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Service</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Date</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Duration</th>
              <th style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${booking.service}</td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${booking.date} at ${booking.time}</td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${booking.duration}</td>
              <td style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;">${booking.price}</td>
            </tr>
          </tbody>
        </table>

        <div class="total">
          <div style="display: flex; justify-content: space-between;">
            <span>Total Amount:</span>
            <span>${booking.price}</span>
          </div>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280;">
          <p>Thank you for choosing JAGADGURU!</p>
          <p>Questions? Contact us at support@jagadguru.com</p>
        </div>
      </body>
      </html>
    `
  }
}
