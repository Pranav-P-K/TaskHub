import express from "express"
import Notification from "../models/Notification.js"
import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

// Get all notifications for the current user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort("-createdAt")
    res.status(200).json(notifications)
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" })
  }
})

// Mark a notification as read
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true },
    )
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" })
    }
    res.status(200).json(notification)
  } catch (error) {
    res.status(500).json({ message: "Error updating notification" })
  }
})

export default router

