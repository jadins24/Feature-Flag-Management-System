import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { createOrg, updateOrg } from '../redux/slices/orgsSlice';
import type { Organization } from '../types';

interface OrgFormProps {
  editingOrg?: Organization | null;
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

const OrgForm: React.FC<OrgFormProps> = ({ editingOrg, onSuccess, onCancel, isModal = false }) => {
  const [name, setName] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.orgs);

  useEffect(() => {
    if (editingOrg) {
      setName(editingOrg.name);
    } else {
      setName('');
    }
  }, [editingOrg]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingOrg) {
      const result = await dispatch(updateOrg({ id: editingOrg.id, name: name.trim() }));
      if (updateOrg.fulfilled.match(result)) {
        setName('');
        onSuccess?.();
      }
    } else {
      const result = await dispatch(createOrg(name.trim()));
      if (createOrg.fulfilled.match(result)) {
        setName('');
        onSuccess?.();
      }
    }
  };

  if (isModal) {
    return (
      <>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="org-name-input">Organization Name</label>
            <input
              id="org-name-input"
              type="text"
              placeholder="Organization name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              disabled={loading}
              autoFocus
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !name.trim()}
            >
              {loading ? (editingOrg ? 'Updating...' : 'Creating...') : editingOrg ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </>
    );
  }

  return (
    <form className="org-form" onSubmit={handleSubmit}>
      <h3 className="form-title">{editingOrg ? 'Edit Organization' : 'Create New Organization'}</h3>
      {error && <div className="form-error">{error}</div>}
      <div className="form-row">
        <input
          id="org-name-input"
          type="text"
          placeholder="Organization name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
          disabled={loading}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !name.trim()}
        >
          {loading ? (editingOrg ? 'Updating...' : 'Creating...') : editingOrg ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default OrgForm;