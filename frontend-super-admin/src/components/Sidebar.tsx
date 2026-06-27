import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LayoutDashboard, Building2, Users, LogOut } from 'lucide-react';
import type { AppDispatch } from '../redux/store';
import { logout } from '../redux/slices/authSlice';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8L21 10h-9l1-8z" />
          </svg>
        </div>
        <h2>FlagMaster</h2>
        <span className="sidebar-role">Super Admin</span>
      </div>
      <nav className="sidebar-nav">
        <a href="/dashboard" className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}>
          <span className="sidebar-link-icon">
            <LayoutDashboard size={16} />
          </span>
          Dashboard
        </a>
        <a href="/organizations" className={`sidebar-link ${isActive('/organizations') ? 'active' : ''}`}>
          <span className="sidebar-link-icon">
            <Building2 size={16} />
          </span>
          Organizations
        </a>
        <a href="/org-admins" className={`sidebar-link ${isActive('/org-admins') ? 'active' : ''}`}>
          <span className="sidebar-link-icon">
            <Users size={16} />
          </span>
          Org Admins
        </a>
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