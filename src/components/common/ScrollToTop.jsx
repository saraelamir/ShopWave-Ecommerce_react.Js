import { useState, useEffect } from 'react';
import styles from './ScrollToTop.module.css';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return visible ? (
    <button className={styles.btn} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} title="Scroll to top">
      <i className="fas fa-arrow-up" />
    </button>
  ) : null;
};

export default ScrollToTop;
