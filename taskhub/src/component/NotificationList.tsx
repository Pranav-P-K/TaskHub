import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function NotificationList({ notifications, onNotificationUpdate }) {
  const { toast } = useToast()

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        onNotificationUpdate()
        toast({
          title: "Success",
          description: "Notification marked as read",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to mark notification as read",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card key={notification._id}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{notification.read ? "Read" : "Unread"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{notification.message}</p>
            <p className="text-sm text-gray-500 mt-2">{new Date(notification.createdAt).toLocaleString()}</p>
            {!notification.read && (
              <Button variant="outline" size="sm" className="mt-2" onClick={() => handleMarkAsRead(notification._id)}>
                Mark as Read
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

