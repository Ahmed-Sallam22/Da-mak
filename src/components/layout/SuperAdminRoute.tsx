import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

interface SuperAdminRouteProps {
  children: React.ReactNode;
}

const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Check if user is SUPER_ADMIN (with underscore and uppercase)
  const isSuperAdmin =
    user?.role?.toUpperCase().replace(/_/g, "") === "SUPERADMIN" ||
    user?.role === "SUPER_ADMIN";

  if (!isSuperAdmin) {
    // Redirect to tickets page if not superadmin
    return <Navigate to="/tickets" replace />;
  }

  return <>{children}</>;
};

export default SuperAdminRoute;
