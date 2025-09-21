"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed";
  dueDate: string;
  createdAt: string;
  userId: string;
}

export default function CreateTaskPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      router.push("/auth/login");
      return;
    }

    const userData = JSON.parse(currentUser);
    setUser(userData);

    if (editId) {
      const allTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      const taskToEdit = allTasks.find(
        (task: Task) => task.id === editId && task.userId === userData.id
      );

      if (taskToEdit) {
        setEditingTask(taskToEdit);
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description);
        setPriority(taskToEdit.priority);
        setDueDate(taskToEdit.dueDate.split("T")[0]);
      }
    }
  }, [router, editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!title.trim()) {
        setError("Task title is required");
        return;
      }

      if (!dueDate) {
        setError("Due date is required");
        return;
      }

      const allTasks = JSON.parse(localStorage.getItem("tasks") || "[]");

      if (editingTask) {
        const updatedTasks = allTasks.map((task: Task) =>
          task.id === editingTask.id
            ? {
                ...task,
                title: title.trim(),
                description: description.trim(),
                priority,
                dueDate: new Date(dueDate).toISOString(),
              }
            : task
        );
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      } else {
        const newTask: Task = {
          id: Date.now().toString(),
          title: title.trim(),
          description: description.trim(),
          priority,
          status: "pending",
          dueDate: new Date(dueDate).toISOString(),
          createdAt: new Date().toISOString(),
          userId: user.id,
        };

        allTasks.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(allTasks));
      }

      router.push("/tasks");
    } catch (err) {
      setError("Failed to save task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href="/tasks"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tasks
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {editingTask ? "Edit Task" : "Create New Task"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter task description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={priority}
                    onValueChange={(value: "low" | "medium" | "high") =>
                      setPriority(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading
                    ? editingTask
                      ? "Updating..."
                      : "Creating..."
                    : editingTask
                    ? "Update Task"
                    : "Create Task"}
                </Button>
                <Link href="/tasks">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
