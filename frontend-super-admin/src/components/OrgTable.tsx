import React from 'react';
import { Building2, Edit2, Copy } from 'lucide-react';
import type { Organization } from '../types';

interface OrgTableProps {
  organizations: Organization[];
  loading: boolean;
  onEdit?: (org: Organization) => void;
}

const OrgTable: React.FC<OrgTableProps> = ({ organizations, loading, onEdit }) => {
  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
  };

  if (loading) {
    return <div className="loading-spinner">Loading organizations...</div>;
  }

  if (organizations.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">
          <Building2 size={24} />
        </span>
        <p>No organizations yet. Create your first one above.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((org) => (
            <tr key={org.id}>
              <td className="org-name">{org.name}</td>
              <td>
                <code className="uuid">{org.id}</code>
                <button
                  className="btn-copy-id"
                  onClick={() => handleCopyId(org.id)}
                  title="Copy ID to clipboard"
                >
                  <Copy size={12} />
                </button>
              </td>
              <td>{new Date(org.created_at).toLocaleDateString()}</td>
              <td>
                {onEdit && (
                  <button
                    className="btn-edit"
                    onClick={() => onEdit(org)}
                    title="Edit organization"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrgTable;