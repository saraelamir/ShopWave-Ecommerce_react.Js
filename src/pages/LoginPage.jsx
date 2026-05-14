import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'seller') navigate('/dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (email, password) => {
    setForm({ email, password });
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Logged in as ${user.name}!`);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'seller') navigate('/dashboard');
      else navigate('/');
    } catch {
      setError('Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoText}>Shop<span>Wave</span></div>
          <div className={styles.logoSub}>Your Premium Shopping Destination</div>
        </div>

        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to continue shopping</p>



        {error && <div className={styles.error}><i className="fas fa-exclamation-circle" />{error}</div>}

        <form onSubmit={handleSubmit}>
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
                placeholder="Enter your password" value={form.password} onChange={handleChange} required />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
                <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <><i className="fas fa-spinner fa-spin" /> Signing in...</> : <><i className="fas fa-sign-in-alt" /> Sign In</>}
          </button>
        </form>



        <div className={styles.footer}>
          Don't have an account? <Link to="/register">Create one free</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
