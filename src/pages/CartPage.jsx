import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import Breadcrumbs from '../components/common/Breadcrumbs';
import styles from './CartPage.module.css';

const CartPage = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, loading } = useCart();

  if (loading) return <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}><i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--primary)' }} /></div>;

  if (cartItems.length === 0) return (
    <div className="container empty-state" style={{ paddingTop: 80 }}>
      <i className="fas fa-shopping-cart" />
      <h4>Your cart is empty</h4>
      <p>Add some products to get started!</p>
      <Link to="/products" className="btn-primary-custom mt-4">Browse Products</Link>
    </div>
  );

  const shipping = cartTotal >= 50 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  return (
    <div className="container" style={{ padding: '32px 0 60px' }}>
      <Breadcrumbs />
      <h1 className="section-title" style={{ marginBottom: 24 }}>
        <i className="fas fa-shopping-cart" style={{ marginRight: 12, color: 'var(--primary)' }} />
        Shopping Cart <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>({cartItems.length} items)</span>
      </h1>
      <div className={styles.layout}>
        {/* Items */}
        <div className={styles.items}>
          {cartItems.map((item) => (
            <div key={item.id} className={styles.item}>
              <img src={item.image} alt={item.title} className={styles.itemImg}
                onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.productId}/100/100`; }} />
              <div className={styles.itemInfo}>
                <Link to={`/products/${item.productId}`} className={styles.itemTitle}>{item.title}</Link>
                <div className={styles.itemPrice}>{formatCurrency(item.price)}</div>
              </div>
              <div className={styles.qtyControl}>
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><i className="fas fa-minus" /></button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><i className="fas fa-plus" /></button>
              </div>
              <div className={styles.itemTotal}>{formatCurrency(item.price * item.quantity)}</div>
              <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}><i className="fas fa-trash-alt" /></button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className={styles.summary}>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryTitle}>Order Summary</h3>
            <div className={styles.summaryRow}><span>Subtotal</span><span>{formatCurrency(cartTotal)}</span></div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span style={{ color: shipping === 0 ? 'var(--success)' : '' }}>
                {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
              </span>
            </div>
            {shipping > 0 && <div className={styles.freeShipping}><i className="fas fa-truck" /> Add {formatCurrency(50 - cartTotal)} more for free shipping</div>}
            <div className={styles.summaryRow}><span>Tax (8%)</span><span>{formatCurrency(tax)}</span></div>
            <div className={styles.summaryDivider} />
            <div className={`${styles.summaryRow} ${styles.totalRow}`}><strong>Total</strong><strong>{formatCurrency(total)}</strong></div>

            <Link to="/checkout" className={styles.checkoutBtn}>
              <i className="fas fa-lock" /> Proceed to Checkout
            </Link>
            <Link to="/products" className={styles.continueBtn}>
              <i className="fas fa-arrow-left" /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
