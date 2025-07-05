import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../Loading/Loading';

const PrivateRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API}/api/v1/auth/check`, {
        withCredentials: true,
      })
      .then(res => setIsAuth(res.data.authenticated))
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) return <Loading />;

  return isAuth ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
