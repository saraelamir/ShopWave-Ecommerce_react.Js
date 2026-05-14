import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addProduct } from '../services/productService';
import { generateId } from '../utils/helpers';
import { toast } from 'react-toastify';

const CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Sports', 'Books'];

const AddProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
    category: CATEGORIES[0],
    image: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newProduct = {
        id: generateId('prod'),
        sellerId: user.id,
        ...form,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : parseFloat(form.price),
        stock: parseInt(form.stock),
        rating: 0,
        reviews: 0
      };
      
      await addProduct(newProduct);
      toast.success('Product added successfully!');
      navigate('/dashboard/products');
    } catch {
      toast.error('Failed to add product');
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Add New Product</h1>
      
      <div className="card-custom" style={{ padding: '30px', maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Product Title</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Category</label>
              <select name="category" value={form.category} onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Price ($)</label>
              <input type="number" step="0.01" min="0" name="price" value={form.price} onChange={handleChange} required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Original Price ($) (Optional)</label>
              <input type="number" step="0.01" min="0" name="originalPrice" value={form.originalPrice} onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Stock Quantity</label>
              <input type="number" min="0" name="stock" value={form.stock} onChange={handleChange} required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Image URL</label>
            <input type="url" name="image" value={form.image} onChange={handleChange} required placeholder="https://example.com/image.jpg"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Description</label>
            <textarea name="description" rows="4" value={form.description} onChange={handleChange} required
              style={{ width: '100%', padding: '10px 14px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', resize: 'vertical' }} />
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button type="submit" className="btn-primary-custom" disabled={loading}>
              {loading ? 'Adding...' : 'Add Product'}
            </button>
            <button type="button" className="btn-outline-custom" onClick={() => navigate('/dashboard/products')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
