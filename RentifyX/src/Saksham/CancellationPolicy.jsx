import { useState } from 'react';
// Removed import './Driveables.css';

const CancellationPolicy = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div 
        className="card-header bg-white d-flex justify-content-between align-items-center py-3"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: 'pointer' }}
      >
        <h5 className="mb-0 fw-bold">Cancellation Policy</h5>
        <span className="text-muted" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
          ▼
        </span>
      </div>

      {isExpanded && (
        <div className="card-body bg-light">
          
          {/* Tier 1: Flexible */}
          <div className="mb-4">
            <h6 className="text-success fw-bold mb-2">
              <span className="me-2">✓</span>Flexible Cancellation
            </h6>
            <ul className="list-unstyled small mb-0 ps-4 text-muted">
              <li className="mb-1"><strong className="text-dark">Full Refund:</strong> Cancel up to 24 hours before booking start time</li>
              <li className="mb-1"><strong className="text-dark">50% Refund:</strong> Cancel 12-24 hours before booking</li>
              <li><strong className="text-dark">No Refund:</strong> Cancel less than 12 hours before booking</li>
            </ul>
          </div>

          {/* Tier 2: Extensions */}
          <div className="mb-4">
            <h6 className="text-primary fw-bold mb-2">Time Extension Charges</h6>
            <ul className="small mb-0 ps-4 text-muted">
              <li>Grace period of 15 minutes included in booking</li>
              <li>After grace period: Extra charges apply at 1.5x hourly rate</li>
              <li>Charges calculated per hour or part thereof</li>
              <li>Automatic billing through registered payment method</li>
            </ul>
          </div>

          {/* Tier 3: Strict Rules */}
          <div className="mb-4">
            <h6 className="text-danger fw-bold mb-2">
              <span className="me-2">⚠</span>Important Terms
            </h6>
            <ul className="small mb-0 ps-4 text-muted">
              <li className="mb-1"><strong className="text-dark">Damage Policy:</strong> Renter is responsible for any damage beyond normal wear and tear</li>
              <li className="mb-1"><strong className="text-dark">Fuel/Charge:</strong> Vehicle must be returned with same fuel/charge level</li>
              <li className="mb-1"><strong className="text-dark">Late Return:</strong> Beyond 2 hours of excess time may result in next booking cancellation fee</li>
              <li className="mb-1"><strong className="text-dark">No-Show:</strong> No refund for no-shows without prior cancellation</li>
              <li><strong className="text-dark">Security Deposit:</strong> Refundable deposit held during rental period</li>
            </ul>
          </div>

          <hr />

          {/* Footer Note */}
          <p className="small text-muted mb-4">
            <strong className="text-dark">Note:</strong> All cancellations must be made through the platform. 
            Refunds will be processed within 5-7 business days. For emergency cancellations, 
            please contact our 24/7 support team.
          </p>

          {/* Actions */}
          <div className="d-flex gap-3">
            <button className="btn btn-outline-secondary btn-sm">
              View Complete Terms & Conditions
            </button>
            <button className="btn btn-outline-secondary btn-sm">
              Download Policy PDF
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default CancellationPolicy;