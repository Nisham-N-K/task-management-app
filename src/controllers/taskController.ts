import { NextApiRequest, NextApiResponse } from "next";
import Task from "../models/Task";
import { connectDB } from "../lib/mongodb";

export const createTask = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  try {
    const { title, description, createdBy, assignedTo } = req.body;
    const task = await Task.create({ title, description, createdBy, assignedTo });
    res.status(201).json({ success: true, task });
  } catch (err) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
};

export const getTasks = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  try {
    const tasks = await Task.find().populate("createdBy").populate("assignedTo");
    res.status(200).json({ success: true, tasks });
  } catch (err) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
};

export const updateTask = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  try {
    const { id } = req.query;
    const updated = await Task.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ success: true, task: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
};

export const deleteTask = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  try {
    const { id } = req.query;
    await Task.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
};
