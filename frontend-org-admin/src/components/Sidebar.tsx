import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Flag, LogOut, Users } from 'lucide-react';
import type { AppDispatch } from '../redux/store';
import { logout } from '../redux/slices/authSlice';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Flag size={24} />
        </div>
        <h2>FlagMaster</h2>
        <span className="sidebar-role">Org Admin</span>
      </div>
      <nav className="sidebar-nav">
        <Link to="/dashboard" className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}>
          <span className="sidebar-link-icon">
            <Flag size={16} />
          </span>
          Feature Flags
        </Link>
        <Link to="/users" className={`sidebar-link ${isActive('/users') ? 'active' : ''}`}>
          <span className="sidebar-link-icon">
            <Users size={16} />
          </span>
          Users
        </Link>
      </nav>
      <div className="sidebar-footer">
        <button className="btn-logout" onClick={handleLogout}>
          <span>
            <LogOut size={16} />
          </span> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;