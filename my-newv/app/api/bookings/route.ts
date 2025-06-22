// import { db } from "@/lib/firebase-admin"
// import { NextRequest } from "next/server"

// export async function GET(request: NextRequest) {
//   const date = request.nextUrl.searchParams.get('date')
  
//   if (!date) {
//     return new Response(JSON.stringify({ error: "Date parameter required" }), {
//       status: 400
//     })
//   }

//   try {
//     const snapshot = await db.collection("bookings")
//       .where("date", "==", date)
//       .get()

//     const bookedSlots = snapshot.docs.map(doc => doc.data().time)
    
//     return new Response(JSON.stringify({ bookedSlots }), {
//       status: 200
//     })
//   } catch (error) {
//     console.error("Error fetching bookings:", error)
//     return new Response(JSON.stringify({ error: "Database error" }), {
//       status: 500
//     })
//   }
// }