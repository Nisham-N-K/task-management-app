import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <img
        src="/placeholder-logo.svg"
        alt="Logo"
        className="w-32 h-32 mb-8"
      />

      <h1 className="text-5xl font-bold text-gray-800 mb-6">
        Welcome to Task Manager
      </h1>

      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        Organize your tasks, manage priorities, and boost your productivity with our simple and intuitive Task Manager App.
      </p>

      <div className="flex space-x-6">
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
        >
          Register
        </Link>
      </div>
    </main>
  );
}
