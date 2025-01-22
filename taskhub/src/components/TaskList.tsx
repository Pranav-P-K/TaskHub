import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface Task {
  _id: string
  title: string
  description: string
  status: string
  priority: string
  dueDate: string
  comments: { text: string; createdAt: string }[]
}

interface TaskListProps {
  tasks: Task[]
  onTaskUpdate: () => void
}

export default function TaskList({ tasks, onTaskUpdate } : TaskListProps) {
  const { toast } = useToast()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [comment, setComment] = useState("")

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        onTaskUpdate()
        toast({
          title: "Success",
          description: "Task status updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update task status",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating task status:", error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCommentSubmit = async () => {
    if (!selectedTask) {
      toast({
        title: "Error",
        description: "No task selected. Please try again.",
        variant: "destructive",
      })
      return
    }
    try {
      const response = await fetch(`/api/tasks/${selectedTask._id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text: comment }),
      })
      if (response.ok) {
        onTaskUpdate()
        setComment("")
        toast({
          title: "Success",
          description: "Comment added successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to add comment",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task._id}>
          <CardHeader>
            <CardTitle>{task.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Status: {task.status}</p>
            <p className="text-sm text-gray-500">Priority: {task.priority}</p>
            <p className="text-sm text-gray-500">Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
            <p className="mt-2">{task.description}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange(task._id, "In Progress")}
                disabled={task.status === "In Progress"}
              >
                Start
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange(task._id, "Completed")}
                disabled={task.status === "Completed"}
                className="ml-2"
              >
                Complete
              </Button>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setSelectedTask(task)}>
                  View Comments
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Task Comments</DialogTitle>
                </DialogHeader>
                <div className="max-h-[300px] overflow-y-auto space-y-4">
                  {task.comments.map((comment, index) => (
                    <div key={index} className="bg-gray-100 p-2 rounded">
                      <p className="text-sm">{comment.text}</p>
                      <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Label htmlFor="comment">Add a comment</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Type your comment here..."
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleCommentSubmit}>Add Comment</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

