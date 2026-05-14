import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import UserAvatar from '../components/common/UserAvatar';
import styles from './AdminLayout.module.css';

const SellerLayout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link to="/dashboard" className={styles.sidebarLogo}>
            <i className="fas fa-store" /> ShopWave
          </Link>
          <span className={styles.adminBadge} style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>Seller</span>
        </div>
        <nav className={styles.sidebarNav}>
          <div className={styles.navSection}>
            <div className={styles.navSectionTitle}>Overview</div>
            <NavLink to="/dashboard" end className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
              <i className="fas fa-chart-bar" /> Dashboard
            </NavLink>
          </div>
          <div className={styles.navSection}>
            <div className={styles.navSectionTitle}>Products</div>
            <NavLink to="/dashboard/products" end className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
              <i className="fas fa-boxes" /> My Products
            </NavLink>
            <NavLink to="/dashboard/products/new" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
              <i className="fas fa-plus-circle" /> Add Product
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
              <div className={styles.userRole}>Seller</div>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <i className="fas fa-sign-out-alt" /> Sign Out
          </button>
        </div>
      </aside>
      <div className={styles.content}>
        <header className={styles.topbar}>
          <span className={styles.topbarTitle}>Seller Dashboard</span>
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

export default SellerLayout;
