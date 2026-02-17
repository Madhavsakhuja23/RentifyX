import { useState } from 'react';
import './Driveables.css';

const CancellationPolicy = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="cancellation-section">
      <div 
        className="policy-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3>Cancellation Policy</h3>
        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
          ▼
        </span>
      </div>

      {isExpanded && (
        <div className="policy-content">
          <div className="policy-tier">
            <div className="tier-header flexible">
              <span className="tier-icon">✓</span>
              <h4>Flexible Cancellation</h4>
            </div>
            <ul className="tier-details">
              <li>
                <strong>Full Refund:</strong> Cancel up to 24 hours before booking start time
              </li>
              <li>
                <strong>50% Refund:</strong> Cancel 12-24 hours before booking
              </li>
              <li>
                <strong>No Refund:</strong> Cancel less than 12 hours before booking
              </li>
            </ul>
          </div>

          <div className="policy-tier">
            <div className="tier-header moderate">
              <h4>Time Extension Charges</h4>
            </div>
            <ul className="tier-details">
              <li>
                Grace period of 15 minutes included in booking
              </li>
              <li>
                After grace period: Extra charges apply at 1.5x hourly rate
              </li>
              <li>
                Charges calculated per hour or part thereof
              </li>
              <li>
                Automatic billing through registered payment method
              </li>
            </ul>
          </div>

          <div className="policy-tier">
            <div className="tier-header strict">
              <span className="tier-icon">⚠</span>
              <h4>Important Terms</h4>
            </div>
            <ul className="tier-details">
              <li>
                <strong>Damage Policy:</strong> Renter is responsible for any damage beyond normal wear and tear
              </li>
              <li>
                <strong>Fuel/Charge:</strong> Vehicle must be returned with same fuel/charge level
              </li>
              <li>
                <strong>Late Return:</strong> Beyond 2 hours of excess time may result in next booking cancellation fee
              </li>
              <li>
                <strong>No-Show:</strong> No refund for no-shows without prior cancellation
              </li>
              <li>
                <strong>Security Deposit:</strong> Refundable deposit held during rental period
              </li>
            </ul>
          </div>

          <div className="policy-footer">
            <p className="policy-note">
              <strong>Note:</strong> All cancellations must be made through the platform. 
              Refunds will be processed within 5-7 business days. For emergency cancellations, 
              please contact our 24/7 support team.
            </p>
          </div>

          <div className="policy-actions">
            <button className="policy-link-btn">
              View Complete Terms & Conditions
            </button>
            <button className="policy-link-btn">
              Download Policy PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CancellationPolicy;
