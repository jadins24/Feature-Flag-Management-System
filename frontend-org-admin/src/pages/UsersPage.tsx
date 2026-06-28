import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Copy } from 'lucide-react';
import type { AppDispatch, RootState } from '../redux/store';
import { fetchUsers } from '../redux/slices/usersSlice';
import Modal from '../components/Modal';
import UserForm from '../components/UserForm';

const UsersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: RootState) => state.users);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    dispatch(fetchUsers());
  };

  if (loading && users.length === 0) {
    return (
      <div className="page-container">
        <header className="page-header">
          <h2>Users</h2>
          <p>Loading...</p>
        </header>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="flex-between">
          <div>
            <h2>Users</h2>
            <p>Manage end users in your organization</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={16} />
            New User
          </button>
        </div>
      </header>

      {error && <div className="form-error">{error}</div>}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <span className="email-cell">{user.email}</span>
                </td>
                <td>
                  <span style={{ textTransform: 'capitalize' }}>{user.role}</span>
                </td>
                <td>
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td>
                  <button
                    className="btn-icon"
                    onClick={() => copyToClipboard(user.id)}
                    title="Copy User ID"
                  >
                    <Copy size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New User"
      >
        <UserForm isModal onSuccess={handleCreateSuccess} onCancel={() => setShowCreateModal(false)} />
      </Modal>
    </div>
  );
};

export default UsersPage;