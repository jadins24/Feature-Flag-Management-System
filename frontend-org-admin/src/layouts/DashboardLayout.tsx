import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { User as UserIcon } from 'lucide-react';
import type { RootState } from '../redux/store';
import Sidebar from '../components/Sidebar';

const DashboardLayout: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <header className="top-bar">
          <h1 className="top-bar-title">Dashboard</h1>
          <div className="top-bar-user">
            <span className="user-avatar">
              <UserIcon size={16} />
            </span>
            <span className="user-email">{user?.email}</span>
          </div>
        </header>
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;