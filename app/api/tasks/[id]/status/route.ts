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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { status } = await request.json()
    const taskIndex = tasks.findIndex((task) => task.id === params.id && task.userId === user.userId)

    if (taskIndex === -1) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    // Update task status
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      status,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      message: "Task status updated successfully",
      task: tasks[taskIndex],
    })
  } catch (error) {
    console.error("Update task status error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
