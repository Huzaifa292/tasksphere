# TASKSPHERE — Premium Project Management & Team Collaboration SaaS

> **PLAN SMARTER. WORK BETTER. ACHIEVE MORE.**

**TASKSPHERE** is an enterprise-grade, fully interactive Project Management and Team Collaboration SaaS platform built with React, Vite, Tailwind CSS, Framer Motion, Zustand, Recharts, and @dnd-kit. Designed with a distinctive Midnight Navy, Deep Indigo, and Electric Violet visual identity, it provides a centralized workspace for cross-functional agile software teams, startups, agencies, and enterprise organizations.

---

## 🌟 Key Modules & Features

### 1. Workspace Dashboard (`/dashboard`)
- **Executive KPI Cards**: Real-time counts of Total Projects, Active Projects, Completed Tasks, Pending & Overdue items, and Total Hours Tracked.
- **Sprint Productivity & Velocity**: Interactive Recharts area chart contrasting planned vs completed tasks.
- **Pipeline Breakdown**: Donut chart displaying tasks across Backlog, To Do, In Progress, In Review, and Done.
- **Project Delivery Health**: Dynamic progress bar chart calculated from real task completions.
- **Focus Widgets**: Quick-action widgets for personal focus tasks, upcoming deadlines, and live audit activity.

### 2. Strategic Projects Portfolio (`/projects`, `/projects/:id`)
- **Grid & List Views**: Instant toggle between visual cover cards and high-density tabular rows.
- **Multi-Filter & Sorting Engine**: Filter by status (*Planning, Active, On Hold, Completed, Archived*), priority (*Critical, High, Medium, Low*), or assigned team members.
- **Project Detail Hub**: Dynamic calculation of completion progress %, milestone roadmaps, project task list, files/assets repository, and audit trail.
- **Complete CRUD Operations**: Create new initiatives, edit parameters, duplicate, archive, and delete with cascading task safety.

### 3. Task Management & Interactive Kanban Board (`/tasks`, `/board`)
- **High-Density Task Table**: Tabs for *All Tasks, Assigned to Me, Created by Me, Completed, Overdue*.
- **Interactive Drag & Drop Kanban**: Drag cards between *Backlog, To Do, In Progress, In Review, and Done* powered by `@dnd-kit` with optimistic updates, persistent column counts, and celebration confetti on completion!
- **Task Detail Modal**: Manage checklist subtasks, post comments with timestamp history, update assignees, tags, and due dates.

### 4. Personal Productivity Hub (`/my-work`)
- Dedicated focus screen for the logged-in contributor.
- Metric indicators for personal completion rate, active work items, hours tracked, and overdue items.
- 1-click task status toggling and quick creation.

### 5. Interactive Calendar (`/calendar`)
- **Multi-View Modes**: Month, Week, Day, and Chronological Agenda views.
- **Task Deadlines & Milestones Overlay**: Real-time integration with project due dates and sprint meetings.
- **Event Scheduling**: Create, edit, and delete calendar entries with color categories and project linkages.

### 6. Team & Capacity Management (`/team`)
- **Directory**: Profile cards for all contributors with contact details, department, and role (*Admin, Project Manager, Team Member, Viewer*).
- **Live Sprint Capacity**: Automatic calculation of active tasks, estimated hours, and workload capacity percentage with visual status bars.
- **Member Management**: Add/invite team members, update roles, and manage permissions.

### 7. Time Tracking & Stopwatch (`/time-tracking`)
- **Persistent Live Stopwatch**: Calculates elapsed time using timestamp deltas so active sessions are never lost across browser reloads.
- **Manual Time Logging**: Record client-billable hours against specific projects and tasks.
- **Audit Logs Table**: Filter by project and member; tracks daily, weekly, and total logged hours.

### 8. Analytics & CSV Export (`/reports`)
- Comprehensive reporting dashboard with Recharts visualizations.
- **1-Click CSV Exports**: Client-ready downloads for tasks and time log history.
- Health velocity indicators: Average turnaround, defect density, code review latency.

### 9. Internal Communications (`/messages`, `/discussions`)
- **Direct & Channel Chats**: Interactive demo chat interface with unread count badges and timestamped message delivery.
- **Project RFC Discussions**: Asynchronous architecture decision threads with threaded replies.

### 10. Notifications Center (`/notifications`)
- Real-time notification feed tracking task assignments, completions, mentions, deadline alerts, and team changes.
- Read/unread state filtering and 1-click "Mark All as Read".

### 11. Workspace Settings (`/settings`)
- **General**: Customize workspace name, logo, description, timezone, and date format.
- **Profile**: Update full name, job title, avatar, and contact bio.
- **Preferences**: Seamless toggle between clean light mode and deep dark mode.
- **Data Management**: Export full workspace JSON backups or restore original seed datasets.

### 12. Multi-Tenant Platform Admin Console (`/admin/*`)
- Platform-level superadmin console for managing corporate workspaces, tenant subscriptions, platform activity logs, and global rate limits.

---

## 🎨 Design System & Visual Identity

| Attribute | Specification |
| :--- | :--- |
| **Brand Name** | TASKSPHERE |
| **Tagline** | *PLAN SMARTER. WORK BETTER. ACHIEVE MORE.* |
| **Midnight Navy** | `#101426` |
| **Deep Indigo** | `#171C35` |
| **Electric Violet** | `#7867F7` |
| **Soft Purple** | `#A99BFF` |
| **Cyan Accent** | `#54C7E8` |
| **Background** | `#F7F8FC` (Light) / `#101426` (Dark) |
| **Typography** | Inter & Manrope |

---

## 🔑 Demo Login Credentials

Authentication is simulated on the client with full persistence. You can use the quick autofill buttons on `/login` or enter:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@tasksphere.demo` | `TaskSphere123!` |
| **Team Member** | `member@tasksphere.demo` | `Member123!` |

*(You can also quickly switch between active demo accounts directly from the top-right user menu.)*

---

## 🚀 Installation & Local Development

### 1. Prerequisites
- Node.js `v18+` or `v20+` (tested on Node v24)
- npm or yarn

### 2. Clone and Install
```bash
git clone <repository-url>
cd TASKSPHERE
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build Locally
```bash
npm run preview
```

---

## ☁️ Vercel Deployment Instructions

TASKSPHERE is pre-configured for seamless zero-config deployment to [Vercel](https://vercel.com):

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, click **"Add New Project"** and select the repository.
3. Keep default settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. The included `vercel.json` ensures all SPA routes (`/dashboard`, `/board`, `/projects/:id`, etc.) properly resolve on direct URL entry and hard refresh.
5. Click **Deploy**. Your SaaS application will be live immediately!

---

## 📦 Architecture & Technologies

- **Frontend Framework**: React 18 + Vite 6
- **Routing**: React Router DOM v6
- **State Management**: Zustand with persistent `localStorage` sync
- **Styling**: Tailwind CSS with custom semantic design tokens & dark mode
- **Drag & Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **Charts & Data Visualization**: Recharts
- **Date Calculation**: date-fns
- **Icons**: Lucide React
- **Micro-Interactions**: Framer Motion & Canvas Confetti
