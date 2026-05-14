import { useLocation, Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';
import styles from './OrderSuccessPage.module.css';

const OrderSuccessPage = () => {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.iconCircle}><i className="fas fa-check" /></div>
        <h1 className={styles.title}>Order Confirmed!</h1>
        <p className={styles.subtitle}>Thank you for your purchase. Your order has been placed successfully.</p>
        {order && (
          <div className={styles.orderInfo}>
            <div className={styles.orderRow}><span>Order ID</span><strong>#{order.id}</strong></div>
            <div className={styles.orderRow}><span>Total</span><strong>{formatCurrency(order.totalPrice)}</strong></div>
            <div className={styles.orderRow}><span>Payment</span><strong>{order.paymentMethod}</strong></div>
            <div className={styles.orderRow}><span>Status</span><span className="badge-success">Processing</span></div>
            <div className={styles.orderRow}><span>Delivery to</span><strong>{order.shippingAddress?.address}</strong></div>
          </div>
        )}
        <div className={styles.steps}>
          {['Order Placed', 'Processing', 'Shipped', 'Delivered'].map((s, i) => (
            <div key={s} className={`${styles.stepItem} ${i === 0 ? styles.stepActive : ''}`}>
              <div className={styles.stepDot}>{i === 0 ? <i className="fas fa-check" /> : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>
        <div className={styles.actions}>
          <Link to="/orders" className="btn-primary-custom"><i className="fas fa-box" /> View My Orders</Link>
          <Link to="/" className="btn-outline-custom"><i className="fas fa-home" /> Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
