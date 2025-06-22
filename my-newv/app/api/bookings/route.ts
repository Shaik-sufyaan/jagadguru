import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // For now, just return success - you can add Stripe later
    return NextResponse.json({ 
      message: 'Booking endpoint working',
      received: body 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' }, 
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Booking API is working' });
}