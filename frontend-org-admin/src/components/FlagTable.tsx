import React from 'react';
import { useDispatch } from 'react-redux';
import { Flag, Trash2, Pencil } from 'lucide-react';
import type { AppDispatch } from '../redux/store';
import { toggleFlag, deleteFlag } from '../redux/slices/flagsSlice';
import type { FeatureFlag } from '../types';

interface FlagTableProps {
  flags: FeatureFlag[];
  loading: boolean;
  onEdit?: (flag: FeatureFlag) => void;
}

const FlagTable: React.FC<FlagTableProps> = ({ flags, loading, onEdit }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleToggle = (flag: FeatureFlag) => {
    dispatch(toggleFlag({ id: flag.id, enabled: !flag.enabled }));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this flag?')) {
      dispatch(deleteFlag(id));
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading feature flags...</div>;
  }

  if (flags.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">
          <Flag size={24} />
        </span>
        <p>No feature flags yet. Create your first one above.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Feature Key</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {flags.map((flag) => (
            <tr key={flag.id}>
              <td>
                <code className="feature-key">{flag.feature_key}</code>
              </td>
              <td>
                <button
                  className={`toggle-btn ${flag.enabled ? 'toggle-on' : 'toggle-off'}`}
                  onClick={() => handleToggle(flag)}
                  title={flag.enabled ? 'Click to disable' : 'Click to enable'}
                >
                  <span className="toggle-track">
                    <span className="toggle-thumb" />
                  </span>
                  <span className="toggle-label">
                    {flag.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </button>
              </td>
              <td>{new Date(flag.created_at).toLocaleDateString()}</td>
              <td>
                {onEdit && (
                  <button
                    className="btn-edit"
                    onClick={() => onEdit(flag)}
                    title="Edit flag"
                  >
                    <Pencil size={16} />
                  </button>
                )}
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(flag.id)}
                  title="Delete flag"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlagTable;