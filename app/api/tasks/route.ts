import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import Task from "@/models/Task"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) return null

  const token = authHeader.substring(7)
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    await connectDB()
    const tasks = await Task.find({ userId: user.userId }).sort({ createdAt: -1 })
    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Get tasks error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { title, description, dueDate, priority } = await request.json()
    if (!title || !dueDate || !priority) {
      return NextResponse.json({ message: "Title, due date, and priority are required" }, { status: 400 })
    }

    await connectDB()
    const task = await Task.create({
      userId: user.userId,
      title,
      description,
      dueDate,
      priority,
      status: "pending",
      createdAt: new Date(),
    })

    return NextResponse.json({ message: "Task created successfully", task })
  } catch (error) {
    console.error("Create task error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { taskId, status } = await request.json()
    if (!taskId || !status) return NextResponse.json({ message: "Invalid data" }, { status: 400 })

    await connectDB()
    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId: user.userId },
      { status },
      { new: true }
    )
    if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 })

    return NextResponse.json({ message: "Task updated", task })
  } catch (error) {
    console.error("Update task error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { taskId } = await request.json()
    if (!taskId) return NextResponse.json({ message: "Task ID required" }, { status: 400 })

    await connectDB()
    const task = await Task.findOneAndDelete({ _id: taskId, userId: user.userId })
    if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 })

    return NextResponse.json({ message: "Task deleted", task })
  } catch (error) {
    console.error("Delete task error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
