import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import Breadcrumbs from '../components/common/Breadcrumbs';
import styles from './WishlistPage.module.css';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  if (loading) return <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}><i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--primary)' }} /></div>;

  return (
    <div className="container" style={{ padding: '32px 0 60px' }}>
      <Breadcrumbs />
      <h1 className="section-title" style={{ marginBottom: 8 }}>
        <i className="fas fa-heart" style={{ marginRight: 12, color: '#ef4444' }} />My Wishlist
      </h1>
      <p className="section-subtitle">{wishlistItems.length} saved items</p>

      {wishlistItems.length === 0 ? (
        <div className="empty-state">
          <i className="far fa-heart" />
          <h4>Your wishlist is empty</h4>
          <p>Save products you love to view them later</p>
          <Link to="/products" className="btn-primary-custom mt-4">Discover Products</Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {wishlistItems.map((item) => (
            <div key={item.id} className={styles.card}>
              <button className={styles.removeBtn} onClick={() => removeFromWishlist(item.productId)} title="Remove">
                <i className="fas fa-times" />
              </button>
              <Link to={`/products/${item.productId}`} className={styles.imageWrapper}>
                <img src={item.image} alt={item.title}
                  onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.productId}/300/300`; }} />
              </Link>
              <div className={styles.cardBody}>
                <span className={styles.category}>{item.category}</span>
                <Link to={`/products/${item.productId}`} className={styles.title}>{item.title}</Link>
                <div className={styles.price}>{formatCurrency(item.price)}</div>
                <button className={styles.cartBtn} onClick={() => { addToCart({ id: item.productId, ...item }); }}>
                  <i className="fas fa-cart-plus" /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
