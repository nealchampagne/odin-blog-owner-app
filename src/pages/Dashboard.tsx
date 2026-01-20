import { useEffect, useState } from "react";
import { getDashboardStats } from "../api/admin";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [stats, setStats] = useState<null | {
    totalPosts: number;
    draftPosts: number;
    publishedPosts: number;
    totalComments: number;
    totalUsers: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch {
        setError("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <p className={styles.loading}>Loading…</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!stats) return null;

  const statCards = [
    { label: "Total Posts", value: stats.totalPosts },
    { label: "Draft Posts", value: stats.draftPosts },
    { label: "Published Posts", value: stats.publishedPosts },
    { label: "Total Comments", value: stats.totalComments },
    { label: "Users", value: stats.totalUsers }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>Dashboard</h1>

        <a href="/posts/new" className={styles.createButton}>
          + Create Post
        </a>
      </div>

      <div className={styles.grid}>
        {statCards.map((stat) => (
          <div key={stat.label} className={styles.card}>
            <div className={styles.cardTitle}>{stat.label}</div>
            <div className={styles.cardValue}>{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;