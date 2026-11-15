import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Toaster } from "sonner";
import AuthLayout from "./components/auth/AuthLayout";
import ClinicLayout from "./components/layout/ClinicLayout";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import VerifyOtpPage from "./pages/auth/VerifyOtpPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

// Clinic Portal Pages
import AppointmentsPage from "./pages/appointments/AppointmentsPage";
import DoctorsPage from "./pages/doctors/DoctorsPage";
import ReportsPage from "./pages/reports/ReportsPage";
import AdminLayout from "./pages/admin/AdminLayout";
import ClinicSettingsPage from "./pages/admin/ClinicSettingsPage";
import StaffPage from "./pages/admin/StaffPage";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Clinic Portal Authenticated / Dashboard Routes */}
        <Route element={<ClinicLayout />}>
          <Route path="/" element={<AppointmentsPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/reports" element={<ReportsPage />} />

          {/* Admin Section with Collapsible Screen-Height Sidebar */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="clinic-settings" replace />} />
            <Route path="clinic-settings" element={<ClinicSettingsPage />} />
            <Route path="staff" element={<StaffPage />} />
          </Route>

          {/* Scoped Clinic Slug Routes */}
          <Route path="/:slug" element={<AppointmentsPage />} />
          <Route path="/:slug/doctors" element={<DoctorsPage />} />
          <Route path="/:slug/reports" element={<ReportsPage />} />

          {/* Scoped Admin Section */}
          <Route path="/:slug/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="clinic-settings" replace />} />
            <Route path="clinic-settings" element={<ClinicSettingsPage />} />
            <Route path="staff" element={<StaffPage />} />
          </Route>
        </Route>

        {/* Authentication Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/:slug/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/:slug/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/:slug/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/:slug/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
