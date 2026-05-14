import { useState, useEffect } from 'react';
import { getAllOrders } from '../services/orderService';
import { getAllUsers } from '../services/userService';
import { getAllProducts } from '../services/productService';
import { formatCurrency } from '../utils/formatCurrency';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, users: 0, products: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, usersRes, prodsRes] = await Promise.all([
          getAllOrders(), getAllUsers(), getAllProducts()
        ]);
        
        const orders = ordersRes.data;
        const rev = orders.reduce((sum, o) => sum + o.totalPrice, 0);
        
        setStats({
          orders: orders.length,
          revenue: rev,
          users: usersRes.data.length,
          products: prodsRes.data.length
        });
        
        setRecentOrders(orders.slice(-5).reverse());
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Dashboard Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {[
          { label: 'Total Revenue', value: formatCurrency(stats.revenue), icon: 'fas fa-dollar-sign', color: '#10b981' },
          { label: 'Total Orders', value: stats.orders, icon: 'fas fa-shopping-bag', color: '#3b82f6' },
          { label: 'Total Users', value: stats.users, icon: 'fas fa-users', color: '#8b5cf6' },
          { label: 'Total Products', value: stats.products, icon: 'fas fa-box', color: '#f59e0b' }
        ].map((s, i) => (
          <div key={i} className="card-custom" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${s.color}20`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
              <i className={s.icon} />
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-custom" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', fontWeight: 700 }}>Recent Orders</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th style={{ padding: '12px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Order ID</th>
                <th style={{ padding: '12px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '12px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Total</th>
                <th style={{ padding: '12px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 20px', fontSize: '0.9rem', fontWeight: 600 }}>#{o.id}</td>
                  <td style={{ padding: '16px 20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '16px 20px', fontSize: '0.9rem', fontWeight: 600 }}>{formatCurrency(o.totalPrice)}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span className={`badge-${o.status === 'delivered' ? 'success' : o.status === 'cancelled' ? 'danger' : 'warning'}`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentOrders.length === 0 && <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>No recent orders</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
