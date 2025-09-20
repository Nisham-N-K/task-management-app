import { type NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/api/lib/mongodb";
import Task from "@/app/api/models/Task";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectDB();
    const userTasks = await Task.find({ userId: user.userId });
    return NextResponse.json({ tasks: userTasks });
  } catch (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { title, description, dueDate, priority } = await request.json();
    if (!title || !dueDate || !priority) {
      return NextResponse.json({ message: "Title, due date, and priority are required" }, { status: 400 });
    }

    await connectDB();
    const newTask = await Task.create({
      userId: user.userId,
      title,
      description,
      dueDate,
      priority,
    });

    return NextResponse.json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
