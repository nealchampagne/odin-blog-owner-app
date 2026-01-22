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
          {/* Global container applies max-width + centering */}
          <div className="container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;