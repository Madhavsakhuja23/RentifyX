import { useState } from 'react';
import './Driveables.css';

const LicenseVerification = ({ isVerified, onVerificationComplete }) => {
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseImage, setLicenseImage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errors, setErrors] = useState({});

  const validateLicenseNumber = (number) => {
    // Basic validation - can be customized based on region
    const licensePattern = /^[A-Z]{2}\d{13}$/; // Example: DL1234567890123
    return licensePattern.test(number);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({ ...errors, file: 'File size must be less than 5MB' });
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, file: 'Please upload an image file' });
        return;
      }
      setLicenseImage(file);
      setErrors({ ...errors, file: null });
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!licenseNumber) {
      newErrors.licenseNumber = 'License number is required';
    } else if (!validateLicenseNumber(licenseNumber)) {
      newErrors.licenseNumber = 'Invalid license number format (e.g., DL1234567890123)';
    }

    if (!licenseImage) {
      newErrors.file = 'Please upload a license image';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsVerifying(true);
    
    // Simulate API call for verification
    setTimeout(() => {
      setIsVerifying(false);
      setShowVerificationForm(false);
      onVerificationComplete();
      alert('License verified successfully! ✓');
    }, 2000);
  };

  if (isVerified) {
    return (
      <div className="license-section verified">
        <div className="verification-status">
          <span className="verify-icon verified">✓</span>
          <div className="verify-text">
            <h3>Driving License Verified</h3>
            <p>Your driving license has been successfully verified</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="license-section">
      <div className="verification-status">
        <span className="verify-icon unverified">⚠</span>
        <div className="verify-text">
          <h3>Driving License Verification Required</h3>
          <p>Please verify your driving license to proceed with booking</p>
        </div>
        <button 
          className="verify-btn"
          onClick={() => setShowVerificationForm(true)}
        >
          Verify License
        </button>
      </div>

      {showVerificationForm && (
        <div className="modal-overlay">
          <div className="modal-content verification-modal">
            <button 
              className="modal-close"
              onClick={() => setShowVerificationForm(false)}
            >
              ×
            </button>
            
            <h2>Verify Your Driving License</h2>
            <p className="modal-subtitle">We need to verify your driving license for safety and security</p>

            <form onSubmit={handleVerification} className="verification-form">
              <div className="form-group">
                <label htmlFor="licenseNumber">License Number *</label>
                <input 
                  id="licenseNumber"
                  type="text" 
                  value={licenseNumber}
                  onChange={(e) => {
                    setLicenseNumber(e.target.value.toUpperCase());
                    setErrors({ ...errors, licenseNumber: null });
                  }}
                  placeholder="e.g., DL1234567890123"
                  className={`form-input ${errors.licenseNumber ? 'error' : ''}`}
                />
                {errors.licenseNumber && (
                  <span className="error-message">{errors.licenseNumber}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="licenseImage">Upload License Image *</label>
                <div className="file-upload-area">
                  <input 
                    id="licenseImage"
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <div className="file-upload-placeholder">
                    {licenseImage ? (
                      <span>✓ {licenseImage.name}</span>
                    ) : (
                      <>
                        <span className="upload-icon">📁</span>
                        <span>Click to upload or drag and drop</span>
                        <span className="upload-hint">PNG, JPG up to 5MB</span>
                      </>
                    )}
                  </div>
                </div>
                {errors.file && (
                  <span className="error-message">{errors.file}</span>
                )}
              </div>

              <div className="verification-info">
                <h4>Why do we need this?</h4>
                <ul>
                  <li>✓ Ensure driver safety and compliance</li>
                  <li>✓ Verify age and license validity</li>
                  <li>✓ Protect against fraud</li>
                  <li>✓ Meet legal requirements</li>
                </ul>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={isVerifying}
                >
                  {isVerifying ? 'Verifying...' : 'Verify Now'}
                </button>
                <button 
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowVerificationForm(false)}
                  disabled={isVerifying}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LicenseVerification;
