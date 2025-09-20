// app/api/test-db/route.ts

import { connectDB } from '../../../lib/mongodb';
import { NextResponse } from 'next/server';
import User from '../../../models/User'; // Import your User model
import Task from '../../../models/Task'; // Import your Task model

export async function GET() {
  try {
    // 1. Connect to the database
    await connectDB();
    
    // 2. Create and save a new User
    const newUser = await User.create({
  id: "test-user-2",
  name: "Test User 2",
  email: "test2@example.com",
  password: "password123",
  createdAt: new Date().toISOString()
    });

    // 3. Create and save a new Task, linked to the new user
    const newTask = await Task.create({
      userId: newUser.id,
      title: "Confirm database connection",
      description: "This task proves data can be saved to MongoDB.",
      dueDate: new Date().toISOString(),
      priority: "high",
      status: "pending",
    });
    
    // 4. Return a success message
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