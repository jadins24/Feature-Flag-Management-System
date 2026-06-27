import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import type { AppDispatch, RootState } from '../redux/store';
import { fetchFlags } from '../redux/slices/flagsSlice';
import FlagTable from '../components/FlagTable';
import Modal from '../components/Modal';
import FlagForm from '../components/FlagForm';
import type { FeatureFlag } from '../types';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { flags, loading } = useSelector((state: RootState) => state.flags);
  const [editingFlag, setEditingFlag] = React.useState<FeatureFlag | null>(null);
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  useEffect(() => {
    dispatch(fetchFlags());
  }, [dispatch]);

  const handleEdit = (flag: FeatureFlag) => {
    setEditingFlag(flag);
  };

  const handleEditDone = () => {
    setEditingFlag(null);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="flex-between">
          <div>
            <h2>Feature Flags</h2>
            <p>Manage your organization's feature flags here.</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={16} />
            New Flag
          </button>
        </div>
      </header>

      <FlagTable flags={flags} loading={loading} onEdit={handleEdit} />

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Feature Flag"
      >
        <FlagForm isModal onSuccess={handleCreateSuccess} onCancel={() => setShowCreateModal(false)} />
      </Modal>

      <Modal
        isOpen={!!editingFlag}
        onClose={handleEditDone}
        title="Edit Feature Flag"
      >
        {editingFlag && (
          <FlagForm editingFlag={editingFlag} isModal onSuccess={handleEditDone} onCancel={handleEditDone} />
        )}
      </Modal>
    </div>
  );
};

export default DashboardPage;