export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  isRead: boolean
  readAt: string | null
  createdAt: string
  updatedAt: string
}
