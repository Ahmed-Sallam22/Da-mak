import { Outlet } from "react-router-dom";
import { Navbar } from "../../components/shared";

interface MainLayoutProps {
  notificationCount?: number;
}

/**
 * MainLayout Component
 *
 * This layout wraps all authenticated pages (not authentication pages like login, forgot password, etc.)
 * It includes the Navbar at the top and renders child routes using <Outlet />
 *
 * Used for: /tickets, /settings, /profile, etc.
 * Not used for: /, /login, /forgot-password, /otp, /reset-password
 */
const MainLayout: React.FC<MainLayoutProps> = ({ notificationCount = 0 }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Navbar - Will appear on all pages using this layout */}
      <Navbar notificationCount={notificationCount} />
      <div className="max-w-[95%] mx-auto">
      {/* Page Content - Rendered by child routes */}
      <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
