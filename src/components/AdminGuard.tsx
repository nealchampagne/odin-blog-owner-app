import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/auth";

const AdminGuard = () => {
  const { user, loading } = useAuth();

  // Block the entire subtree until auth is resolved
  if (loading) {
    return null; // or a full-screen loader if you prefer
  }

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminGuard;
