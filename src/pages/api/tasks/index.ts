import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/mongodb";
import Task from "../../../models/Task";
import { authMiddleware } from "../../../middlewares/auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const userId = (req as any).user.id;

  if (req.method === "GET") {
    const tasks = await Task.find({ userId });
    return res.status(200).json(tasks);
  }

  if (req.method === "POST") {
    const { title, description, dueDate, priority } = req.body;
    const newTask = new Task({ title, description, dueDate, priority, userId });
    await newTask.save();
    return res.status(201).json(newTask);
  }

  res.status(405).end();
}

export default authMiddleware(handler);
