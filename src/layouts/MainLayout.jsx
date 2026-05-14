import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { useDebounce } from '../hooks/useDebounce';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, selectAllProducts } from '../redux/slices/productsSlice';
import UserAvatar from '../components/common/UserAvatar';
import styles from './MainLayout.module.css';

const Navbar = () => {
  const { user, logout, isAdmin, isSeller } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);

  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const dropdownRef = useRef(null);

  const suggestions = debouncedQuery.length > 1
    ? products.filter((p) =>
        p.title.toLowerCase().includes(debouncedQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(query));
    navigate('/products');
    setShowSuggestions(false);
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navInner}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <i className="fas fa-shopping-bag" />
          Shop<span>Wave</span>
        </Link>

        {/* Search */}
        <form className={styles.searchBar} onSubmit={handleSearch}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search products, categories..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          <i className={`fas fa-search ${styles.searchIcon}`} />
          {showSuggestions && suggestions.length > 0 && (
            <div className={styles.suggestions}>
              {suggestions.map((p) => (
                <div
                  key={p.id}
                  className={styles.suggestionItem}
                  onMouseDown={() => { navigate(`/products/${p.id}`); setQuery(''); }}
                >
                  <i className="fas fa-search" style={{ color: 'var(--text-muted)' }} />
                  {p.title}
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Actions */}
        <div className={styles.navActions}>
          {/* Theme toggle */}
          <button className={styles.themeBtn} onClick={toggleTheme} title="Toggle theme">
            <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`} />
          </button>

          {/* Wishlist */}
          <Link to="/wishlist" className={styles.iconBtn} title="Wishlist">
            <i className="fas fa-heart" />
            {wishlistCount > 0 && <span className={styles.badge}>{wishlistCount}</span>}
          </Link>

          {/* Cart */}
          <Link to="/cart" className={styles.iconBtn} title="Cart">
            <i className="fas fa-shopping-cart" />
            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
          </Link>

          {/* User menu or auth buttons */}
          {user ? (
            <div className={styles.userMenu} ref={dropdownRef}>
              <button className={styles.userBtn} onClick={() => setShowDropdown((v) => !v)}>
                <UserAvatar user={user} size="sm" />
                <span className="d-none d-md-inline">{user.name.split(' ')[0]}</span>
                <i className="fas fa-chevron-down" style={{ fontSize: '0.7rem' }} />
              </button>
              {showDropdown && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <p>Signed in as</p>
                    <strong>{user.name}</strong>
                    <p style={{ marginTop: 2 }}>{user.email}</p>
                  </div>
                  <Link to="/profile" className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                    <i className="fas fa-user" /> Profile
                  </Link>
                  <Link to="/orders" className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                    <i className="fas fa-box" /> My Orders
                  </Link>
                  {isAdmin() && (
                    <Link to="/admin" className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                      <i className="fas fa-shield-alt" /> Admin Panel
                    </Link>
                  )}
                  {isSeller() && (
                    <Link to="/dashboard" className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                      <i className="fas fa-store" /> Seller Dashboard
                    </Link>
                  )}
                  <div className={styles.dropdownDivider} />
                  <button className={`${styles.dropdownItem} ${styles.danger}`} onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authBtns}>
              <Link to="/login" className={styles.btnLogin}>Login</Link>
              <Link to="/register" className={styles.btnRegister}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.footerGrid}>
      <div className={styles.footerBrand}>
        <Link to="/" style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)', textDecoration: 'none' }}>
          Shop<span style={{ color: 'var(--accent)' }}>Wave</span>
        </Link>
        <p>Your premium online shopping destination. Quality products, competitive prices, and outstanding service delivered right to your door.</p>
        <div className={styles.socialLinks} style={{ marginTop: 16 }}>
          <a href="#"><i className="fab fa-facebook" /></a>
          <a href="#"><i className="fab fa-twitter" /></a>
          <a href="#"><i className="fab fa-instagram" /></a>
          <a href="#"><i className="fab fa-youtube" /></a>
        </div>
      </div>
      <div className={styles.footerCol}>
        <h6>Shop</h6>
        <Link to="/products">All Products</Link>
        <Link to="/products">Electronics</Link>
        <Link to="/products">Fashion</Link>
        <Link to="/products">Home & Garden</Link>
        <Link to="/products">Sports</Link>
      </div>
      <div className={styles.footerCol}>
        <h6>Account</h6>
        <Link to="/profile">My Profile</Link>
        <Link to="/orders">My Orders</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/cart">Cart</Link>
      </div>
      <div className={styles.footerCol}>
        <h6>Support</h6>
        <a href="#">Help Center</a>
        <a href="#">Shipping Info</a>
        <a href="#">Returns</a>
        <a href="#">Contact Us</a>
        <a href="#">Privacy Policy</a>
      </div>
    </div>
    <div className={styles.footerBottom}>
      <span>© 2024 ShopWave. All rights reserved.</span>
      <div className={styles.socialLinks}>
        <a href="#"><i className="fas fa-credit-card" /></a>
        <a href="#"><i className="fab fa-paypal" /></a>
        <a href="#"><i className="fas fa-lock" /> Secure</a>
      </div>
    </div>
  </footer>
);

const MainLayout = () => (
  <>
    <Navbar />
    <main className="page-wrapper">
      <Outlet />
    </main>
    <Footer />
  </>
);

export default MainLayout;
