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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = verifyToken(request);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { title, description, dueDate, priority } = await request.json();
    await connectDB();

    const task = await Task.findOneAndUpdate(
      { _id: params.id, userId: user.userId },
      { title, description, dueDate, priority },
      { new: true }
    );

    if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 });

    return NextResponse.json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = verifyToken(request);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectDB();
    const task = await Task.findOneAndDelete({ _id: params.id, userId: user.userId });

    if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 });

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
