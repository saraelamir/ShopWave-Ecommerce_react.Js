import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
      <div style={{ fontSize: '6rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>404</div>
      <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', margin: '16px 0 8px' }}>Page Not Found</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px' }}>
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link to="/" className="btn-primary-custom">
        <i className="fas fa-home" /> Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
