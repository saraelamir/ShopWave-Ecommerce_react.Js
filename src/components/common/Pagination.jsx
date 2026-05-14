import styles from './Pagination.module.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <nav className={styles.pagination}>
      <button className={styles.btn} onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <i className="fas fa-chevron-left" />
      </button>
      {pages.map((page, idx) =>
        page === '...'
          ? <span key={idx} className={styles.ellipsis}>…</span>
          : <button key={idx} className={`${styles.btn} ${page === currentPage ? styles.active : ''}`}
              onClick={() => onPageChange(page)}>{page}</button>
      )}
      <button className={styles.btn} onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        <i className="fas fa-chevron-right" />
      </button>
    </nav>
  );
};

export default Pagination;
