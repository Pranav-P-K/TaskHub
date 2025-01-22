import express from "express"
import Task from "../models/Task.js"
import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

// Create a new task (Team Lead only)
router.post("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "Team Lead") {
    return res.status(403).json({ message: "Only Team Leads can create tasks" })
  }
  try {
    const task = new Task({ ...req.body, createdBy: req.user.id })
    await task.save()
    res.status(201).json(task)
  } catch (error) {
    console.log("Error occurred: ", error)
    res.status(500).json({ message: "Error creating task" })
  }
})

// Get all tasks (filtered by role)
router.get("/", authMiddleware, async (req, res) => {
  try {
    let tasks
    if (req.user.role === "Team Lead") {
      tasks = await Task.find({ createdBy: req.user.id }).populate("assignedTo", "name")
    } else {
      tasks = await Task.find({ assignedTo: req.user.id }).populate("createdBy", "name")
    }
    res.status(200).json(tasks)
  } catch (error) {
    console.log("Error occurred: ", error)
    res.status(500).json({ message: "Error fetching tasks" })
  }
})

// Update a task
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }
    if (req.user.role === "Team Lead" || task.assignedTo.includes(req.user.id)) {
      const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      res.status(200).json(updatedTask)
    } else {
      res.status(403).json({ message: "Not authorized to update this task" })
    }
  } catch (error) {
    console.log("Error occurred: ", error)
    res.status(500).json({ message: "Error updating task" })
  }
})

// Add a comment to a task
router.post("/:id/comments", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }
    const comment = { user: req.user.id, text: req.body.text }
    task.comments.push(comment)
    await task.save()
    res.status(201).json(comment)
  } catch (error) {
    console.log("Error occurred: ", error)
    res.status(500).json({ message: "Error adding comment" })
  }
})

export default router

