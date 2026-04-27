import { useNavigate } from "react-router-dom";

const Favourites = ({ favourites = [] }) => {
  const navigate = useNavigate();

  if (favourites.length === 0) {
    return (
      <div className="profile-card" style={{ textAlign: "center", padding: "60px 32px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>❤️</div>
        <h4 style={{ marginBottom: 8, fontSize: 20, fontWeight: 700 }}>No favourites yet</h4>
        <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
          Click the heart ♥ on any listing or vehicle to save it here.
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
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
      {favourites.map((item) => (
        <div
          key={item.id}
          className="fav-card"
          onClick={() =>
            item.type === 'driveable'
              ? navigate('/driveables')
              : navigate(`/listing/${item.id}`)
          }
          style={{ cursor: "pointer" }}
        >
          <div style={{ position: "relative" }}>
            <img
              src={item.image}
              alt={item.name || item.title}
              style={{ width: "100%", height: 180, objectFit: "cover" }}
            />
            {/* Type badge */}
            <span style={{
              position: 'absolute', top: 10, left: 10,
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px',
              padding: '3px 9px', borderRadius: 12,
              background: item.type === 'driveable' ? 'rgba(255,102,0,.9)' : 'rgba(21,101,192,.85)',
              color: 'white',
            }}>
              {item.type === 'driveable' ? '🚗 Vehicle' : '🏠 Stay'}
            </span>
            <div style={{
              position: "absolute", top: 10, right: 10, background: "white", borderRadius: "50%",
              width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,.15)",
            }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#FF385C" stroke="#FF385C" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
          </div>
          <div style={{ padding: "14px 16px" }}>
            <h6 style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: "var(--text-primary)" }}>
              {item.name || item.title}
            </h6>
            {item.location && (
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>
                📍 {item.location}
              </p>
            )}
            {item.price && (
              <p style={{ fontSize: 14, fontWeight: 700, color: "rgb(255,102,0)" }}>
                ₹{Number(item.price).toLocaleString("en-IN")}
                <span style={{ fontWeight: 400, fontSize: 12, color: "#888" }}> / {item.priceUnit}</span>
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Favourites;