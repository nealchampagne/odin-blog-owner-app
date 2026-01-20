import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/auth";

const AdminGuard = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading…</div>;

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminGuard;