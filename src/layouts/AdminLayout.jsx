import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import UserAvatar from '../components/common/UserAvatar';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link to="/admin" className={styles.sidebarLogo}>
            <i className="fas fa-shield-alt" />
            ShopWave
          </Link>
          <span className={styles.adminBadge}>Admin</span>
        </div>

        <nav className={styles.sidebarNav}>
          <div className={styles.navSection}>
            <div className={styles.navSectionTitle}>Overview</div>
            <NavLink to="/admin" end className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
              <i className="fas fa-chart-line" /> Dashboard
            </NavLink>
          </div>
          <div className={styles.navSection}>
            <div className={styles.navSectionTitle}>Management</div>
            <NavLink to="/admin/users" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
              <i className="fas fa-users" /> Users
            </NavLink>
            <NavLink to="/admin/products" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
              <i className="fas fa-box" /> Products
            </NavLink>
            <NavLink to="/admin/orders" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
              <i className="fas fa-shopping-bag" /> Orders
            </NavLink>
          </div>
          <div className={styles.navSection}>
            <div className={styles.navSectionTitle}>Other</div>
            <Link to="/" className={styles.navItem}>
              <i className="fas fa-store" /> View Store
            </Link>
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <UserAvatar user={user} size="md" />
            <div>
              <div className={styles.userName}>{user?.name}</div>
              <div className={styles.userRole}>Administrator</div>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <i className="fas fa-sign-out-alt" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={styles.content}>
        <header className={styles.topbar}>
          <span className={styles.topbarTitle}>Admin Panel</span>
          <button onClick={toggleTheme} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '1rem' }}>
            <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`} />
          </button>
        </header>
        <div className={styles.pageContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
