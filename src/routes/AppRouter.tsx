import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/layouts/MainLayout";
import LoadingSpinner from "@/components/LoadingSpinner";

// Lazy load page components
const Home = lazy(() => import("@/page/Home"));
const Base = lazy(() => import("@/components/Base"));
const Dashboard = lazy(() => import("@/app/dashboard/page"));
const BaseUpdate = lazy(() => import("@/page/base/BaseUpdate"));
const NotFound = lazy(() => import("@/page/NotFound"));
const LoginPage = lazy(() => import("@/page/login/LoginPage"));
const SignUpPage = lazy(() => import("@/page/sign-up/Sign-UpPage"));

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

// Protected route wrapper component
const ProtectedRoute = ({ children, isAuthenticated }: ProtectedRouteProps) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Auth route wrapper component
const AuthRoute = ({ children, isAuthenticated }: ProtectedRouteProps) => {
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="base" element={<Base />} />

          {/* Auth Routes */}
          <Route
            path="sign-in"
            element={
              <AuthRoute isAuthenticated={isAuthenticated}>
                <LoginPage />
              </AuthRoute>
            }
          />
          <Route
            path="sign-up"
            element={
              <AuthRoute isAuthenticated={isAuthenticated}>
                <SignUpPage />
              </AuthRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="bases/:baseId/edit"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <BaseUpdate />
              </ProtectedRoute>
            }
          />

          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
