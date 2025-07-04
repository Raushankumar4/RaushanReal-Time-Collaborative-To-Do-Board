import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <Suspense fallback={<div className="loader">Loading...</div>}>
      <main>
        <Outlet />
      </main>
    </Suspense>
  );
};

export default RootLayout;
