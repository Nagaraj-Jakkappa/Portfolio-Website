import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const AdminLogin       = lazy(() => import('./pages/AdminLogin'));
const AdminLayout      = lazy(() => import('./pages/admin/AdminLayout'));
const DashboardPage    = lazy(() => import('./pages/admin/DashboardPage'));
const ProjectsPage     = lazy(() => import('./pages/admin/ProjectsPage'));
const MessagesPage     = lazy(() => import('./pages/admin/MessagesPage'));
const CertificatesPage = lazy(() => import('./pages/admin/CertificatesPage'));
const AnalyticsPage    = lazy(() => import('./pages/admin/AnalyticsPage'));
const SettingsPage     = lazy(() => import('./pages/admin/SettingsPage'));

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
        <Route path="/" element={
          <div className="min-h-screen bg-navy-900 font-body">
            <Navbar />
            <main><Home /></main>
            <Footer />
          </div>
        } />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index             element={<DashboardPage />} />
          <Route path="projects"     element={<ProjectsPage />} />
          <Route path="messages"     element={<MessagesPage />} />
          <Route path="certificates" element={<CertificatesPage />} />
          <Route path="analytics"    element={<AnalyticsPage />} />
          <Route path="settings"     element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
