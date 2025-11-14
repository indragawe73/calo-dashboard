import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from './store/slices/authSlice';
import LoginPage from './pages/auth/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ApiStatus from './components/dev/ApiStatus';
import { Suspense } from 'react';
import { AdminTablePage, RegisterPage } from './pages/administration';
import { ImageListPage } from './pages/image-list';
import JobSchedulesPage from './pages/job-schedules';
import LoginDebugger from './components/dev/LoginDebugger';
import ImagesDebugger from './components/dev/ImagesDebugger';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Admin Route Component (requires admin role)
const AdminRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (currentUser?.role !== 'admin') {
    return <Navigate to="/dashboard/image-list" replace />;
  }
  
  return children;
};

// Public Route Component (redirect to image-list if already authenticated)
const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  return isAuthenticated ? <Navigate to="/dashboard/image-list" replace /> : children;
};

function App() {
  return (
    <div className="app">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/administration/site-details" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AdminTablePage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/image-list" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ImageListPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/administration/register" 
            element={
              <AdminRoute>
                <DashboardLayout>
                  <RegisterPage />
                </DashboardLayout>
              </AdminRoute>
            } 
          />
          <Route 
            path="/dashboard/job-schedules" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <JobSchedulesPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Debug Routes */}
          <Route 
            path="/debug/login" 
            element={<LoginDebugger />} 
          />
          <Route 
            path="/debug/images" 
            element={<ImagesDebugger />} 
          />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard/image-list" replace />} />
          
          {/* 404 Page */}
          <Route 
            path="*" 
            element={
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '100vh',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
              </div>
            } 
          />
        </Routes>
      </Suspense>
      
      {/* API Status indicator for development */}
      {/* <ApiStatus /> */}
    </div>
  );
}

export default App;
