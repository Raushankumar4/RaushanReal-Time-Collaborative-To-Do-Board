import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  return token ? (
    children
  ) : (
    <Navigate to="/" replace state={{ from: location }} />
  );
};
