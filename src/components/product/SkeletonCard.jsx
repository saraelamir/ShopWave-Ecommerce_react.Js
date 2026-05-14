import styles from './SkeletonCard.module.css';

const SkeletonCard = () => (
  <div className={styles.card}>
    <div className={`${styles.image} skeleton`} />
    <div className={styles.body}>
      <div className={`${styles.line} ${styles.short} skeleton`} />
      <div className={`${styles.line} ${styles.full} skeleton`} />
      <div className={`${styles.line} ${styles.medium} skeleton`} />
      <div className={`${styles.line} ${styles.short} skeleton`} />
      <div className={`${styles.line} ${styles.full} skeleton`} style={{ height: 36, marginTop: 8 }} />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 8 }) => (
  <div className="row g-3">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="col-6 col-md-4 col-lg-3"><SkeletonCard /></div>
    ))}
  </div>
);

export default SkeletonCard;
