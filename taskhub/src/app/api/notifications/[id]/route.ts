import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Notification from "@/models/Notification"
import { authMiddleware } from "@/lib/authMiddleware"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const user = await authMiddleware(req)

    const notification = await Notification.findOneAndUpdate(
      { _id: params.id, user: user.id },
      { read: true },
      { new: true },
    )

    if (!notification) {
      return NextResponse.json({ message: "Notification not found" }, { status: 404 })
    }

    return NextResponse.json(notification)
  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json({ message: "Error updating notification" }, { status: 500 })
  }
}

