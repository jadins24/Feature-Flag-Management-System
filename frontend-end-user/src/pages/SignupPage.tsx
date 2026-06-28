import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { fetchOrgs, registerUser } from '../api/client';

interface Organization {
  id: string;
  name: string;
}

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrgs()
      .then((data) => setOrganizations(data))
      .catch((err) => console.error('Failed to load organizations', err));
  }, []);

  const trimmedInput = orgName.trim();
  const matchedOrg = trimmedInput
    ? organizations.find((org) => org.name.toLowerCase() === trimmedInput.toLowerCase())
    : null;
  const orgExists = trimmedInput ? !!matchedOrg : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedOrg) {
      setError('Organization not found. Please contact your administrator.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const data = await registerUser(email, password, orgName);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.user.org_id) {
        localStorage.setItem('defaultOrgId', data.user.org_id);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <UserPlus size={48} className="auth-logo" />
            <h1>User Sign Up</h1>
            <p>Create an end user account for your organization</p>
          </div>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="orgName">Organization Name</label>
              <input
                id="orgName"
                type="text"
                className="form-input"
                placeholder="Enter your organization name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
                disabled={loading}
              />
              {trimmedInput && orgExists === true && (
                <div style={{ color: '#10b981', fontSize: '0.85rem', marginTop: '0.25rem', fontWeight: '500', textAlign: 'left' }}>
                  ✅ Organization found
                </div>
              )}
              {trimmedInput && orgExists === false && (
                <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.25rem', fontWeight: '500', textAlign: 'left' }}>
                  ❌ Organization not found. Please contact your administrator.
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading || orgExists === false}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
          <p className="auth-footer">
            <Link to="/login" className="auth-link">Already have an account? Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
