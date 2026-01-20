import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <Link className={styles.navItem} to="/dashboard">Dashboard</Link>
      <Link className={styles.navItem} to="/posts">Posts</Link>
    </aside>
  );
};

export default Sidebar;