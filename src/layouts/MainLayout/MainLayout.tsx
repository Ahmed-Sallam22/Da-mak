import { Outlet, useNavigate } from "react-router-dom";
import { Navbar } from "../../components/shared";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import toast from "react-hot-toast";

/**
 * MainLayout Component
 *
 * This layout wraps all authenticated pages (not authentication pages like login, forgot password, etc.)
 * It includes the Navbar at the top and renders child routes using <Outlet />
 *
 * Used for: /tickets, /settings, /profile, etc.
 * Not used for: /, /login, /forgot-password, /otp, /reset-password
 */
const MainLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Navbar - Will appear on all pages using this layout */}
      <Navbar
        userName={user?.full_name || user?.username || "User"}
        userEmail={user?.email || ""}
        onLogout={handleLogout}
      />
      <div className="max-w-[95%] mx-auto">
        {/* Page Content - Rendered by child routes */}
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
