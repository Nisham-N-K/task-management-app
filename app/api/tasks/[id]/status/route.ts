import { type NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    return jwt.verify(authHeader.substring(7), JWT_SECRET) as any;
  } catch {
    return null;
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = verifyToken(request);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { status } = await request.json();
    if (!status) return NextResponse.json({ message: "Status is required" }, { status: 400 });

    await connectDB();
    const task = await Task.findOneAndUpdate(
      { _id: params.id, userId: user.userId },
      { status },
      { new: true }
    );

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task status updated successfully", task });
  } catch (error) {
    console.error("Update task status error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
