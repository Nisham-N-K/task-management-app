"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    axios.get("/api/tasks").then((res) => setTasks(res.data));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Tasks</h1>
      {tasks.map((task) => (
        <div key={task._id} className="p-4 border rounded mb-3">
          <h2 className="font-semibold">{task.title}</h2>
          <p>{task.description}</p>
          <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
          <p>Priority: {task.priority}</p>
        </div>
      ))}
    </div>
  );
}
