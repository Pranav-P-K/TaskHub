import { NextResponse } from "next/server"
import { connectToDatabase } from "@/server/db"
import Task from "@/server/models/Task"
import { authMiddleware } from "@/server/middleware/auth"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const user = await authMiddleware(req)

    const task = await Task.findById(params.id)
    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    if (user.role === "Team Lead" || task.assignedTo.includes(user.id)) {
      const updatedData = await req.json()
      const updatedTask = await Task.findByIdAndUpdate(params.id, updatedData, { new: true })
      return NextResponse.json(updatedTask)
    } else {
      return NextResponse.json({ message: "Not authorized to update this task" }, { status: 403 })
    }
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ message: "Error updating task" }, { status: 500 })
  }
}

