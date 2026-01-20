import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import styles from "./AdminLayout.module.css";

const AdminLayout = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />

      <div className={styles.mainArea}>
        <Header />

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;