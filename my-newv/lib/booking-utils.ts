// lib/memory-db.ts
// In-memory database to prevent double bookings

interface Booking {
  id: string
  name: string
  email: string
  phone: string
  service: string
  date: string
  time: string
  timezone: string
  status: 'confirmed' | 'cancelled'
  meetingId: string
  meetingUrl: string
  createdAt: Date
}

interface TimeSlot {
  date: string
  time: string
  bookedAt: Date
  sessionId?: string
  isLocked: boolean
}

class MemoryDatabase {
  private bookings: Map<string, Booking> = new Map()
  private bookedSlots: Map<string, TimeSlot> = new Map()
  private temporaryLocks: Map<string, { sessionId: string; expiresAt: Date }> = new Map()

  // Generate unique booking ID
  private generateBookingId(): string {
    return `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Create slot key for consistent mapping
  private createSlotKey(date: Date | string, time: string): string {
    const dateStr = typeof date === 'string' ? date : date.toDateString()
    return `${dateStr}-${time}`
  }

  // Clean up expired temporary locks
  private cleanExpiredLocks(): void {
    const now = new Date()
    for (const [key, lock] of Array.from(this.temporaryLocks.entries())) {
      if (lock.expiresAt < now) {
        this.temporaryLocks.delete(key)
      }
    }
  }

  // Lock a time slot temporarily (for 10 minutes)
  lockSlotTemporarily(date: Date | string, time: string, sessionId: string): boolean {
    this.cleanExpiredLocks()
    
    const slotKey = this.createSlotKey(date, time)
    
    // Check if slot is already permanently booked
    if (this.bookedSlots.has(slotKey)) {
      return false
    }
    
    // Check if slot is temporarily locked by another session
    const existingLock = this.temporaryLocks.get(slotKey)
    if (existingLock && existingLock.sessionId !== sessionId) {
      return false
    }
    
    // Lock the slot for 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    this.temporaryLocks.set(slotKey, { sessionId, expiresAt })
    
    return true
  }

  // Release temporary lock
  releaseTemporaryLock(date: Date | string, time: string, sessionId: string): void {
    const slotKey = this.createSlotKey(date, time)
    const lock = this.temporaryLocks.get(slotKey)
    
    if (lock && lock.sessionId === sessionId) {
      this.temporaryLocks.delete(slotKey)
    }
  }

  // Check if slot is available (not booked and not locked by another session)
  isSlotAvailable(date: Date | string, time: string, sessionId?: string): boolean {
    this.cleanExpiredLocks()
    
    const slotKey = this.createSlotKey(date, time)
    
    // Check if permanently booked
    if (this.bookedSlots.has(slotKey)) {
      return false
    }
    
    // Check if temporarily locked by another session
    const lock = this.temporaryLocks.get(slotKey)
    if (lock && lock.sessionId !== sessionId) {
      return false
    }
    
    return true
  }

  // Check if slot is booked (permanently)
  isSlotBooked(date: Date | string, time: string): boolean {
    const slotKey = this.createSlotKey(date, time)
    return this.bookedSlots.has(slotKey)
  }

  // Add a confirmed booking
  addBooking(bookingData: Omit<Booking, 'id' | 'createdAt'>): Booking {
    const id = this.generateBookingId()
    const booking: Booking = {
      ...bookingData,
      id,
      createdAt: new Date(),
    }
    
    // Store the booking
    this.bookings.set(id, booking)
    
    // Mark the slot as permanently booked
    const slotKey = this.createSlotKey(bookingData.date, bookingData.time)
    this.bookedSlots.set(slotKey, {
      date: bookingData.date,
      time: bookingData.time,
      bookedAt: new Date(),
      isLocked: true,
    })
    
    // Remove any temporary lock for this slot
    this.temporaryLocks.delete(slotKey)
    
    return booking
  }

  // Get all booked slots (for frontend to display)
  getAllBookedSlots(): Record<string, TimeSlot> {
    this.cleanExpiredLocks()
    
    const allBookedSlots: Record<string, TimeSlot> = {}
    
    // Add permanently booked slots
    for (const [key, slot] of Array.from(this.bookedSlots.entries())) {
      allBookedSlots[key] = slot
    }
    
    // Add temporarily locked slots
    for (const [key, lock] of Array.from(this.temporaryLocks.entries())) {
      const [dateStr, time] = key.split('-', 2)
      allBookedSlots[key] = {
        date: dateStr,
        time: time,
        bookedAt: lock.expiresAt,
        sessionId: lock.sessionId,
        isLocked: true,
      }
    }
    
    return allBookedSlots
  }

  // Get slots that are temporarily locked
  getTemporaryLocks(): Record<string, { sessionId: string; expiresAt: Date }> {
    this.cleanExpiredLocks()
    return Object.fromEntries(this.temporaryLocks.entries())
  }

  // Get a specific booking
  getBooking(id: string): Booking | undefined {
    return this.bookings.get(id)
  }

  // Get all bookings
  getAllBookings(): Booking[] {
    return Array.from(this.bookings.values())
  }

  // Cancel a booking
  cancelBooking(id: string): boolean {
    const booking = this.bookings.get(id)
    if (!booking) return false
    
    // Mark booking as cancelled
    booking.status = 'cancelled'
    
    // Remove from booked slots to make it available again
    const slotKey = this.createSlotKey(booking.date, booking.time)
    this.bookedSlots.delete(slotKey)
    
    return true
  }

  // Get booking stats
  getStats() {
    this.cleanExpiredLocks()
    
    return {
      totalBookings: this.bookings.size,
      confirmedBookings: Array.from(this.bookings.values()).filter(b => b.status === 'confirmed').length,
      cancelledBookings: Array.from(this.bookings.values()).filter(b => b.status === 'cancelled').length,
      bookedSlots: this.bookedSlots.size,
      temporaryLocks: this.temporaryLocks.size,
    }
  }
}

// Create a singleton instance
export const memoryDB = new MemoryDatabase()

// Export for testing
export { MemoryDatabase }