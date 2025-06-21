interface CalendarEvent {
  title: string
  description: string
  startTime: string
  endTime: string
  attendees: string[]
  meetingLink: string
}

export class CalendarService {
  static generateGoogleCalendarLink(event: CalendarEvent): string {
    const startDate = new Date(event.startTime).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    const endDate = new Date(event.endTime).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.title,
      dates: `${startDate}/${endDate}`,
      details: `${event.description}\n\nJoin meeting: ${event.meetingLink}`,
      location: event.meetingLink,
      add: event.attendees.join(","),
    })

    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }

  static generateOutlookCalendarLink(event: CalendarEvent): string {
    const params = new URLSearchParams({
      subject: event.title,
      startdt: event.startTime,
      enddt: event.endTime,
      body: `${event.description}\n\nJoin meeting: ${event.meetingLink}`,
      location: event.meetingLink,
    })

    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
  }

  static generateICSFile(event: CalendarEvent): string {
    const startDate = new Date(event.startTime).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    const endDate = new Date(event.endTime).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//JAGADGURU//Booking System//EN
BEGIN:VEVENT
UID:${Date.now()}@jagadguru.com
DTSTAMP:${now}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${event.title}
DESCRIPTION:${event.description}\\n\\nJoin meeting: ${event.meetingLink}
LOCATION:${event.meetingLink}
ATTENDEE:MAILTO:${event.attendees.join(";MAILTO:")}
BEGIN:VALARM
TRIGGER:-PT1H
ACTION:EMAIL
DESCRIPTION:Meeting reminder
END:VALARM
END:VEVENT
END:VCALENDAR`
  }
}
