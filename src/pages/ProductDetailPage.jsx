import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectAllProducts, selectProductsStatus } from '../redux/slices/productsSlice';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { formatCurrency } from '../utils/formatCurrency';
import { discountPercent } from '../utils/helpers';
import ProductCard from '../components/product/ProductCard';
import Breadcrumbs from '../components/common/Breadcrumbs';
import ScrollToTop from '../components/common/ScrollToTop';
import { toast } from 'react-toastify';
import styles from './ProductDetailPage.module.css';

const StarRating = ({ rating, reviews }) => (
  <div className={styles.rating}>
    {[...Array(5)].map((_, i) => (
      <i key={i} className={`${i < Math.floor(rating) ? 'fas' : 'far'} fa-star ${styles.star}`} />
    ))}
    <span className={styles.ratingNum}>{rating}</span>
    <span className={styles.reviewCount}>({reviews?.toLocaleString()} reviews)</span>
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const { addToRecentlyViewed, recentlyViewed } = useRecentlyViewed();
  const [qty, setQty] = useState(1);

  useEffect(() => { if (status === 'idle') dispatch(fetchProducts()); }, [dispatch, status]);

  const product = products.find((p) => p.id === id);

  useEffect(() => {
    if (product) addToRecentlyViewed(product);
  }, [product?.id]);

  if (status === 'loading') return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div className="row g-4">
        <div className="col-md-5"><div className="skeleton" style={{ aspectRatio: '1/1', borderRadius: 16 }} /></div>
        <div className="col-md-7">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton mb-3" style={{ height: 20, width: `${80 - i * 10}%`, borderRadius: 8 }} />)}
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="container empty-state"><i className="fas fa-box-open" /><h4>Product not found</h4><Link to="/products" className="btn-primary-custom mt-3">Browse Products</Link></div>
  );

  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice > product.price ? discountPercent(product.originalPrice, product.price) : 0;
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  return (
    <div className="container" style={{ padding: '32px 0 60px' }}>
      <Breadcrumbs productTitle={product.title} />

      <div className={styles.productLayout}>
        {/* Image */}
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            {discount > 0 && <div className={styles.discountBadge}>-{discount}%</div>}
            <img src={product.image} alt={product.title}
              onError={(e) => { e.target.src = `https://picsum.photos/seed/${product.id}/500/500`; }} />
          </div>
        </div>

        {/* Info */}
        <div className={styles.infoSection}>
          <div className={styles.categoryTag}>{product.category}</div>
          <h1 className={styles.title}>{product.title}</h1>

          <StarRating rating={product.rating} reviews={product.reviews} />

          <div className={styles.priceBlock}>
            <span className={styles.price}>{formatCurrency(product.price)}</span>
            {discount > 0 && <>
              <span className={styles.originalPrice}>{formatCurrency(product.originalPrice)}</span>
              <span className={styles.saveBadge}>Save {formatCurrency(product.originalPrice - product.price)}</span>
            </>}
          </div>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.stockInfo}>
            <i className={`fas ${product.stock > 0 ? 'fa-check-circle' : 'fa-times-circle'}`}
              style={{ color: product.stock > 0 ? 'var(--success)' : 'var(--danger)' }} />
            {product.stock > 5 ? 'In Stock'
              : product.stock > 0 ? `Only ${product.stock} left in stock`
              : 'Out of Stock'}
          </div>

          <div className={styles.qtyRow}>
            <label className={styles.qtyLabel}>Quantity:</label>
            <div className={styles.qtyControl}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}><i className="fas fa-minus" /></button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}><i className="fas fa-plus" /></button>
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.addToCartBtn} onClick={handleAddToCart} disabled={product.stock === 0}>
              <i className="fas fa-cart-plus" /> Add to Cart
            </button>
            <button className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlisted : ''}`}
              onClick={() => wishlisted ? removeFromWishlist(product.id) : addToWishlist(product)}>
              <i className={wishlisted ? 'fas fa-heart' : 'far fa-heart'} />
              {wishlisted ? 'Wishlisted' : 'Wishlist'}
            </button>
          </div>

          <div className={styles.features}>
            {[
              { icon: 'fas fa-shipping-fast', label: 'Free Shipping', sub: 'On orders over $50' },
              { icon: 'fas fa-undo', label: 'Easy Returns', sub: '30-day return policy' },
              { icon: 'fas fa-shield-alt', label: 'Secure Payment', sub: '100% protected' },
            ].map((f) => (
              <div key={f.label} className={styles.featureItem}>
                <i className={f.icon} />
                <div><strong>{f.label}</strong><p>{f.sub}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section style={{ marginTop: 60 }}>
          <h2 className="section-title" style={{ marginBottom: 24 }}>Related Products</h2>
          <div className="row g-3">
            {related.map((p) => <div key={p.id} className="col-6 col-md-3"><ProductCard product={p} /></div>)}
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {recentlyViewed.filter((p) => p.id !== product.id).length > 0 && (
        <section style={{ marginTop: 60 }}>
          <h2 className="section-title" style={{ marginBottom: 24 }}>Recently Viewed</h2>
          <div className="row g-3">
            {recentlyViewed.filter((p) => p.id !== product.id).slice(0, 4).map((p) => (
              <div key={p.id} className="col-6 col-md-3"><ProductCard product={p} /></div>
            ))}
          </div>
        </section>
      )}

      <ScrollToTop />
    </div>
  );
};

export default ProductDetailPage;
