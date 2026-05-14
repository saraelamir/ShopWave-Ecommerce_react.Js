import { Link, useLocation } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';

const labels = {
  products: 'Products',
  cart: 'Cart',
  wishlist: 'Wishlist',
  checkout: 'Checkout',
  orders: 'My Orders',
  profile: 'Profile',
  admin: 'Admin',
  dashboard: 'Dashboard',
  users: 'Users',
  'order-success': 'Order Confirmed',
};

const Breadcrumbs = ({ productTitle }) => {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);

  const crumbs = [{ label: 'Home', path: '/' }];
  let built = '';
  parts.forEach((part) => {
    built += `/${part}`;
    const label = labels[part] || productTitle || decodeURIComponent(part);
    crumbs.push({ label, path: built });
  });

  if (crumbs.length <= 1) return null;

  return (
    <nav className={styles.breadcrumbs}>
      {crumbs.map((crumb, idx) => (
        <span key={idx} className={styles.crumb}>
          {idx < crumbs.length - 1
            ? <><Link to={crumb.path} className={styles.link}>{crumb.label}</Link><i className={`fas fa-chevron-right ${styles.sep}`} /></>
            : <span className={styles.current}>{crumb.label}</span>
          }
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
