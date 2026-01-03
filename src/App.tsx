import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  LoginPage,
  DashboardPage,
  ForgotPasswordPage,
  OTPPage,
  ResetPasswordPage,
  MyTicketsPage,
  NotFoundPage,
  UserManagementPage,
  TicketsBoardPage,
  OrganizationsPage,
  OrganizationDetailsPage,
  TicketDetailsPage,
} from "./pages";
import { MainLayout } from "./layouts";
import { ProtectedRoute } from "./components/layout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes - No Layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Authenticated Routes - With Layout (Navbar) */}
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <MyTicketsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/:id"
            element={
              <ProtectedRoute>
                <TicketDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets-board"
            element={
              <ProtectedRoute>
                <TicketsBoardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-management"
            element={
              <ProtectedRoute>
                <UserManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizations"
            element={
              <ProtectedRoute>
                <OrganizationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizations/:id"
            element={
              <ProtectedRoute>
                <OrganizationDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lorem"
            element={
              <ProtectedRoute>
                <NotFoundPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <NotFoundPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <NotFoundPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 Catch-all route - must be last */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
