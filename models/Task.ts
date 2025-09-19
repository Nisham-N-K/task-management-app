import mongoose, { Schema, model, models } from "mongoose";

const TaskSchema = new Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    dueDate: { type: String, required: true },
    priority: { type: String, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const Task = models.Task || model("Task", TaskSchema);
export default Task;
