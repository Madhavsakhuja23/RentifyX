import { useNavigate } from "react-router-dom";

const BookingHistory = ({ bookings = [] }) => {
  const navigate = useNavigate();

  if (bookings.length === 0) {
    return (
      <div className="profile-card" style={{ textAlign: "center", padding: "60px 32px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🏠</div>
        <h4 style={{ marginBottom: 8, fontSize: 20, fontWeight: 700 }}>No bookings yet</h4>
        <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
          Your booking history will appear here once you reserve a property or vehicle.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate("/dwellings")}
            style={{ padding: "12px 24px", background: "rgb(255,102,0)", color: "white", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}
          >
            Browse Dwellings
          </button>
          <button
            onClick={() => navigate("/driveables")}
            style={{ padding: "12px 24px", background: "white", color: "rgb(255,102,0)", border: "1.5px solid rgb(255,102,0)", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}
          >
            Browse Driveables
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {bookings.map((b) => (
        <div key={b.id} className="profile-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "flex", gap: 0 }}>
            {b.image && (
              <img
                src={b.image}
                alt={b.title}
                style={{ width: 140, height: 110, objectFit: "cover", flexShrink: 0, borderRadius: "14px 0 0 14px" }}
              />
            )}
            <div style={{ padding: "18px 22px", flex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
              <div>
                {/* Type badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h5 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{b.title}</h5>
                  <span style={{
                    fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px',
                    padding: '2px 8px', borderRadius: 12,
                    background: b.type === 'driveable' ? '#fff3e0' : '#f0f7ff',
                    color: b.type === 'driveable' ? 'rgb(230,80,0)' : '#1565c0',
                    border: `1px solid ${b.type === 'driveable' ? 'rgb(255,180,120)' : '#90caf9'}`,
                  }}>
                    {b.type === 'driveable' ? '🚗 Driveable' : '🏠 Dwelling'}
                  </span>
                </div>

                {b.location && (
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>
                    📍 {b.location}{b.category ? ` · ${b.category}` : ''}
                  </p>
                )}

                {/* Dates */}
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>
                  📅 {new Date(b.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  {" → "}
                  {new Date(b.checkOut).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>

                {/* Duration for driveables */}
                {b.duration && (
                  <p style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>⏱ {b.duration}</p>
                )}

                {b.utr && (
                  <p style={{ fontSize: 12, color: "#aaa", fontFamily: "monospace" }}>UTR: {b.utr}</p>
                )}
              </div>

              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: "rgb(255,102,0)", marginBottom: 8 }}>{b.amount}</p>
                <span style={{
                  display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                  background: b.status === "upcoming" ? "#fff7f0" : "#f0f0f0",
                  color: b.status === "upcoming" ? "rgb(255,102,0)" : "#888",
                  border: `1px solid ${b.status === "upcoming" ? "rgb(255,102,0)" : "#ddd"}`,
                }}>
                  {b.status === "upcoming" ? "✅ Confirmed" : b.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingHistory;