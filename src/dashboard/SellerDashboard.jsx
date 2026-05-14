import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProductsBySeller } from '../services/productService';
import { formatCurrency } from '../utils/formatCurrency';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: 0, outOfStock: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getProductsBySeller(user.id);
        const products = res.data;
        setStats({
          products: products.length,
          outOfStock: products.filter(p => p.stock === 0).length
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchStats();
  }, [user]);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="section-title" style={{ fontSize: '1.5rem', margin: 0 }}>Seller Dashboard</h1>
        <Link to="/dashboard/add-product" className="btn-primary-custom" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          <i className="fas fa-plus" /> Add New Product
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="card-custom" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '8px' }}><i className="fas fa-box-open" /></div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.products}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600 }}>Active Products</div>
        </div>
        
        <div className="card-custom" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', color: 'var(--danger)', marginBottom: '8px' }}><i className="fas fa-exclamation-triangle" /></div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.outOfStock}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600 }}>Out of Stock</div>
        </div>
      </div>
      
      <div className="card-custom" style={{ padding: '30px', textAlign: 'center', background: 'var(--bg-tertiary)' }}>
        <i className="fas fa-store" style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '16px' }} />
        <h3>Manage Your Store</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 20px' }}>Add new products, update inventory, and watch your sales grow.</p>
        <Link to="/dashboard/products" className="btn-outline-custom">View My Products</Link>
      </div>
    </div>
  );
};

export default SellerDashboard;
