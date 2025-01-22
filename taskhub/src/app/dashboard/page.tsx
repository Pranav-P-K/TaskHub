"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TaskList from "@/components/TaskList"
import CreateTaskForm from "@/components/CreateTaskForm"
import NotificationList from "@/components/NotificationList"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [notifications, setNotifications] = useState([])
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    if (user) {
      fetchTasks()
      fetchNotifications()
    }
  }, [user])

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await response.json()
      setNotifications(data)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user.name}</span>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Tabs defaultValue="tasks">
            <TabsList className="mb-4">
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              {user.role === "Team Lead" && <TabsTrigger value="create-task">Create Task</TabsTrigger>}
            </TabsList>
            <TabsContent value="tasks">
              <Card>
                <CardHeader>
                  <CardTitle>Your Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <TaskList tasks={tasks} onTaskUpdate={fetchTasks} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <NotificationList notifications={notifications} onNotificationUpdate={fetchNotifications} />
                </CardContent>
              </Card>
            </TabsContent>
            {user.role === "Team Lead" && (
              <TabsContent value="create-task">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Task</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CreateTaskForm onTaskCreated={fetchTasks} />
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  )
}

