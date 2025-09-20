export interface User {
  _id?: string
  id: string
  name: string
  email: string
  password: string
  createdAt: string
}

export interface Task {
  _id?: string
  id: string
  userId: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  status: "pending" | "in-progress" | "completed"
  dueDate: string
  createdAt: string
}
