import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Blog Admin App</h2>
      <Link className={styles.navItem} to="/dashboard">Dashboard</Link>
      <Link className={styles.navItem} to="/posts">Posts</Link>
    </aside>
  );
};

export default Sidebar;