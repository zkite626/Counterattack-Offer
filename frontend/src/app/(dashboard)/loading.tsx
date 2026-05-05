export default function DashboardLoading() {
  return (
    <div className="biz-page">
      <div className="biz-page__header">
        <div className="skeleton" style={{ width: "40%", height: "2rem" }} />
        <div className="skeleton" style={{ width: "60%", height: "1rem", marginTop: "0.5rem" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div className="skeleton" style={{ width: "100%", height: "8rem" }} />
        <div className="skeleton" style={{ width: "100%", height: "8rem" }} />
        <div className="skeleton" style={{ width: "100%", height: "8rem" }} />
      </div>
    </div>
  );
}
