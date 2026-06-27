import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { createFlag, updateFlag } from '../redux/slices/flagsSlice';
import type { FeatureFlag } from '../types';

interface FlagFormProps {
  editingFlag?: FeatureFlag | null;
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

const FlagForm: React.FC<FlagFormProps> = ({ editingFlag, onSuccess, onCancel, isModal = false }) => {
  const [featureKey, setFeatureKey] = useState(editingFlag?.feature_key || '');
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.flags);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!featureKey.trim()) return;

    if (editingFlag) {
      const result = await dispatch(updateFlag({ id: editingFlag.id, feature_key: featureKey.trim() }));
      if (updateFlag.fulfilled.match(result)) {
        setFeatureKey('');
        onSuccess?.();
      }
    } else {
      const result = await dispatch(createFlag(featureKey.trim()));
      if (createFlag.fulfilled.match(result)) {
        setFeatureKey('');
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
            <label htmlFor="feature-key-input">Feature Key</label>
            <input
              id="feature-key-input"
              type="text"
              placeholder="e.g. dark_mode, new_checkout, beta_feature"
              value={featureKey}
              onChange={(e) => setFeatureKey(e.target.value)}
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
              disabled={loading || !featureKey.trim()}
            >
              {loading ? (editingFlag ? 'Updating...' : 'Creating...') : editingFlag ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </>
    );
  }

  return (
    <form className="org-form" onSubmit={handleSubmit}>
      <h3 className="form-title">{editingFlag ? 'Edit Feature Flag' : 'Create New Feature Flag'}</h3>
      {error && <div className="form-error">{error}</div>}
      <div className="form-row">
        <input
          id="feature-key-input"
          type="text"
          placeholder="e.g. dark_mode, new_checkout, beta_feature"
          value={featureKey}
          onChange={(e) => setFeatureKey(e.target.value)}
          className="form-input"
          disabled={loading}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !featureKey.trim()}
        >
          {loading ? (editingFlag ? 'Updating...' : 'Creating...') : editingFlag ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default FlagForm;