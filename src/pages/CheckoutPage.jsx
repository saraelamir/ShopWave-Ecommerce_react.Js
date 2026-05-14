import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import { placeOrder } from '../redux/slices/ordersSlice';
import { formatCurrency } from '../utils/formatCurrency';
import { generateId } from '../utils/helpers';
import Breadcrumbs from '../components/common/Breadcrumbs';
import styles from './CheckoutPage.module.css';

const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash on Delivery', icon: 'fas fa-money-bill-wave', desc: 'Pay when your order arrives' },
  { id: 'credit', label: 'Credit Card', icon: 'fas fa-credit-card', desc: 'Visa, Mastercard, Amex (UI demo)' },
  { id: 'vodafone', label: 'Vodafone Cash', icon: 'fas fa-mobile-alt', desc: 'Mobile wallet payment' },
  { id: 'paypal', label: 'PayPal', icon: 'fab fa-paypal', desc: 'Fast, secure PayPal checkout (UI demo)' },
];

const STEPS = ['Shipping', 'Payment', 'Confirm'];

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: '', address: '' });
  const [payment, setPayment] = useState('cash');
  const [errors, setErrors] = useState({});

  const shipping = cartTotal >= 50 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (!form.address.trim()) e.address = 'Address is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validate()) return;
    setStep((s) => s + 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    const order = {
      id: generateId('ord'),
      userId: user.id,
      items: cartItems.map((i) => ({ productId: i.productId, title: i.title, price: i.price, quantity: i.quantity, image: i.image })),
      totalPrice: parseFloat(total.toFixed(2)),
      paymentMethod: PAYMENT_METHODS.find((m) => m.id === payment)?.label,
      status: 'processing',
      shippingAddress: form,
      createdAt: new Date().toISOString(),
    };
    try {
      await dispatch(placeOrder(order)).unwrap();
      await clearCart();
      navigate('/order-success', { state: { order } });
    } catch { setLoading(false); }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container" style={{ padding: '32px 0 60px' }}>
      <Breadcrumbs />
      <h1 className="section-title" style={{ marginBottom: 28 }}>Checkout</h1>

      {/* Step indicator */}
      <div className={styles.stepper}>
        {STEPS.map((s, i) => (
          <div key={s} className={styles.stepItem}>
            <div className={`${styles.stepCircle} ${i <= step ? styles.stepActive : ''} ${i < step ? styles.stepDone : ''}`}>
              {i < step ? <i className="fas fa-check" /> : i + 1}
            </div>
            <span className={`${styles.stepLabel} ${i === step ? styles.stepLabelActive : ''}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${i < step ? styles.stepLineDone : ''}`} />}
          </div>
        ))}
      </div>

      <div className={styles.layout}>
        <div className={styles.main}>
          {/* Step 0 — Shipping */}
          {step === 0 && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}><i className="fas fa-map-marker-alt" /> Shipping Information</h3>
              {['name', 'phone', 'address'].map((field) => (
                <div key={field} className={styles.formGroup}>
                  <label className={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}{field === 'address' ? ' / Full Delivery Address' : ''}</label>
                  {field === 'address'
                    ? <textarea className={`${styles.input} ${errors[field] ? styles.inputError : ''}`} rows={3}
                        value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                        placeholder="Street, City, State, ZIP" />
                    : <input type={field === 'phone' ? 'tel' : 'text'} className={`${styles.input} ${errors[field] ? styles.inputError : ''}`}
                        value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                        placeholder={field === 'phone' ? '+1 (555) 000-0000' : 'Your full name'} />
                  }
                  {errors[field] && <span className={styles.errorText}><i className="fas fa-exclamation-circle" /> {errors[field]}</span>}
                </div>
              ))}
            </div>
          )}

          {/* Step 1 — Payment */}
          {step === 1 && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}><i className="fas fa-credit-card" /> Payment Method</h3>
              <div className={styles.paymentMethods}>
                {PAYMENT_METHODS.map((m) => (
                  <label key={m.id} className={`${styles.paymentOption} ${payment === m.id ? styles.paymentActive : ''}`}>
                    <input type="radio" name="payment" value={m.id} checked={payment === m.id} onChange={() => setPayment(m.id)} style={{ display: 'none' }} />
                    <div className={styles.paymentIcon}><i className={m.icon} /></div>
                    <div className={styles.paymentInfo}>
                      <strong>{m.label}</strong>
                      <span>{m.desc}</span>
                    </div>
                    {payment === m.id && <i className="fas fa-check-circle" style={{ color: 'var(--primary)', marginLeft: 'auto', fontSize: '1.2rem' }} />}
                  </label>
                ))}
              </div>
              <div className={styles.secureNote}><i className="fas fa-lock" /> All transactions are secured and encrypted. No real payment is processed.</div>
            </div>
          )}

          {/* Step 2 — Confirm */}
          {step === 2 && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}><i className="fas fa-clipboard-check" /> Order Review</h3>
              <div className={styles.reviewSection}>
                <div className={styles.reviewLabel}>Ship to:</div>
                <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{form.name}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{form.phone} · {form.address}</p>
              </div>
              <div className={styles.reviewSection}>
                <div className={styles.reviewLabel}>Payment:</div>
                <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  <i className={PAYMENT_METHODS.find((m) => m.id === payment)?.icon} style={{ marginRight: 8 }} />
                  {PAYMENT_METHODS.find((m) => m.id === payment)?.label}
                </p>
              </div>
              <div className={styles.reviewSection}>
                <div className={styles.reviewLabel}>Items ({cartItems.length}):</div>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.reviewItem}>
                    <img src={item.image} alt={item.title}
                      onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.productId}/60/60`; }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                    </div>
                    <span style={{ fontWeight: 700 }}>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.navBtns}>
            {step > 0 && <button className={styles.backBtn} onClick={() => setStep((s) => s - 1)}><i className="fas fa-arrow-left" /> Back</button>}
            {step < 2
              ? <button className={styles.nextBtn} onClick={handleNext}>Next Step <i className="fas fa-arrow-right" /></button>
              : <button className={styles.placeOrderBtn} onClick={handlePlaceOrder} disabled={loading}>
                  {loading ? <><i className="fas fa-spinner fa-spin" /> Placing order...</> : <><i className="fas fa-check-circle" /> Place Order</>}
                </button>
            }
          </div>
        </div>

        {/* Order summary sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.summaryCard}>
            <h4 className={styles.summaryTitle}>Summary</h4>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.summaryItem}>
                <span>{item.title.slice(0, 28)}{item.title.length > 28 ? '…' : ''} ×{item.quantity}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className={styles.summaryDivider} />
            <div className={styles.summaryItem}><span>Subtotal</span><span>{formatCurrency(cartTotal)}</span></div>
            <div className={styles.summaryItem}><span>Shipping</span><span style={{ color: shipping === 0 ? 'var(--success)' : '' }}>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span></div>
            <div className={styles.summaryItem}><span>Tax</span><span>{formatCurrency(tax)}</span></div>
            <div className={styles.summaryDivider} />
            <div className={`${styles.summaryItem} ${styles.totalItem}`}><strong>Total</strong><strong>{formatCurrency(total)}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
