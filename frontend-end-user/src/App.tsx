import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, AlertCircle, Building2, LogOut, User } from 'lucide-react';
import { fetchOrgs, checkFlag } from './api/client';
import './App.css';

interface Organization {
  id: string;
  name: string;
}

interface CheckResponse {
  enabled?: boolean;
  error?: string;
}

const App: React.FC = () => {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [featureKey, setFeatureKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResponse | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      setUserEmail(user.email);
      if (user.org_id) {
        setSelectedOrgId(user.org_id);
      } else {
        navigate('/login');
        return;
      }
    } catch {
      navigate('/login');
      return;
    }

    // Fetch organizations to get the name of the user's organization
    fetchOrgs()
      .then((data: Organization[]) => setOrgs(data))
      .catch(() => setOrgs([]))
      .finally(() => setPageLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('defaultOrgId');
    navigate('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrgId || !featureKey.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await checkFlag(selectedOrgId, featureKey.trim());
      setResult({ enabled: data.enabled });
    } catch (err: any) {
      setResult({ error: err.message || 'Failed to check flag' });
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="app-container">
        <div className="card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const currentOrgName = orgs.find((o) => o.id === selectedOrgId)?.name || 'Loading organization...';

  return (
    <div className="app-container">
      <div className="card">
        <header className="header">
          <div className="logo">
            <Building2 size={24} />
            Feature Flag Checker
          </div>
          <p>Check if a feature is enabled for your organization</p>
        </header>

        <div className="org-header">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span className="org-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Organization
            </span>
            <span className="org-name" style={{ fontWeight: '600', fontSize: '1.1rem' }}>
              {currentOrgName}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {userEmail && (
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <User size={16} /> {userEmail}
              </span>
            )}
            <button 
              className="btn-settings" 
              onClick={handleLogout}
              title="Logout"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', borderRadius: '50%', background: 'var(--bg-input)', border: 'none', cursor: 'pointer' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="check-form">
          <div className="form-group">
            <label htmlFor="featureKey">Feature Key</label>
            <input
              id="featureKey"
              type="text"
              placeholder="e.g. dark_mode, beta_feature"
              value={featureKey}
              onChange={(e) => setFeatureKey(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading || !featureKey}>
            {loading ? 'Checking...' : 'Check Feature Flag'}
          </button>
        </form>

        {result && (
          <div className="result-container">
            {result.error ? (
              <div className="result error">
                <span className="icon">
                  <AlertCircle size={20} />
                </span>
                <p>{result.error}</p>
              </div>
            ) : (
              <div className={`result status ${result.enabled ? 'enabled' : 'disabled'}`}>
                <span className="icon">
                  {result.enabled ? <Check size={20} /> : <X size={20} />}
                </span>
                <div>
                  <p className="status-title">
                    Feature is <strong>{result.enabled ? 'ENABLED' : 'DISABLED'}</strong>
                  </p>
                  <p className="status-desc">
                    {result.enabled
                      ? 'The feature flag is currently active for this organization.'
                      : 'The feature flag is currently turned off for this organization.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;