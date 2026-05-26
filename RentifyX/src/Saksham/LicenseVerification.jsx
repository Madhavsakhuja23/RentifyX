import { useState } from 'react';
import toast from 'react-hot-toast';
// Removed import './Driveables.css';

const LicenseVerification = ({ isVerified, onVerificationComplete }) => {
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseImage, setLicenseImage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errors, setErrors] = useState({});

  const validateLicenseNumber = (number) => {
    // Relaxed validation for testing purposes
    const licensePattern = /^[A-Za-z0-9\s-]{5,}$/; // At least 5 chars (alphanumeric, spaces, dashes)
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
      toast.success('License verified successfully! ✓');
    }, 2000);
  };

  if (isVerified) {
    return (
      <div className="alert alert-success d-flex align-items-center" role="alert">
        <span className="fs-4 me-3">✓</span>
        <div>
          <h5 className="alert-heading mb-1">Driving License Verified</h5>
          <p className="mb-0 small">Your driving license has been successfully verified.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="alert alert-warning d-flex justify-content-between align-items-center" role="alert">
        <div className="d-flex align-items-center">
          <span className="fs-4 me-3 text-warning">⚠</span>
          <div>
            <h5 className="alert-heading mb-1 text-dark">License Verification Required</h5>
            <p className="mb-0 small text-dark">Please verify your driving license to proceed with booking.</p>
          </div>
        </div>
        <button 
          className="btn btn-warning fw-medium"
          onClick={() => setShowVerificationForm(true)}
        >
          Verify License
        </button>
      </div>

      {/* Verification Modal using Bootstrap layout visually */}
      {showVerificationForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0 pb-0">
                <button type="button" className="btn-close" onClick={() => setShowVerificationForm(false)}></button>
              </div>
              <div className="modal-body pt-0">
                <h4 className="fw-bold mb-1">Verify Your Driving License</h4>
                <p className="text-muted small mb-4">We need to verify your driving license for safety and security.</p>

                <form onSubmit={handleVerification}>
                  {/* License Number Input */}
                  <div className="mb-3">
                    <label htmlFor="licenseNumber" className="form-label fw-medium">License Number *</label>
                    <input 
                      id="licenseNumber"
                      type="text" 
                      value={licenseNumber}
                      onChange={(e) => {
                        setLicenseNumber(e.target.value.toUpperCase());
                        setErrors({ ...errors, licenseNumber: null });
                      }}
                      placeholder="e.g., DL1234567890123"
                      className={`form-control ${errors.licenseNumber ? 'is-invalid' : ''}`}
                    />
                    {errors.licenseNumber && (
                      <div className="invalid-feedback">{errors.licenseNumber}</div>
                    )}
                  </div>

                  {/* File Upload Area */}
                  <div className="mb-4">
                    <label htmlFor="licenseImage" className="form-label fw-medium">Upload License Image *</label>
                    <div className={`p-4 text-center border rounded ${errors.file ? 'border-danger' : 'border-secondary'} bg-light position-relative`} style={{ borderStyle: 'dashed !important' }}>
                      <input 
                        id="licenseImage"
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="position-absolute w-100 h-100 top-0 start-0 opacity-0"
                        style={{ cursor: 'pointer' }}
                      />
                      {licenseImage ? (
                        <span className="text-success fw-medium">✓ {licenseImage.name}</span>
                      ) : (
                        <div>
                          <div className="fs-3 mb-2">📁</div>
                          <p className="mb-0 text-primary">Click to upload or drag and drop</p>
                          <small className="text-muted">PNG, JPG up to 5MB</small>
                        </div>
                      )}
                    </div>
                    {errors.file && (
                      <div className="text-danger small mt-1">{errors.file}</div>
                    )}
                  </div>

                  {/* Info Box */}
                  <div className="bg-light p-3 rounded mb-4">
                    <h6 className="fw-bold">Why do we need this?</h6>
                    <ul className="list-unstyled small text-muted mb-0">
                      <li>✓ Ensure driver safety and compliance</li>
                      <li>✓ Verify age and license validity</li>
                      <li>✓ Protect against fraud</li>
                      <li>✓ Meet legal requirements</li>
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="d-grid gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg"
                      disabled={isVerifying}
                    >
                      {isVerifying ? (
                        <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Verifying...</>
                      ) : 'Verify Now'}
                    </button>
                    <button 
                      type="button"
                      className="btn btn-light"
                      onClick={() => setShowVerificationForm(false)}
                      disabled={isVerifying}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LicenseVerification;