import styles from "./Dashboard.module.css";

const Dashboard = () => {
  // Later you can fetch real stats from your API
  const stats = [
    { label: "Total Posts", value: 12 },
    { label: "Draft Posts", value: 3 },
    { label: "Total Comments", value: 27 },
    { label: "Published Posts", value: 9 },
    { label: "Users", value: 1 }
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Dashboard</h1>

      <div className={styles.grid}>
        {stats.map((stat) => (
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
