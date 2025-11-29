import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// HR pages
import DashboardPage from './pages/hr/DashboardPage';
import JobsPage from './pages/hr/JobsPage';
import CreateJobPage from './pages/hr/CreateJobPage';
import JobDetailPage from './pages/hr/JobDetailPage';

// Public pages
import JobViewPage from './pages/public/JobViewPage';
import ApplyPage from './pages/public/ApplyPage';
import SuccessPage from './pages/public/SuccessPage';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Public job routes (for candidates) */}
      <Route path="/job/:publicLink" element={<JobViewPage />} />
      <Route path="/job/:publicLink/apply" element={<ApplyPage />} />
      <Route path="/job/:publicLink/success" element={<SuccessPage />} />

      {/* Protected routes (for HR managers) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <JobsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs/create"
        element={
          <ProtectedRoute>
            <CreateJobPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs/:id"
        element={
          <ProtectedRoute>
            <JobDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
