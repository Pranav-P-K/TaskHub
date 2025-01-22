import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Notification from "@/models/Notification"
import { authMiddleware } from "@/lib/authMiddleware"

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

