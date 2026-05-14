import { useState, useEffect } from 'react';
import { getAllProducts, deleteProduct } from '../services/productService';
import { formatCurrency } from '../utils/formatCurrency';
import { toast } from 'react-toastify';
import ConfirmModal from '../components/common/ConfirmModal';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpts, setModalOpts] = useState({ show: false, prodId: null, prodName: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
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

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <h1 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>All Products</h1>
      
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
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {p.id}</div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.category}</td>
                  <td style={{ padding: '16px 20px', fontSize: '0.9rem', fontWeight: 600 }}>{formatCurrency(p.price)}</td>
                  <td style={{ padding: '16px 20px', fontSize: '0.85rem', color: p.stock > 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {p.stock}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <button 
                      onClick={() => confirmDelete(p)}
                      style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1rem' }}
                      title="Delete Product"
                    >
                      <i className="fas fa-trash-alt" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>No products found</div>}
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

export default AdminProducts;
