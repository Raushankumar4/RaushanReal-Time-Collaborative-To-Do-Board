import { createBrowserRouter } from 'react-router-dom';
import ErrorBoundary from '../layout/ErrorBoundary';
import { lazy, Suspense } from 'react';
import App from '../../App';
import Loading from '../Loading/Loading';

const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const KanbanBoard = lazy(() => import('../pages/KanbanBoard'));

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
            <KanbanBoard />
          </Suspense>
        ),
      },
    ],
  },
]);
