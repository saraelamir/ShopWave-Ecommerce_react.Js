import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import styles from './LoginPage.module.css';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = [
    { value: 'customer', label: 'Customer', icon: 'fas fa-user' },
    { value: 'seller', label: 'Seller', icon: 'fas fa-store' },
  ];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Account created! Welcome, ${user.name}!`);
      if (user.role === 'seller') navigate('/dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoText}>Shop<span>Wave</span></div>
          <div className={styles.logoSub}>Join millions of happy shoppers</div>
        </div>

        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Start your shopping journey today</p>

        {error && <div className={styles.error}><i className="fas fa-exclamation-circle" />{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <div className={styles.inputWrapper}>
              <i className={`fas fa-user ${styles.inputIcon}`} />
              <input type="text" name="name" className={styles.input}
                placeholder="John Doe" value={form.name} onChange={handleChange} required />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <div className={styles.inputWrapper}>
              <i className={`fas fa-envelope ${styles.inputIcon}`} />
              <input type="email" name="email" className={styles.input}
                placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <i className={`fas fa-lock ${styles.inputIcon}`} />
              <input type={showPass ? 'text' : 'password'} name="password" className={styles.input}
                placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
                <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>I want to</label>
            <div className={styles.roleGrid}>
              {roles.map((r) => (
                <div key={r.value}
                  className={`${styles.roleCard} ${form.role === r.value ? styles.active : ''}`}
                  onClick={() => setForm({ ...form, role: r.value })}>
                  <i className={r.icon} />
                  <span>{r.label}</span>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <><i className="fas fa-spinner fa-spin" /> Creating account...</> : <><i className="fas fa-user-plus" /> Create Account</>}
          </button>
        </form>

        <div className={styles.footer}>
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
