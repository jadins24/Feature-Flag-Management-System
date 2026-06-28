import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, Calendar, Mail, Copy } from 'lucide-react';
import type { AppDispatch, RootState } from '../redux/store';
import { fetchOrgAdmin } from '../redux/slices/orgAdminsSlice';

const OrgAdminDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { admin, loading, error } = useSelector((state: RootState) => state.orgAdmins);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrgAdmin(id));
    }
  }, [dispatch, id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <h2>Org Admin Details</h2>
          <p className="page-description" style={{ color: 'var(--danger)' }}>{error}</p>
        </div>
        <Link to="/org-admins" className="btn btn-outline">
          <ArrowLeft size={16} />
          Back to Org Admins
        </Link>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="flex-between" style={{ marginBottom: '1rem' }}>
          <Link to="/org-admins" className="btn btn-outline">
            <ArrowLeft size={16} />
            Back to Org Admins
          </Link>
        </div>
        <h2>{admin.email}</h2>
        <p className="page-description">Organization Admin Details</p>
      </div>

      <div className="dashboard-section">
        <div className="table-container" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Mail size={20} style={{ color: 'var(--accent)' }} />
              <div>
                <strong>Email:</strong> {admin.email}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Building2 size={20} style={{ color: 'var(--accent)' }} />
              <div>
                <strong>Organization:</strong> {admin.org_name}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Calendar size={20} style={{ color: 'var(--accent)' }} />
              <div>
                <strong>Created:</strong> {new Date(admin.created_at).toLocaleDateString()}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div>
                <strong>Admin ID:</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <code style={{ fontFamily: 'monospace', fontSize: '0.85rem', background: 'var(--bg-input)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                    {admin.id}
                  </code>
                  <button
                    className="btn-icon"
                    onClick={() => copyToClipboard(admin.id)}
                    title="Copy Admin ID"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgAdminDetailPage;