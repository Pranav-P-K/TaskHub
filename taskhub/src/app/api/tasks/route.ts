import { NextResponse } from "next/server"
import { connectToDatabase } from "@/server/db"
import Task from "@/server/models/Task"
import { authMiddleware } from "@/server/middleware/auth"

export async function GET(req: Request) {
  try {
    await connectToDatabase()
    const user = await authMiddleware(req)

    let tasks
    if (user.role === "Team Lead") {
      tasks = await Task.find({ createdBy: user.id }).populate("assignedTo", "name")
    } else {
      tasks = await Task.find({ assignedTo: user.id }).populate("createdBy", "name")
    }

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ message: "Error fetching tasks" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const user = await authMiddleware(req)

    if (user.role !== "Team Lead") {
      return NextResponse.json({ message: "Only Team Leads can create tasks" }, { status: 403 })
    }

    const taskData = await req.json()
    const task = new Task({ ...taskData, createdBy: user.id })
    await task.save()

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ message: "Error creating task" }, { status: 500 })
  }
}

