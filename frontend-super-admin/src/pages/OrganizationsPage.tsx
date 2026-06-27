import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import type { AppDispatch, RootState } from '../redux/store';
import { fetchOrgs } from '../redux/slices/orgsSlice';
import OrgForm from '../components/OrgForm';
import OrgTable from '../components/OrgTable';
import Modal from '../components/Modal';
import type { Organization } from '../types';

const OrganizationsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { organizations, loading } = useSelector((state: RootState) => state.orgs);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    dispatch(fetchOrgs());
  }, [dispatch]);

  const handleEdit = (org: Organization) => {
    setEditingOrg(org);
  };

  const handleEditDone = () => {
    setEditingOrg(null);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="flex-between">
          <div>
            <h2>Organizations</h2>
            <p className="page-description">
              Manage all organizations in the platform. Each org gets its own isolated set of feature flags.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={16} />
            New Organization
          </button>
        </div>
      </div>
      <OrgTable organizations={organizations} loading={loading} onEdit={handleEdit} />

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Organization"
      >
        <OrgForm isModal onSuccess={handleCreateSuccess} onCancel={() => setShowCreateModal(false)} />
      </Modal>

      <Modal
        isOpen={!!editingOrg}
        onClose={handleEditDone}
        title="Edit Organization"
      >
        {editingOrg && (
          <OrgForm
            editingOrg={editingOrg}
            isModal
            onSuccess={handleEditDone}
            onCancel={handleEditDone}
          />
        )}
      </Modal>
    </div>
  );
};

export default OrganizationsPage;