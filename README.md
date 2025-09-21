# 📌 Task Manager App

A full-stack task management application where users can register, log in, and manage tasks with due dates, priorities, and statuses. This project was built as part of an interview assignment.

---

## 🚀 Features

- **User Authentication** – Register and log in with JWT
- **Task Management** – Create, update, delete, and mark tasks as completed
- **Task Properties** – Title, description, due date, priority, and status
- **Filtering** – View tasks by status or priority
- **Responsive UI** – Works on desktop and mobile
- **Dashboard** – Overview of all your tasks in one place

---

## 🛠 Tech Stack & Hosting

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Auth & Security**: JWT, Bcrypt password hashing
- **UI Components**: Shadcn/UI, Lucide icons

### 🌐 Hosting & Repository

- **Live Demo**: [Vercel Deployment](https://task-management-app-t3wu-1j8u5a3vt.vercel.app/)
- **Source Code**: [GitHub Repository](https://github.com/Nisham-N-K/task-management-app)

---

### 1. Prerequisites

- Node.js **18+**
- MongoDB (local or cloud)
- npm or yarn package manager

### 2. Clone the repository

```bash
git clone https://github.com/Nisham-N-K/task-management-app.git
cd task-management-app

```
### Prerequisites  
- Node.js 18+  
- MongoDB (local or cloud)  
- npm or yarn package manager  

### Environment Variables  
Create a `.env.local` file in the root directory:  

```env
MONGODB_URI=mongodb://localhost:27017/taskmanager
# Or MongoDB Atlas:
MONGODB_URI=mongodb+srv://<username>:<password>@cluster1.mongodb.net/taskmanager?retryWrites=true&w=majority


# JWT Secret
JWT_SECRET=yourSuperSecretJWTKey

```

### 2. Install dependencies
```bash
# Using Yarn
yarn install

# Using npm
npm install

```

### 3. Start the development server

yarn dev

### 4. Open your browser
Navigate to [http://localhost:3000](http://localhost:3000) to see the app running locally.
