import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProductsBySeller, deleteProduct } from '../services/productService';
import { formatCurrency } from '../utils/formatCurrency';
import { toast } from 'react-toastify';
import ConfirmModal from '../components/common/ConfirmModal';

const SellerProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpts, setModalOpts] = useState({ show: false, prodId: null, prodName: '' });

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    if (!user?.id) return;
    try {
      const res = await getProductsBySeller(user.id);
      setProducts(res.data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (product) => {
    setModalOpts({ show: true, prodId: product.id, prodName: product.title });
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(modalOpts.prodId);
      setProducts(products.filter(p => p.id !== modalOpts.prodId));
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setModalOpts({ show: false, prodId: null, prodName: '' });
    }
  };

  if (loading) return <div>Loading your products...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="section-title" style={{ fontSize: '1.5rem', margin: 0 }}>My Products</h1>
        <Link to="/dashboard/add-product" className="btn-primary-custom" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          <i className="fas fa-plus" /> Add New
        </Link>
      </div>
      
      <div className="card-custom" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th style={{ padding: '12px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Product</th>
                <th style={{ padding: '12px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '12px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Price</th>
                <th style={{ padding: '12px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Stock</th>
                <th style={{ padding: '12px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={p.image} alt={p.title} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.title}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.category}</td>
                  <td style={{ padding: '16px 20px', fontSize: '0.9rem', fontWeight: 600 }}>{formatCurrency(p.price)}</td>
                  <td style={{ padding: '16px 20px', fontSize: '0.85rem', color: p.stock > 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {p.stock === 0 ? 'Out of Stock' : p.stock}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <Link to={`/dashboard/edit-product/${p.id}`} className="btn-outline-custom" style={{ padding: '6px 10px', fontSize: '0.8rem', marginRight: '8px' }}>
                      <i className="fas fa-edit" />
                    </Link>
                    <button 
                      onClick={() => confirmDelete(p)}
                      style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1.1rem', padding: '6px' }}
                    >
                      <i className="fas fa-trash-alt" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <i className="fas fa-box-open" style={{ fontSize: '2rem', color: 'var(--text-muted)', marginBottom: '16px' }} />
              <p style={{ color: 'var(--text-secondary)' }}>You haven't added any products yet.</p>
              <Link to="/dashboard/add-product" className="btn-primary-custom mt-2">Add Your First Product</Link>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal 
        show={modalOpts.show}
        title="Delete Product"
        message={`Are you sure you want to delete "${modalOpts.prodName}"?`}
        onConfirm={handleDelete}
        onCancel={() => setModalOpts({ show: false, prodId: null, prodName: '' })}
      />
    </div>
  );
};

export default SellerProducts;
