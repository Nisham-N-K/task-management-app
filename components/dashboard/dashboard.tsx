"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TaskForm } from "./task-form"
import { TaskFilters } from "./task-filters"
import { Plus, LogOut, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  priority: "low" | "medium" | "high"
  status: "pending" | "completed"
  createdAt: string
}

interface DashboardProps {
  user: any
  onLogout: () => void
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    search: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks)
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    }
  }

  const handleCreateTask = async (taskData: Omit<Task, "id" | "createdAt" | "status">) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      })

      if (response.ok) {
        const data = await response.json()
        setTasks([...tasks, data.task])
        setShowTaskForm(false)
        toast({
          title: "Success",
          description: "Task created successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      })
    }
  }

  const handleUpdateTask = async (taskData: Omit<Task, "id" | "createdAt" | "status">) => {
    if (!editingTask) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      })

      if (response.ok) {
        const data = await response.json()
        setTasks(tasks.map((task) => (task.id === editingTask.id ? data.task : task)))
        setEditingTask(null)
        setShowTaskForm(false)
        toast({
          title: "Success",
          description: "Task updated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId))
        toast({
          title: "Success",
          description: "Task deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: task.status === "completed" ? "pending" : "completed",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setTasks(tasks.map((t) => (t.id === taskId ? data.task : t)))
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      })
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filters.status !== "all" && task.status !== filters.status) return false
    if (filters.priority !== "all" && task.priority !== filters.priority) return false
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    pending: tasks.filter((t) => t.status === "pending").length,
    overdue: tasks.filter((t) => t.status === "pending" && new Date(t.dueDate) < new Date()).length,
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">TaskFlow</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">Welcome back, {user.name}</p>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Overdue</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.overdue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions and Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Button onClick={() => setShowTaskForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
          <TaskFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Task Form Modal */}
        {(showTaskForm || editingTask) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <TaskForm
                task={editingTask}
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                onCancel={() => {
                  setShowTaskForm(false)
                  setEditingTask(null)
                }}
              />
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No tasks found. Create your first task to get started!
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card
                key={task.id}
                className={`transition-all hover:shadow-md ${task.status === "completed" ? "opacity-75" : ""}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(task.id)}
                          className="p-0 h-auto"
                        >
                          <CheckCircle
                            className={`h-5 w-5 ${task.status === "completed" ? "text-green-600" : "text-gray-400"}`}
                          />
                        </Button>
                        <h3
                          className={`font-semibold ${task.status === "completed" ? "line-through text-gray-500" : "text-gray-900 dark:text-white"}`}
                        >
                          {task.title}
                        </h3>
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">{task.description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingTask(task)
                          setShowTaskForm(true)
                        }}
                      >
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteTask(task.id)}>
                        Delete
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
