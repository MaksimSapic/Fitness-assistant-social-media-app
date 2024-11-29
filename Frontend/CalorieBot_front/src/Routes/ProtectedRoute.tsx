import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const userString = localStorage.getItem("user");
  const isAuthenticated = !!userString;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;