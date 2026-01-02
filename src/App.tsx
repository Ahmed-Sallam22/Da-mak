import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  LoginPage,
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

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes - No Layout */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Authenticated Routes - With Layout (Navbar) */}
        <Route element={<MainLayout notificationCount={3} />}>
          <Route path="/tickets" element={<MyTicketsPage />} />
          <Route path="/tickets/:id" element={<TicketDetailsPage />} />
          <Route path="/tickets-board" element={<TicketsBoardPage />} />
          <Route path="/user-management" element={<UserManagementPage />} />
          <Route path="/organizations" element={<OrganizationsPage />} />
          <Route
            path="/organizations/:id"
            element={<OrganizationDetailsPage />}
          />
          <Route path="/lorem" element={<NotFoundPage />} />
          <Route path="/settings" element={<NotFoundPage />} />
          <Route path="/profile" element={<NotFoundPage />} />
        </Route>

        {/* 404 Catch-all route - must be last */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
