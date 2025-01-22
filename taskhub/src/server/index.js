import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"
import taskRoutes from "./routes/tasks.js"
import notificationRoutes from "./routes/notifications.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors())

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error))

app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/notifications", notificationRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

