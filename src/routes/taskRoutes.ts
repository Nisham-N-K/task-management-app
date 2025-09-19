import express from "express";
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/taskController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// CRUD routes
router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

export default router;
