import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export default mongoose.model("Notification", notificationSchema)

