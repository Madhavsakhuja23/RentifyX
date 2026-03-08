import { useState } from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

const BookingConfirmationModal = ({ show, onClose, vehicle, totalPrice, duration, bookingType }) => {
  const [step, setStep] = useState('form'); // 'form' or 'success'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    startDate: '',
    notes: ''
  });

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setStep('success');
    }, 1000);
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0">
          
          {/* Header */}
          <div className="modal-header border-bottom-0">
            <h5 className="modal-title fw-bold">
              {step === 'form' ? 'Complete Your Booking' : 'Booking Confirmed!'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            {step === 'form' ? (
              <>
                {/* Order Summary Card */}
                <div className="card bg-light border-0 mb-4">
                  <div className="card-body d-flex align-items-center gap-3">
                    <img 
                      src={vehicle.image} 
                      alt={vehicle.name} 
                      className="rounded" 
                      style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                    />
                    <div>
                      <h6 className="fw-bold mb-1">{vehicle.name}</h6>
                      <p className="mb-0 text-muted small">
                        {bookingType === 'daily' ? `${duration} Day(s)` : `${duration} Hour(s)`} • Total: <span className="text-primary fw-bold">${totalPrice}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small text-muted fw-bold text-uppercase">Personal Details</label>
                    <div className="row g-2">
                      <div className="col-12">
                        <input 
                          type="text" 
                          name="fullName"
                          className="form-control" 
                          placeholder="Full Name" 
                          required 
                          value={formData.fullName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <input 
                          type="email" 
                          name="email"
                          className="form-control" 
                          placeholder="Email Address" 
                          required 
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <input 
                          type="tel" 
                          name="phone"
                          className="form-control" 
                          placeholder="Phone Number" 
                          required 
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small text-muted fw-bold text-uppercase">Schedule</label>
                    <input 
                      type="datetime-local" 
                      name="startDate"
                      className="form-control" 
                      required 
                      value={formData.startDate}
                      onChange={handleChange}
                    />
                    <div className="form-text">Select your preferred pickup time.</div>
                  </div>

                  <div className="mb-4">
                    <textarea 
                      name="notes"
                      className="form-control" 
                      rows="2" 
                      placeholder="Any special requests? (Optional)"
                      value={formData.notes}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary py-2 fw-bold">
                      Confirm Booking — ${totalPrice}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="mb-4">
                  <FaCheckCircle className="text-success" size={64} />
                </div>
                <h4 className="fw-bold mb-2">Thank You, {formData.fullName}!</h4>
                <p className="text-muted mb-4">
                  Your booking for <strong>{vehicle.name}</strong> has been confirmed.<br/>
                  We've sent the details to <strong>{formData.email}</strong>.
                </p>
                <div className="card bg-light border-0 p-3 mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Booking Reference:</span>
                    <span className="fw-bold font-monospace">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Pickup Time:</span>
                    <span className="fw-medium">{new Date(formData.startDate).toLocaleString()}</span>
                  </div>
                </div>
                <button className="btn btn-outline-primary w-100" onClick={onClose}>
                  Close & Return to Fleet
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationModal;
