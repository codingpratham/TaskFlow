// components/ProtectedRoute.tsx
import type { JSX } from "react";

import { Navigate } from "react-router-dom";


interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: ("USER" | "TEAM_ADMIN")[];
}

const PrivateRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const authString = localStorage.getItem("user");
  const auth = authString ? JSON.parse(authString) : null;

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/register" replace />;
  }

  return children;
};

export default PrivateRoute;
