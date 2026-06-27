import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle, Building2, Settings } from 'lucide-react';
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

const DEFAULT_ORG_ID = import.meta.env.VITE_DEFAULT_ORG_ID as string;

const App: React.FC = () => {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState(DEFAULT_ORG_ID || '');
  const [showSetup, setShowSetup] = useState(!DEFAULT_ORG_ID);
  const [featureKey, setFeatureKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResponse | null>(null);
  const [setupLoading, setSetupLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for saved org (overrides env var if exists)
    const savedOrgId = localStorage.getItem('defaultOrgId');
    if (savedOrgId) {
      setSelectedOrgId(savedOrgId);
      setShowSetup(false);
    } else if (DEFAULT_ORG_ID) {
      setSelectedOrgId(DEFAULT_ORG_ID);
      setShowSetup(false);
    } else {
      setShowSetup(true);
    }

    // Fetch organizations for setup dropdown
    fetchOrgs()
      .then((data: Organization[]) => setOrgs(data))
      .catch(() => setOrgs([]))
      .finally(() => setSetupLoading(false));
  }, []);

  const handleSaveOrg = () => {
    if (selectedOrgId) {
      localStorage.setItem('defaultOrgId', selectedOrgId);
      setShowSetup(false);
    }
  };

  const handleClearOrg = () => {
    localStorage.removeItem('defaultOrgId');
    setSelectedOrgId(DEFAULT_ORG_ID || '');
    setShowSetup(!DEFAULT_ORG_ID);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const orgId = selectedOrgId;
    if (!orgId || !featureKey.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await checkFlag(orgId, featureKey.trim());
      setResult({ enabled: data.enabled });
    } catch (err: any) {
      setResult({ error: err.message || 'Failed to check flag' });
    } finally {
      setLoading(false);
    }
  };

  const effectiveOrgId = selectedOrgId || DEFAULT_ORG_ID;
  
  if (setupLoading) {
    return (
      <div className="app-container">
        <div className="card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (showSetup && !effectiveOrgId) {
    return (
      <div className="app-container">
        <div className="card">
          <header className="header">
            <div className="logo">
              <Building2 size={24} />
              Feature Flag Checker
            </div>
            <p>Select your organization to check feature flags</p>
          </header>
          
          <div className="form-group">
            <label htmlFor="setup-org">Organization</label>
            <select
              id="setup-org"
              value={selectedOrgId}
              onChange={(e) => setSelectedOrgId(e.target.value)}
              disabled={orgs.length === 0}
            >
              <option value="">-- Select Organization --</option>
              {orgs.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>
          
          <button className="btn-submit" onClick={handleSaveOrg} disabled={!selectedOrgId}>
            Save and Continue
          </button>
        </div>
      </div>
    );
  }

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
          <span className="org-name">
            {orgs.find((o) => o.id === effectiveOrgId)?.name || effectiveOrgId}
          </span>
          {!DEFAULT_ORG_ID && (
            <button 
              className="btn-settings" 
              onClick={handleClearOrg}
              title="Change organization"
            >
              <Settings size={16} />
            </button>
          )}
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