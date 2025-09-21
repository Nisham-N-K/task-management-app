import { connectDB } from '../../../lib/mongodb';
import { NextResponse } from 'next/server';
import User from '../../../models/User';
import Task from '../../../models/Task';

export async function GET() {
  try {
    await connectDB();
    
    const newUser = await User.create({
  id: "test-user-2",
  name: "Test User 2",
  email: "test2@example.com",
  password: "password123",
  createdAt: new Date().toISOString()
    });

    const newTask = await Task.create({
      userId: newUser.id,
      title: "Confirm database connection",
      description: "This task proves data can be saved to MongoDB.",
      dueDate: new Date().toISOString(),
      priority: "high",
      status: "pending",
    });
    
    return NextResponse.json(
      { 
        status: 'Data successfully saved to database!',
        user: newUser,
        task: newTask 
      }, 
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: 'Failed to save data', error: error.message },
      { status: 500 }
    );
  }
}