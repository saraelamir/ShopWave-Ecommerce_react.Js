import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { discountPercent } from '../../utils/helpers';
import styles from './ProductCard.module.css';

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className={styles.stars}>
      {[...Array(5)].map((_, i) => (
        <i key={i} className={
          i < full ? 'fas fa-star' : (i === full && half ? 'fas fa-star-half-alt' : 'far fa-star')
        } />
      ))}
    </span>
  );
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice > product.price
    ? discountPercent(product.originalPrice, product.price)
    : 0;

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.imageWrapper}>
        <img src={product.image} alt={product.title} className={styles.image}
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${product.id}/400/400`; }} />

        <div className={styles.badges}>
          {discount > 0 && <span className={styles.badgeSale}>-{discount}%</span>}
          {product.stock <= 5 && product.stock > 0 && <span className={styles.badgeNew}>Low Stock</span>}
        </div>

        <div className={styles.quickActions}>
          <button
            className={`${styles.actionBtn} ${wishlisted ? styles.wishlisted : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              wishlisted ? removeFromWishlist(product.id) : addToWishlist(product);
            }}
            title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <i className={wishlisted ? 'fas fa-heart' : 'far fa-heart'} />
          </button>
          <Link 
            to={`/products/${product.id}`} 
            className={styles.actionBtn} 
            title="View details"
            onClick={(e) => e.stopPropagation()}
          >
            <i className="fas fa-eye" />
          </Link>
        </div>
      </div>

      <div className={styles.body}>
        <span className={styles.category}>{product.category}</span>
        <Link to={`/products/${product.id}`} className={styles.title} onClick={(e) => e.stopPropagation()}>{product.title}</Link>
        <div className={styles.ratingRow}>
          <StarRating rating={product.rating} />
          <span className={styles.reviewCount}>({product.reviews?.toLocaleString()})</span>
        </div>
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatCurrency(product.price)}</span>
          {discount > 0 && <span className={styles.originalPrice}>{formatCurrency(product.originalPrice)}</span>}
        </div>
        <span className={`${styles.stock} ${product.stock === 0 ? styles.stockOut : product.stock <= 5 ? styles.stockLow : ''}`}>
          {product.stock === 0 ? 'Out of stock' : product.stock <= 5 ? `Only ${product.stock} left` : 'In Stock'}
        </span>
      </div>

      <div className={styles.footer}>
        <button
          className={styles.addToCartBtn}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product);
          }}
          disabled={product.stock === 0}
        >
          <i className="fas fa-cart-plus" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
