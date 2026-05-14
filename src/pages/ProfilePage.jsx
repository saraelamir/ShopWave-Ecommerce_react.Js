import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders, selectAllOrders } from '../redux/slices/ordersSlice';
import Breadcrumbs from '../components/common/Breadcrumbs';
import UserAvatar from '../components/common/UserAvatar';
import { toast } from 'react-toastify';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '' });
  
  useEffect(() => {
    if (user?.id) dispatch(fetchUserOrders(user.id));
  }, [dispatch, user]);

  const handleSave = (e) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
    toast.success('Profile updated successfully (Fake UI)');
  };

  return (
    <div className="container" style={{ padding: '32px 0 60px' }}>
      <Breadcrumbs />
      <h1 className="section-title" style={{ marginBottom: 24 }}>My Profile</h1>
      
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <div className={styles.profileCard}>
            <UserAvatar user={user} size="lg" />
            <h3 className={styles.name}>{user?.name}</h3>
            <span className={styles.role}>{user?.role}</span>
            <div className={styles.stats}>
              <div className={styles.statBox}>
                <strong>{orders.length}</strong>
                <span>Orders</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.main}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h4 className={styles.cardTitle}>Personal Information</h4>
              {!isEditing && (
                <button className="btn-outline-custom" onClick={() => setIsEditing(true)}>
                  <i className="fas fa-edit" /> Edit
                </button>
              )}
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSave} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input type="text" className={styles.input} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input type="email" className={styles.input} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className={styles.formActions}>
                  <button type="button" className="btn-outline-custom" onClick={() => { setIsEditing(false); setFormData({name: user?.name, email: user?.email}); }}>Cancel</button>
                  <button type="submit" className="btn-primary-custom">Save Changes</button>
                </div>
              </form>
            ) : (
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Full Name</span>
                  <span className={styles.infoValue}>{user?.name}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email Address</span>
                  <span className={styles.infoValue}>{user?.email}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Account Role</span>
                  <span className={styles.infoValue} style={{ textTransform: 'capitalize' }}>{user?.role}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Member Since</span>
                  <span className={styles.infoValue}>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
