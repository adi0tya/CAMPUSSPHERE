import { Outlet } from 'react-router-dom';

const PublicLayout = () => (
  <div className="min-h-screen bg-dark-950">
    <Outlet />
  </div>
);

export default PublicLayout;
