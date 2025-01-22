import { NextResponse } from "next/server"
import { connectToDatabase } from "@/server/db"
import Task from "@/server/models/Task"
import { authMiddleware } from "@/server/middleware/auth"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const user = await authMiddleware(req)

    const task = await Task.findById(params.id)
    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    const { text } = await req.json()
    const comment = { user: user.id, text }
    task.comments.push(comment)
    await task.save()

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ message: "Error adding comment" }, { status: 500 })
  }
}

