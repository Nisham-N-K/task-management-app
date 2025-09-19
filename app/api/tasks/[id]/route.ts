import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// In-memory task storage (same as tasks/route.ts)
const tasks: any[] = []

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    return jwt.verify(token, JWT_SECRET) as any
  } catch (error) {
    return null
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { title, description, dueDate, priority } = await request.json()
    const taskIndex = tasks.findIndex((task) => task.id === params.id && task.userId === user.userId)

    if (taskIndex === -1) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    // Update task
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title,
      description: description || "",
      dueDate,
      priority,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      message: "Task updated successfully",
      task: tasks[taskIndex],
    })
  } catch (error) {
    console.error("Update task error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const taskIndex = tasks.findIndex((task) => task.id === params.id && task.userId === user.userId)

    if (taskIndex === -1) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    // Remove task
    tasks.splice(taskIndex, 1)

    return NextResponse.json({
      message: "Task deleted successfully",
    })
  } catch (error) {
    console.error("Delete task error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
