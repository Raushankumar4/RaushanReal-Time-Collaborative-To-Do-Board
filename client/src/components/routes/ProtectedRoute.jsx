import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true, state: { from: location } });
    }
  }, [token, navigate, location]);

  return token ? children : null;
};
