import { useAuth } from "../store/auth";
import styles from "./Header.module.css";

const Header = () => {
  const { logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.title}>Admin Panel</div>

      <div className={styles.right}>
        <button className={styles.button} onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;