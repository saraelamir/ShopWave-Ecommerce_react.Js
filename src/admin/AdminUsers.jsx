import { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, changeUserRole } from '../services/userService';
import { toast } from 'react-toastify';
import ConfirmModal from '../components/common/ConfirmModal';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpts, setModalOpts] = useState({ show: false, userId: null, userName: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await changeUserRole(id, newRole);
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
      toast.success('User role updated');
    } catch {
      toast.error('Failed to update role');
    }
  };

  const confirmDelete = (user) => {
    setModalOpts({ show: true, userId: user.id, userName: user.name });
  };

  const handleDelete = async () => {
    try {
      await deleteUser(modalOpts.userId);
      setUsers(users.filter(u => u.id !== modalOpts.userId));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setModalOpts({ show: false, userId: null, userName: '' });
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <h1 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>User Management</h1>
      
      <div className="card-custom" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th style={{ padding: '12px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>User</th>
                <th style={{ padding: '12px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Email</th>
                <th style={{ padding: '12px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Role</th>
                <th style={{ padding: '12px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={u.avatar} alt={u.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</span>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <select 
                      value={u.role} 
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
                      disabled={u.email === 'admin@shop.com'} // Prevent changing main admin
                    >
                      <option value="customer">Customer</option>
                      <option value="seller">Seller</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <button 
                      onClick={() => confirmDelete(u)}
                      disabled={u.email === 'admin@shop.com'}
                      style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: u.email === 'admin@shop.com' ? 'not-allowed' : 'pointer', fontSize: '1rem', opacity: u.email === 'admin@shop.com' ? 0.3 : 1 }}
                      title="Delete User"
                    >
                      <i className="fas fa-trash-alt" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <ConfirmModal 
        show={modalOpts.show}
        title="Delete User"
        message={`Are you sure you want to delete ${modalOpts.userName}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setModalOpts({ show: false, userId: null, userName: '' })}
      />
    </div>
  );
};

export default AdminUsers;
