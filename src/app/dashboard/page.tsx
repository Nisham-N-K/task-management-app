// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Task {
  _id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  dueDate: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/tasks/list");
        setTasks(res.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Delete a task
  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`/api/tasks/delete?id=${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">📋 Task Dashboard</h1>

      {/* Add Task Button */}
      <div className="mb-4">
        <a
          href="/dashboard/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Add Task
        </a>
      </div>

      {/* Task List */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found. Start by adding one!</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{task.title}</h2>
                <p className="text-sm text-gray-600">{task.description}</p>
                <p className="text-sm">
                  Priority: <b>{task.priority}</b> | Due:{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={`/dashboard/edit/${task._id}`}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  ✏️ Edit
                </a>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  🗑 Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
