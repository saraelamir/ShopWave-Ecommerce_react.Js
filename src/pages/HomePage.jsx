import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectAllProducts, selectProductsStatus, setCategory } from '../redux/slices/productsSlice';
import ProductCard from '../components/product/ProductCard';
import { SkeletonGrid } from '../components/product/SkeletonCard';
import ScrollToTop from '../components/common/ScrollToTop';
import styles from './HomePage.module.css';

const CATEGORIES = [
  { name: 'Electronics', icon: 'fas fa-laptop', color: '#dbeafe', iconColor: '#2563eb' },
  { name: 'Fashion', icon: 'fas fa-tshirt', color: '#fce7f3', iconColor: '#db2777' },
  { name: 'Home', icon: 'fas fa-home', color: '#d1fae5', iconColor: '#059669' },
  { name: 'Sports', icon: 'fas fa-dumbbell', color: '#ffedd5', iconColor: '#ea580c' },
  { name: 'Books', icon: 'fas fa-book', color: '#ede9fe', iconColor: '#7c3aed' },
];

const useCountdown = () => {
  const [time, setTime] = useState({ h: 11, m: 45, s: 30 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) h = 23;
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return time;
};

const HomePage = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);
  const timer = useCountdown();
  const [email, setEmail] = useState('');

  useEffect(() => { if (status === 'idle') dispatch(fetchProducts()); }, [dispatch, status]);

  const featured = products.slice(0, 8);
  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);

  const handleCategoryClick = (cat) => dispatch(setCategory(cat));

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className={styles.heroContent}>
                <div className={styles.heroBadge}><i className="fas fa-bolt" /> New Season Sale — Up to 60% Off</div>
                <h1 className={styles.heroTitle}>
                  Shop Smarter,<br />Live <span>Better</span>
                </h1>
                <p className={styles.heroSubtitle}>
                  Discover thousands of premium products across electronics, fashion, home, sports and more — all in one place.
                </p>
                <div className={styles.heroActions}>
                  <Link to="/products" className={styles.heroBtnPrimary}>
                    <i className="fas fa-shopping-bag" /> Shop Now
                  </Link>
                  <Link to="/products" className={styles.heroBtnSecondary}>
                    <i className="fas fa-tag" /> View Deals
                  </Link>
                </div>
                <div className={styles.heroStats}>
                  <div className={styles.statItem}><div className={styles.statNumber}>50K+</div><div className={styles.statLabel}>Products</div></div>
                  <div className={styles.statItem}><div className={styles.statNumber}>120K+</div><div className={styles.statLabel}>Happy Customers</div></div>
                  <div className={styles.statItem}><div className={styles.statNumber}>4.9★</div><div className={styles.statLabel}>Avg Rating</div></div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className={styles.heroImage}>
                <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=700" alt="Shopping" className={styles.heroImg} />
                <div className={`${styles.floatingCard} ${styles.floatingCard1}`}>
                  <i className="fas fa-shipping-fast" style={{ color: '#22c55e' }} />
                  <div><strong style={{ display: 'block' }}>Free Delivery</strong><small style={{ opacity: 0.7 }}>On orders over $50</small></div>
                </div>
                <div className={`${styles.floatingCard} ${styles.floatingCard2}`}>
                  <i className="fas fa-shield-alt" style={{ color: '#f59e0b' }} />
                  <div><strong style={{ display: 'block' }}>Secure Payment</strong><small style={{ opacity: 0.7 }}>100% protected</small></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* CATEGORIES */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle">Find exactly what you're looking for</p>
            </div>
            <Link to="/products" className={styles.viewAll}>View All <i className="fas fa-arrow-right" /></Link>
          </div>
          <div className={styles.categoriesGrid}>
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} to="/products" className={styles.categoryCard} onClick={() => handleCategoryClick(cat.name)}>
                <div className={styles.categoryIcon} style={{ background: cat.color }}>
                  <i className={cat.icon} style={{ color: cat.iconColor }} />
                </div>
                <div className={styles.categoryName}>{cat.name}</div>
                <div className={styles.categoryCount}>
                  {products.filter((p) => p.category === cat.name).length} products
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* DEALS TIMER BANNER */}
        <div className={styles.dealsBanner}>
          <div className={styles.dealsContent}>
            <div className={styles.dealsLabel}><i className="fas fa-fire" /> Flash Sale</div>
            <div className={styles.dealsTitle}>Today's Hot Deals</div>
            <div className={styles.dealsSubtitle}>Don't miss out — limited time offers!</div>
          </div>
          <div className={styles.dealsTimer}>
            <div className={styles.timerBox}><div className={styles.timerNum}>{pad(timer.h)}</div><div className={styles.timerLabel}>Hours</div></div>
            <div className={styles.timerBox}><div className={styles.timerNum}>{pad(timer.m)}</div><div className={styles.timerLabel}>Mins</div></div>
            <div className={styles.timerBox}><div className={styles.timerNum}>{pad(timer.s)}</div><div className={styles.timerLabel}>Secs</div></div>
          </div>
        </div>

        {/* FEATURED PRODUCTS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Hand-picked products you'll love</p>
            </div>
            <Link to="/products" className={styles.viewAll}>See All <i className="fas fa-arrow-right" /></Link>
          </div>
          {status === 'loading'
            ? <SkeletonGrid count={8} />
            : <div className={styles.productsGrid}>
                {featured.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
          }
        </section>

        {/* TOP RATED */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className="section-title"><i className="fas fa-star" style={{ color: 'var(--accent)', marginRight: 8 }} />Top Rated</h2>
              <p className="section-subtitle">Highest reviewed by our customers</p>
            </div>
          </div>
          {status === 'loading'
            ? <SkeletonGrid count={4} />
            : <div className={styles.productsGrid}>
                {topRated.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
          }
        </section>

        {/* NEWSLETTER */}
        <div className={styles.newsletter}>
          <h3><i className="fas fa-envelope-open-text" /> Stay in the Loop</h3>
          <p>Get exclusive deals, new arrivals and insider-only discounts in your inbox.</p>
          <form className={styles.newsletterForm} onSubmit={(e) => { e.preventDefault(); setEmail(''); alert('Thanks for subscribing! 🎉'); }}>
            <input type="email" className={styles.newsletterInput} placeholder="Enter your email..." value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button type="submit" className={styles.newsletterBtn}><i className="fas fa-paper-plane" /> Subscribe</button>
          </form>
        </div>
      </div>

      <ScrollToTop />
    </>
  );
};

export default HomePage;
