import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layout/RootLayout';
import PrivateRoute from './PrivateRoute';
import ErrorBoundary from '../layout/ErrorBoundary';
import React, { Suspense } from 'react';
import App from '../../App';
import Loading from '../Loading/Loading';

const Login = React.lazy(() => import('../pages/Login'));
const Register = React.lazy(() => import('../pages/Register'));
const KanbanBoard = React.lazy(() => import('../pages/KanbanBoard'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ErrorBoundary><App /></ErrorBoundary>,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense fallback={<Loading />}>
            <Register />
          </Suspense>
        ),
      },
      {
        path: 'board',
        element: (
          <Suspense fallback={<Loading />}>
            <PrivateRoute>
              <KanbanBoard />
            </PrivateRoute>
          </Suspense>
        ),
      },
    ],
  },
]);
