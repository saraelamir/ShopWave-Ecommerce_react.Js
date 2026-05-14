import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchUserOrders, selectAllOrders, selectOrdersStatus } from '../redux/slices/ordersSlice';
import { formatCurrency } from '../utils/formatCurrency';
import Breadcrumbs from '../components/common/Breadcrumbs';
import styles from './OrdersPage.module.css';

const OrdersPage = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);
  const status = useSelector(selectOrdersStatus);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserOrders(user.id));
    }
  }, [dispatch, user]);

  if (status === 'loading') return <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}><i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--primary)' }} /></div>;

  return (
    <div className="container" style={{ padding: '32px 0 60px' }}>
      <Breadcrumbs />
      <h1 className="section-title" style={{ marginBottom: 24 }}>
        <i className="fas fa-box" style={{ marginRight: 12, color: 'var(--primary)' }} />
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-box-open" />
          <h4>No orders found</h4>
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="btn-primary-custom mt-4">Start Shopping</Link>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div className={styles.headerInfo}>
                  <div className={styles.infoGroup}>
                    <span className={styles.infoLabel}>Order Placed</span>
                    <span className={styles.infoValue}>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.infoGroup}>
                    <span className={styles.infoLabel}>Total</span>
                    <span className={styles.infoValue}>{formatCurrency(order.totalPrice)}</span>
                  </div>
                  <div className={styles.infoGroup}>
                    <span className={styles.infoLabel}>Ship To</span>
                    <span className={styles.infoValue}>{order.shippingAddress?.name || user?.name}</span>
                  </div>
                </div>
                <div className={styles.headerRight}>
                  <div className={styles.infoGroup}>
                    <span className={styles.infoLabel}>Order # {order.id}</span>
                    <span className={styles.infoValue}>
                       <Link to={`/orders/${order.id}`} className={styles.detailsLink}>View Details</Link>
                    </span>
                  </div>
                </div>
              </div>
              
              <div className={styles.orderBody}>
                <h4 className={styles.statusTitle}>
                  Status: <span className={`${styles.statusBadge} ${styles[order.status]}`}>{order.status}</span>
                </h4>
                
                <div className={styles.itemsList}>
                  {order.items.map((item, idx) => (
                    <div key={idx} className={styles.itemRow}>
                      <img src={item.image} alt={item.title} className={styles.itemImage}
                        onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.productId}/80/80`; }} />
                      <div className={styles.itemDetails}>
                        <Link to={`/products/${item.productId}`} className={styles.itemTitle}>{item.title}</Link>
                        <div className={styles.itemPriceQty}>
                          <span className={styles.itemPrice}>{formatCurrency(item.price)}</span>
                          <span className={styles.itemQty}>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className={styles.itemActions}>
                        <Link to={`/products/${item.productId}`} className="btn-outline-custom" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Buy it again</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
