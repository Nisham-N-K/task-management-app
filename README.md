# Task Manager App

A comprehensive full-stack task management application built with modern web technologies. Features user authentication, task CRUD operations, filtering capabilities, and a responsive UI with dark mode support.

## 🚀 Features

### Core Functionality
- **User Authentication** - JWT-based registration and login system
- **Task Management** - Complete CRUD operations for tasks
- **Task Properties** - Title, description, due dates, priority levels (low/medium/high)
- **Status Tracking** - Pending, in-progress, and completed task states
- **Advanced Filtering** - Filter by status, priority, and search functionality
- **Statistics Dashboard** - Real-time task statistics and progress tracking

### User Experience
- **Responsive Design** - Mobile-first approach with responsive layouts
- **Dark Mode Support** - Complete light/dark theme implementation
- **Modern UI** - Clean, professional interface with smooth animations
- **Loading States** - Enhanced UX with loading indicators
- **Toast Notifications** - Real-time feedback for user actions
- **Modal Forms** - Intuitive task creation and editing

## 🛠 Tech Stack

### Frontend
- **Next.js 15.5.3** - React framework with App Router
- **React 19.1.1** - Latest React with concurrent features
- **TypeScript 5.9.2** - Type-safe development
- **Tailwind CSS 4.1.9** - Utility-first CSS framework
- **tailwindcss-animate 1.0.7** - Animation utilities

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **MongoDB 6.3.0** - NoSQL database for data persistence
- **Mongoose 8.0.3** - MongoDB object modeling
- **jsonwebtoken 9.0.2** - JWT authentication

### UI Components & Libraries
- **shadcn/ui** - Complete component library (50+ components)
- **Lucide React 0.544.0** - Modern icon library
- **class-variance-authority 0.7.1** - Component variant management
- **clsx 2.1.1** - Conditional className utility
- **tailwind-merge 3.3.1** - Tailwind class merging

## 📁 Project Structure

