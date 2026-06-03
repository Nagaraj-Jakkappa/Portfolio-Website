// client/src/App.jsx

import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';

import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Lazy Pages
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));

const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const ProjectsPage = lazy(() => import('./pages/admin/ProjectsPage'));
const MessagesPage = lazy(() => import('./pages/admin/MessagesPage'));
const CertificatesPage = lazy(() => import('./pages/admin/CertificatesPage'));
const AnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const ContentPage = lazy(() => import('./pages/admin/ContentPage'));
const SkillsPage = lazy(() => import('./pages/admin/SkillsPage'));

// NEW Notification Page
const NotificationsPage = lazy(() => import('./pages/admin/NotificationsPage'));

function PageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060d1a]">
      <div className="w-8 h-8 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        {/* PUBLIC WEBSITE */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-navy-900 font-body">
              <Navbar />
              <main>
                <Home />
              </main>
              <Footer />
            </div>
          }
        />

        {/* ADMIN LOGIN */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ADMIN PANEL */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<DashboardPage />} />

          {/* Analytics */}
          <Route path="analytics" element={<AnalyticsPage />} />

          {/* Projects */}
          <Route path="projects" element={<ProjectsPage />} />

          {/* Messages */}
          <Route path="messages" element={<MessagesPage />} />

          {/* Certificates */}
          <Route path="certificates" element={<CertificatesPage />} />

          {/* Settings */}
          <Route path="settings" element={<SettingsPage />} />

          {/* Content Manager */}
          <Route path="content" element={<ContentPage />} />

          {/* Skills */}
          <Route path="skills" element={<SkillsPage />} />

          {/* NEW Notifications Route */}
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
