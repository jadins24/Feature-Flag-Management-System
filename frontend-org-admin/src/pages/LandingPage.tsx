import React from 'react';
import { Link } from 'react-router-dom';
import { Flag } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="logo">
          <Flag size={24} />
          FlagMaster
        </div>
        <nav className="landing-nav">
          <Link to="/login" className="btn btn-outline">Login</Link>
          <Link to="/signup" className="btn btn-primary">Sign Up</Link>
        </nav>
      </header>
      <main className="landing-hero">
        <h1>Control Your Features with Confidence</h1>
        <p>
          FlagMaster is the ultimate feature flag management system for organizations.
          Toggle features instantly, target specific users, and deploy safer.
        </p>
        <div className="hero-actions">
          <Link to="/signup" className="btn btn-primary btn-large">Get Started</Link>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
