import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

interface NonClientRouteProps {
  children: React.ReactNode;
}

const NonClientRoute: React.FC<NonClientRouteProps> = ({ children }) => {
  const { user } = useAppSelector((state) => state.auth);

  // Check if user is CLIENT
  const isClient = user?.role?.toUpperCase() === "CLIENT";

  if (isClient) {
    // Redirect CLIENT users to tickets page
    return <Navigate to="/tickets" replace />;
  }

  return <>{children}</>;
};

export default NonClientRoute;
