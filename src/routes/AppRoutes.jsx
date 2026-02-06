import { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

// 🔹 Lazy imports (code-splitting only)
const Login = lazy(() => import("../components/auth/Login"));
const Register = lazy(() => import("../components/auth/Register"));
const Verification = lazy(() => import("../components/auth/Verification"));
const ForgotPassword = lazy(() => import("../components/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../components/auth/ResetPassword"));
const Logout = lazy(() => import("../components/auth/Logout"));
const NotFound = lazy(() => import("../components/errors/NotFound"));
import AppLoader from "../components/ui/loaders/AppLoader.jsx";
import FileManager from "../pages/FileManager.jsx";
import Layout from "../layouts/Layout.jsx";
import ApiKeys from "../pages/ApiKeys.jsx";
import Profile from "../pages/Profile.jsx";
import Home from "../pages/Home.jsx";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

export default function AppRoutes() {
  return (
    <Suspense fallback={<AppLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/reg"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/auth/verify-email"
          element={
            <PublicRoute>
              <Verification />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/auth/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route path="/u" element={<Layout />}>
            <Route path="file-manager" element={<FileManager />} />
            <Route path="file-manager/:folderId" element={<FileManager />} />
            <Route path="api-keys" element={<ApiKeys />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
