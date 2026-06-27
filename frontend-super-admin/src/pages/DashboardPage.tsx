import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Building2, Flag, Users } from 'lucide-react';
import type { AppDispatch, RootState } from '../redux/store';
import { fetchOrgs } from '../redux/slices/orgsSlice';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { organizations } = useSelector((state: RootState) => state.orgs);

  useEffect(() => {
    dispatch(fetchOrgs());
  }, [dispatch]);

  const stats = [
    {
      label: 'Total Organizations',
      value: organizations.length,
      icon: Building2,
      color: 'var(--accent)',
    },
    {
      label: 'Total Flags',
      value: '—',
      icon: Flag,
      color: 'var(--success)',
    },
    {
      label: 'Org Admins',
      value: '—',
      icon: Users,
      color: 'var(--warning)',
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p className="page-description">
          Overview of your feature flag platform
        </p>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon" style={{ color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h3>Recent Organizations</h3>
          <a href="/organizations" className="view-all-link">View all</a>
        </div>
        <p className="section-description">Your most recently created organizations</p>
        {organizations.length > 0 ? (
          <div className="recent-orgs">
            {organizations.slice(0, 5).map((org) => (
              <div key={org.id} className="recent-org-card">
                <div className="org-name">{org.name}</div>
                <div className="org-id">{org.id}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-text">No organizations yet. <a href="/organizations">Create your first one</a>.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;