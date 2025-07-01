// app/api/check-version/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: "This is the working version without retry logic",
    timestamp: new Date().toISOString(),
    version: "working-e09293a"
  });
}