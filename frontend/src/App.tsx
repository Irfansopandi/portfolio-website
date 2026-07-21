import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './context/AuthContext';

// Public Layout & Core Components
import LoadingScreen from './components/LoadingScreen';
import PublicLayout from './layouts/PublicLayout';
import HomePage from './pages/public/HomePage';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy Loaded Pages
const ProjectDetailPage = lazy(() => import('./pages/public/ProjectDetailPage'));

// Lazy Loaded Admin Pages
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const AdminProjectsPage = lazy(() => import('./pages/admin/AdminProjectsPage'));
const AdminEducationPage = lazy(() => import('./pages/admin/AdminEducationPage'));
const AdminSkillsPage = lazy(() => import('./pages/admin/AdminSkillsPage'));
const AdminCertificatesPage = lazy(() => import('./pages/admin/AdminCertificatesPage'));
const AdminExperiencesPage = lazy(() => import('./pages/admin/AdminExperiencesPage'));
const AdminMessagesPage = lazy(() => import('./pages/admin/AdminMessagesPage'));
const AdminProfilePage = lazy(() => import('./pages/admin/AdminProfilePage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));

// Fallback Loader for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0a14]">
    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

function AppContent() {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dynamic html lang tag for accessibility & SEO
    document.documentElement.lang = i18n.language || 'en';
  }, [i18n.language]);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<Navigate to="/#about" replace />} />
          <Route path="/education" element={<Navigate to="/#education" replace />} />
          <Route path="/skills" element={<Navigate to="/#skills" replace />} />
          <Route path="/projects" element={<Navigate to="/#projects" replace />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/certificates" element={<Navigate to="/#certificates" replace />} />
          <Route path="/experiences" element={<Navigate to="/#experiences" replace />} />
          <Route path="/contact" element={<Navigate to="/#contact" replace />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="projects" element={<AdminProjectsPage />} />
          <Route path="education" element={<AdminEducationPage />} />
          <Route path="skills" element={<AdminSkillsPage />} />
          <Route path="certificate" element={<AdminCertificatesPage />} />
          <Route path="experiences" element={<AdminExperiencesPage />} />
          <Route path="messages" element={<AdminMessagesPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#fff',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '12px',
            },
            success: {
              iconTheme: { primary: '#6366f1', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ec4899', secondary: '#fff' },
            },
          }}
        />
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
