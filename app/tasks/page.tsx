"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, LogOut, Edit, Trash2 } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  status: "pending" | "completed"
  dueDate: string
  createdAt: string
  userId: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/auth/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Load tasks
    const allTasks = JSON.parse(localStorage.getItem("tasks") || "[]")
    const userTasks = allTasks.filter((task: Task) => task.userId === userData.id)
    setTasks(userTasks)
    setFilteredTasks(userTasks)
  }, [router])

  useEffect(() => {
    // Filter tasks
    let filtered = tasks

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter)
    }

    setFilteredTasks(filtered)
  }, [tasks, searchTerm, statusFilter, priorityFilter])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/auth/login")
  }

  const toggleTaskStatus = (taskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: task.status === "pending" ? "completed" : "pending" } : task,
    )
    setTasks(updatedTasks)

    // Update localStorage
    const allTasks = JSON.parse(localStorage.getItem("tasks") || "[]")
    const updatedAllTasks = allTasks.map((task: Task) =>
      task.id === taskId ? { ...task, status: task.status === "pending" ? "completed" : "pending" } : task,
    )
    localStorage.setItem("tasks", JSON.stringify(updatedAllTasks))
  }

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    setTasks(updatedTasks)

    // Update localStorage
    const allTasks = JSON.parse(localStorage.getItem("tasks") || "[]")
    const updatedAllTasks = allTasks.filter((task: Task) => task.id !== taskId)
    localStorage.setItem("tasks", JSON.stringify(updatedAllTasks))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
<div className="shadow-sm border-b">
  <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center py-2 sm:py-3 flex-nowrap">
      
      {/* Left side */}
      <div className="min-w-0">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
          Task Manager
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 truncate">
          Welcome back, {user.name}
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <Link href="/tasks/create">
          <Button className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            New Task
          </Button>
        </Link>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 bg-transparent"
        >
          <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Logout
        </Button>
      </div>
    </div>
  </div>
</div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {tasks.filter((t) => t.status === "completed").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {tasks.filter((t) => t.status === "pending").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No tasks found</p>
                  <Link href="/tasks/create">
                    <Button>Create Your First Task</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Checkbox
                        checked={task.status === "completed"}
                        onCheckedChange={() => toggleTaskStatus(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h3
                          className={`font-medium ${task.status === "completed" ? "line-through text-gray-500" : "text-gray-900"}`}
                        >
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                          <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                          <span className="text-xs text-gray-500">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="items-center gap-2">
                      <Link href={`/tasks/create?edit=${task.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
