import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-hero">
          <div className="landing-logo">
            <Zap size={48} />
          </div>
          <h1 className="landing-title">FlagMaster</h1>
          <p className="landing-subtitle">Super Admin Portal</p>
          <p className="landing-description">
            Manage organizations and oversee your multi-tenant feature flag platform.
            Create and monitor organizations from a single dashboard.
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
