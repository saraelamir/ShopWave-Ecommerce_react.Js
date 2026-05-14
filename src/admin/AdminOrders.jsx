import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../services/orderService';
import { formatCurrency } from '../utils/formatCurrency';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data.reverse());
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
      toast.success('Order status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h1 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>All Orders</h1>
      
      <div className="card-custom" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th style={{ padding: '12px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Order ID</th>
                <th style={{ padding: '12px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '12px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Customer</th>
                <th style={{ padding: '12px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Total</th>
                <th style={{ padding: '12px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 20px', fontSize: '0.9rem', fontWeight: 600 }}>#{o.id}</td>
                  <td style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '16px 20px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{o.shippingAddress?.name || 'Unknown'}</td>
                  <td style={{ padding: '16px 20px', fontSize: '0.9rem', fontWeight: 600 }}>{formatCurrency(o.totalPrice)}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <select 
                      value={o.status} 
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      style={{ 
                        padding: '6px 10px', borderRadius: '50px', border: '1px solid var(--border-color)', 
                        background: o.status === 'delivered' ? '#d1fae5' : o.status === 'processing' ? '#fef3c7' : o.status === 'shipped' ? '#dbeafe' : '#fee2e2', 
                        color: o.status === 'delivered' ? '#065f46' : o.status === 'processing' ? '#92400e' : o.status === 'shipped' ? '#1e40af' : '#991b1b', 
                        fontSize: '0.8rem', fontWeight: 700, outline: 'none', cursor: 'pointer' 
                      }}
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>No orders found</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
