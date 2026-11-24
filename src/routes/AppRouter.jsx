import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Layouts
import { WorkspaceLayout } from '../layouts/WorkspaceLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';

// Workspace Pages
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ProjectsPage } from '../pages/projects/ProjectsPage';
import { ProjectDetailPage } from '../pages/projects/ProjectDetailPage';
import { TasksPage } from '../pages/tasks/TasksPage';
import { BoardPage } from '../pages/board/BoardPage';
import { MyWorkPage } from '../pages/my-work/MyWorkPage';
import { CalendarPage } from '../pages/calendar/CalendarPage';
import { TeamPage } from '../pages/team/TeamPage';
import { TimeTrackingPage } from '../pages/time-tracking/TimeTrackingPage';
import { ReportsPage } from '../pages/reports/ReportsPage';
import { MessagesPage } from '../pages/messages/MessagesPage';
import { DiscussionsPage } from '../pages/messages/DiscussionsPage';
import { NotificationsPage } from '../pages/notifications/NotificationsPage';
import { SettingsPage } from '../pages/settings/SettingsPage';

// Admin Pages
import { AdminOverviewPage } from '../pages/admin/AdminOverviewPage';
import { AdminWorkspacesPage } from '../pages/admin/AdminWorkspacesPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminProjectsPage } from '../pages/admin/AdminProjectsPage';
import { AdminActivityPage } from '../pages/admin/AdminActivityPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';

export const AppRouter = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Main Workspace Routes */}
      <Route element={isAuthenticated ? <WorkspaceLayout /> : <Navigate to="/login" replace />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/board" element={<BoardPage />} />
        <Route path="/my-work" element={<MyWorkPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/time-tracking" element={<TimeTrackingPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/discussions" element={<DiscussionsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Admin Platform Console */}
      <Route path="/admin" element={isAuthenticated ? <AdminLayout /> : <Navigate to="/login" replace />}>
        <Route index element={<AdminOverviewPage />} />
        <Route path="workspaces" element={<AdminWorkspacesPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="activity" element={<AdminActivityPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Default redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
