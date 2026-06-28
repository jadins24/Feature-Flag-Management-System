import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Users, Copy, Building2, Eye } from 'lucide-react';
import type { AppDispatch, RootState } from '../redux/store';
import { fetchOrgAdmins } from '../redux/slices/orgAdminsSlice';

const OrgAdminsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { admins, loading, error } = useSelector((state: RootState) => state.orgAdmins);

  useEffect(() => {
    dispatch(fetchOrgAdmins());
  }, [dispatch]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <h2>Organization Admins</h2>
          <p className="page-description">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <h2>Organization Admins</h2>
          <p className="page-description" style={{ color: 'var(--danger)' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (admins.length === 0) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <h2>Organization Admins</h2>
          <p className="page-description">
            Manage organization administrators and their permissions
          </p>
        </div>

        <div className="dashboard-section">
          <div className="empty-state">
            <Users size={48} />
            <p>No organization admins yet. Org admins are created automatically when an organization is created.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h2>Organization Admins</h2>
        <p className="page-description">
          Manage organization administrators and their permissions
        </p>
      </div>

      <div className="dashboard-section">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Organization</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>
                    <span className="email-cell">{admin.email}</span>
                  </td>
                  <td>
                    <div className="org-cell">
                      <Building2 size={16} />
                      {admin.org_name}
                    </div>
                  </td>
                  <td>
                    {new Date(admin.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="btn-icon"
                      onClick={() => copyToClipboard(admin.id)}
                      title="Copy Admin ID"
                    >
                      <Copy size={16} />
                    </button>
                    <Link
                      to={`/org-admins/${admin.id}`}
                      className="btn-icon"
                      title="View Admin Details"
                      style={{ marginLeft: '0.25rem' }}
                    >
                      <Eye size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrgAdminsPage;