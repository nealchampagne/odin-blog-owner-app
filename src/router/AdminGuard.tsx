import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth";

type Props = {
  children: ReactNode;
}

const AdminGuard = ({ children }: Props) => {
  const { user } = useAuth();

  if (user?.role !== "ADMIN") {
    return <Navigate to="/login" />;
  }

  return children;
}

export default AdminGuard;