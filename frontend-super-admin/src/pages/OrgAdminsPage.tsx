import React from 'react';
import { Users } from 'lucide-react';

const OrgAdminsPage: React.FC = () => {
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
};

export default OrgAdminsPage;