\`\`\`
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   │   ├── login/     # POST /api/auth/login
│   │   │   └── register/  # POST /api/auth/register
│   │   └── tasks/         # Task management endpoints
│   │       ├── route.ts   # GET/POST /api/tasks
│   │       └── [id]/      # Task-specific operations
│   │           ├── route.ts        # PUT/DELETE /api/tasks/[id]
│   │           └── status/route.ts # PATCH /api/tasks/[id]/status
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── tasks/             # Task management pages
│   │   ├── page.tsx       # Task list dashboard
│   │   ├── loading.tsx    # Loading state
│   │   └── create/        # Task creation page
│   ├── layout.tsx         # Root layout with fonts
│   ├── page.tsx           # Home page with auth redirect
│   └── globals.css        # Global styles and Tailwind config
├── components/            # React components
│   ├── auth/              # Authentication components
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── dashboard/         # Dashboard components
│   │   ├── dashboard.tsx  # Main dashboard
│   │   ├── task-form.tsx  # Task creation/editing form
│   │   └── task-filters.tsx # Task filtering controls
│   ├── task-manager.tsx   # Main app component
│   └── ui/                # UI component library (50+ components)
│       ├── button.tsx     # Button variants
│       ├── card.tsx       # Card layouts
│       ├── input.tsx      # Form inputs
│       ├── select.tsx     # Dropdown selects
│       ├── badge.tsx      # Status badges
│       ├── toast.tsx      # Notification system
│       └── ... (47 more components)
├── lib/                   # Utilities and configurations
│   ├── models.ts          # TypeScript interfaces
│   ├── mongodb.ts         # Database connection
│   └── utils.ts           # Utility functions
├── hooks/                 # Custom React hooks
│   ├── use-toast.ts       # Toast notification hook
│   └── use-mobile.tsx     # Mobile detection hook
└── package.json           # Dependencies and scripts
\`\`\`

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB database (local or cloud)
- npm or yarn package manager

### Environment Variables
Create a `.env.local` file in the root directory:

\`\`\`env
MONGODB_URI=mongodb://localhost:27017/taskmanager
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/taskmanager

JWT_SECRET=your-super-secret-jwt-key-here
\`\`\`

### Installation Steps

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd task-manager-app
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. **Set up environment variables**
\`\`\`bash
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and JWT secret
\`\`\`

4. **Start the development server**
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

5. **Open your browser**
Navigate to `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
\`\`\`

**Response:**
\`\`\`json
{
  "message": "User registered successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
\`\`\`

#### POST `/api/auth/login`
Authenticate user and get access token.

**Request Body:**
\`\`\`json
{
  "email": "john@example.com",
  "password": "securepassword"
}
\`\`\`

**Response:**
\`\`\`json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
\`\`\`

### Task Management Endpoints

All task endpoints require authentication via `Authorization: Bearer <token>` header.

#### GET `/api/tasks`
Retrieve all tasks for the authenticated user.

**Response:**
\`\`\`json
{
  "tasks": [
    {
      "id": "task-id",
      "userId": "user-id",
      "title": "Complete project",
      "description": "Finish the task manager app",
      "priority": "high",
      "status": "pending",
      "dueDate": "2024-12-31",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
\`\`\`

#### POST `/api/tasks`
Create a new task.

**Request Body:**
\`\`\`json
{
  "title": "New Task",
  "description": "Task description",
  "priority": "medium",
  "dueDate": "2024-12-31"
}
\`\`\`

#### PUT `/api/tasks/[id]`
Update an existing task.

**Request Body:**
\`\`\`json
{
  "title": "Updated Task",
  "description": "Updated description",
  "priority": "high",
  "dueDate": "2024-12-31"
}
\`\`\`

#### DELETE `/api/tasks/[id]`
Delete a task.

**Response:**
\`\`\`json
{
  "message": "Task deleted successfully"
}
\`\`\`

#### PATCH `/api/tasks/[id]/status`
Update task status.

**Request Body:**
\`\`\`json
{
  "status": "completed"
}
\`\`\`

## 🎨 UI Components Library

The app includes a comprehensive UI component library with 50+ components:

### Form Components
- **Button** - Multiple variants (default, destructive, outline, secondary, ghost, link)
- **Input** - Text inputs with validation states
- **Textarea** - Multi-line text inputs
- **Select** - Dropdown selection with search
- **Checkbox** - Boolean input controls
- **Radio Group** - Single selection from options
- **Label** - Form field labels

### Layout Components
- **Card** - Content containers with header/content/footer
- **Sheet** - Slide-out panels
- **Dialog** - Modal dialogs
- **Drawer** - Mobile-friendly drawers
- **Tabs** - Tabbed content organization
- **Accordion** - Collapsible content sections
- **Separator** - Visual content dividers

### Navigation Components
- **Breadcrumb** - Navigation hierarchy
- **Navigation Menu** - Main navigation
- **Menubar** - Menu bar with dropdowns
- **Pagination** - Page navigation controls

### Feedback Components
- **Alert** - Status messages and notifications
- **Toast** - Temporary notification system
- **Progress** - Progress indicators
- **Skeleton** - Loading state placeholders

### Data Display Components
- **Table** - Data tables with sorting
- **Badge** - Status and category indicators
- **Avatar** - User profile images
- **Calendar** - Date selection
- **Chart** - Data visualization

### Overlay Components
- **Popover** - Contextual overlays
- **Tooltip** - Hover information
- **Hover Card** - Rich hover content
- **Context Menu** - Right-click menus

### Advanced Components
- **Command** - Command palette interface
- **Carousel** - Image/content sliders
- **Resizable** - Resizable panels
- **Sidebar** - Collapsible navigation

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt password encryption
- **Input Validation** - Server-side request validation
- **CORS Protection** - Cross-origin request security
- **Environment Variables** - Secure configuration management

## 🎯 Performance Optimizations

- **Next.js App Router** - Modern routing with server components
- **Code Splitting** - Automatic bundle optimization
- **Image Optimization** - Next.js image optimization
- **Static Generation** - Pre-rendered pages where possible
- **API Route Optimization** - Efficient database queries

## 📱 Mobile Responsiveness

- **Mobile-First Design** - Optimized for mobile devices
- **Responsive Grid** - Adaptive layouts for all screen sizes
- **Touch-Friendly** - Optimized touch targets
- **Progressive Web App** - PWA-ready architecture

## 🧪 Development

### Available Scripts
\`\`\`bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
\`\`\`

### Code Quality
- **TypeScript** - Full type safety
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality checks

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API endpoints

---

**Built with ❤️ using Next.js, React, TypeScript, and MongoDB**
