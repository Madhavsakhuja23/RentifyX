import { FaTimes, FaStar, FaInfoCircle } from 'react-icons/fa';

const VehicleComparison = ({ vehicles, onRemove }) => {
  // Use the same purple gradient for the table headers/icons
  const symbolGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

  if (!vehicles || vehicles.length === 0) return null;

  return (
    <div className="container my-5 overflow-hidden shadow-lg rounded-4 bg-white border">
      <div className="p-4 border-bottom bg-light d-flex justify-content-between align-items-center">
        <h3 className="fw-bold mb-0">Vehicle Comparison</h3>
        <span className="badge rounded-pill px-3 py-2 text-white" style={{ background: symbolGradient }}>
          {vehicles.length} Selected
        </span>
      </div>

      <div className="table-responsive">
        <table className="table table-hover mb-0 align-middle text-center">
          <thead>
            <tr>
              <th className="text-start p-4 bg-light" style={{ minWidth: '200px' }}>Features</th>
              {vehicles.map(v => (
                <th key={v.id} style={{ minWidth: '250px' }} className="p-4 position-relative bg-white">
                  <button 
                    onClick={() => onRemove(v.id)}
                    className="btn btn-sm btn-light rounded-circle position-absolute top-0 end-0 m-2 shadow-sm border"
                    title="Remove from comparison"
                  >
                    <FaTimes size={12} className="text-danger" />
                  </button>
                  <img src={v.image} alt={`${v.name} - ${v.category}`} className="img-fluid rounded mb-2 shadow-sm" style={{ maxHeight: '120px', objectFit: 'cover' }} />
                  <h6 className="fw-bold mb-0 text-dark">{v.name}</h6>
                  <span className="badge bg-secondary bg-opacity-10 text-secondary mt-1">{v.category}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* PRICE ROW */}
            <tr>
              <td className="text-start fw-bold px-4 py-3 bg-light text-secondary">Price / Hour</td>
              {vehicles.map(v => (
                <td key={v.id} className="fw-bold text-success fs-5 bg-white">₹{v.hourlyRate}</td>
              ))}
            </tr>
            {/* DAY RATE ROW */}
            <tr>
              <td className="text-start fw-bold px-4 py-3 bg-light text-secondary">Price / Day</td>
              {vehicles.map(v => (
                <td key={v.id} className="fw-bold text-primary fs-5 bg-white">₹{v.dayRate}</td>
              ))}
            </tr>
            {/* RATING ROW */}
            <tr>
              <td className="text-start fw-bold px-4 py-3 bg-light text-secondary">User Rating</td>
              {vehicles.map(v => (
                <td key={v.id} className="bg-white">
                  <div className="d-flex align-items-center justify-content-center gap-1">
                    <FaStar className="me-1" style={{ color: '#FFD700' }} />
                    <span className="fw-bold">{v.rating}</span>
                  </div>
                </td>
              ))}
            </tr>
            
            {/* LOCATION ROW */}
            <tr>
              <td className="text-start fw-bold px-4 py-3 bg-light text-secondary">Location</td>
              {vehicles.map(v => (
                <td key={v.id} className="bg-white text-muted">
                    {v.location}
                </td>
              ))}
            </tr>

            {/* DYNAMIC SPECIFICATIONS */}
            {['fuelType', 'transmission', 'seatingCapacity', 'range', 'type', 'gears'].map((specKey) => {
              // Only render row if at least one vehicle has this spec
              const hasSpec = vehicles.some(v => v.specifications && v.specifications[specKey]);
              if (!hasSpec) return null;

              // Format label (camelCase to Title Case)
              const label = specKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

              return (
                <tr key={specKey}>
                  <td className="text-start fw-bold px-4 py-3 bg-light text-secondary">{label}</td>
                  {vehicles.map(v => (
                    <td key={v.id} className="bg-white">
                      {v.specifications && v.specifications[specKey] ? v.specifications[specKey] : <span className="text-muted">-</span>}
                    </td>
                  ))}
                </tr>
              );
            })}
            
            {/* RENT ACTION */}
            <tr>
              <td className="bg-light"></td>
              {vehicles.map(v => (
                <td key={v.id} className="p-4 bg-white">
                  <button 
                    className="btn w-100 rounded-pill text-white fw-bold shadow-sm hover-scale"
                    style={{ background: 'linear-gradient(90deg, #FF4D00 0%, #FF8A00 100%)', transition: 'transform 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    Rent Now
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleComparison;
