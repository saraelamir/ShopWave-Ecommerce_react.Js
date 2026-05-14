import styles from './UserAvatar.module.css';

const UserAvatar = ({ user, size = 'sm', className = '' }) => {
  const getInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return '?';
  };

  return (
    <div className={`${styles.avatarInitial} ${styles[size]} ${className}`}>
      {getInitial()}
    </div>
  );
};

export default UserAvatar;
