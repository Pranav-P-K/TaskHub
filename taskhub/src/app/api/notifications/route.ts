import { NextResponse } from "next/server"
import { connectToDatabase } from "@/server/db"
import Notification from "@/server/models/Notification"
import { authMiddleware } from "@/server/middleware/auth"

export async function GET(req: Request) {
  try {
    await connectToDatabase()
    const user = await authMiddleware(req)

    const notifications = await Notification.find({ user: user.id }).sort("-createdAt")
    return NextResponse.json(notifications)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ message: "Error fetching notifications" }, { status: 500 })
  }
}

