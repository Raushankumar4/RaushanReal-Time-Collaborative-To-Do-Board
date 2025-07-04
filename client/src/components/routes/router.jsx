import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layout/RootLayout';
import PrivateRoute from './PrivateRoute';
import ErrorBoundary from '../layout/ErrorBoundary';
import React, { Suspense } from 'react';
import App from '../../App';

const Login = React.lazy(() => import('../pages/Login'));
const Register = React.lazy(() => import('../pages/Register'));
const KanbanBoard = React.lazy(() => import('../pages/KanbanBoard'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Register />
          </Suspense>
        ),
      },
      {
        path: 'board',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <PrivateRoute>
              <KanbanBoard />
            </PrivateRoute>
          </Suspense>
        ),
      },
    ],
  },
]);
