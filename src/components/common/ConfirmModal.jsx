import styles from './ConfirmModal.module.css';

const ConfirmModal = ({ show, title, message, onConfirm, onCancel, confirmText = 'Delete', confirmVariant = 'danger' }) => {
  if (!show) return null;
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.icon}>
          <i className="fas fa-exclamation-triangle" />
        </div>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
          <button className={`${styles.confirmBtn} ${styles[confirmVariant]}`} onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
