import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flag } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-hero">
          <div className="landing-logo">
            <Flag size={48} />
          </div>
          <h1 className="landing-title">FlagMaster</h1>
          <p className="landing-subtitle">Org Admin Portal</p>
          <p className="landing-description">
            Manage feature flags for your organization.
            Toggle features, monitor rollouts, and control access.
          </p>
          <button
            className="btn btn-primary btn-large"
            onClick={() => navigate('/login')}
          >
            Login to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;