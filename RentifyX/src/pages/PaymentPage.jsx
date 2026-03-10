import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCreditCard, FaPaypal, FaGooglePay, FaArrowLeft, FaShieldAlt, FaCalendarAlt, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './PaymentPage.css';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicle, bookingDetails } = location.state || {};
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    paymentMethod: 'credit-card',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Redirect if no vehicle data (prevent direct access)
  useEffect(() => {
    if (!vehicle) {
      navigate('/driveables');
    }
  }, [vehicle, navigate]);

  if (!vehicle) return null;

  // Validation Logic
  const validateForm = () => {
    const newErrors = {};
    
    // Name Validation
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    
    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Mobile Validation (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be exactly 10 digits';
    }

    // Payment Details Validation (Basic)
    if (formData.paymentMethod === 'credit-card') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
      if (!formData.cvv) newErrors.cvv = 'CVV is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Restrict mobile input to numbers only
    if (name === 'mobile' && !/^\d*$/.test(value)) return;
    
    // Restrict card number to numbers only
    if ((name === 'cardNumber' || name === 'cvv') && !/^\d*$/.test(value)) return;

    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsProcessing(true);
      // Simulate API call
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
        // Here you would typically redirect to a success page or show a modal
        setTimeout(() => {
            alert('Booking Confirmed! Redirecting to home...');
            navigate('/');
        }, 2000);
      }, 2000);
    }
  };

  const calculateTotal = () => {
      // If bookingDetails is passed, use it, otherwise default to hourly rate for 1 hour
      if (bookingDetails?.totalPrice) return bookingDetails.totalPrice;
      return vehicle.hourlyRate;
  };
  
  const totalPrice = calculateTotal();

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Header />
      
      <div className="container py-5 flex-grow-1">
        <button 
            onClick={() => navigate(-1)} 
            className="btn btn-link text-decoration-none text-muted mb-4 ps-0 d-flex align-items-center gap-2"
        >
            <FaArrowLeft /> Back
        </button>

        <div className="row g-5">
            {/* Left Column: Form */}
            <div className="col-lg-8">
                <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4 fade-in-up">
                    <div className="card-header bg-white border-bottom p-4">
                        <h4 className="mb-0 fw-bold text-primary">Secure Checkout</h4>
                    </div>
                    <div className="card-body p-4">
                        <form onSubmit={handleSubmit}>
                            {/* Personal Details Section */}
                            <h5 className="fw-bold mb-3 text-secondary">Contact Information</h5>
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input 
                                            type="text" 
                                            className={`form-control ${errors.fullName ? 'is-invalid' : ''}`} 
                                            id="fullName" 
                                            name="fullName"
                                            placeholder="John Doe"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="fullName"><FaUser className="me-2 text-muted"/>Full Name</label>
                                        {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input 
                                            type="tel" 
                                            className={`form-control ${errors.mobile ? 'is-invalid' : ''}`} 
                                            id="mobile"
                                            name="mobile" 
                                            placeholder="1234567890"
                                            maxLength="10"
                                            value={formData.mobile}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="mobile"><FaPhone className="me-2 text-muted"/>Mobile Number</label>
                                        {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-floating">
                                        <input 
                                            type="email" 
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                                            id="email" 
                                            name="email"
                                            placeholder="name@example.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="email"><FaEnvelope className="me-2 text-muted"/>Email Address</label>
                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method Section */}
                            <h5 className="fw-bold mb-3 text-secondary">Payment Method</h5>
                            <div className="d-flex gap-3 mb-4 flex-wrap">
                                <div 
                                    className={`payment-method-option flex-grow-1 text-center ${formData.paymentMethod === 'credit-card' ? 'selected' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'credit-card' }))}
                                >
                                    <FaCreditCard className="mb-2 d-block mx-auto fs-4" />
                                    <span className="small fw-bold">Card</span>
                                </div>
                                <div 
                                    className={`payment-method-option flex-grow-1 text-center ${formData.paymentMethod === 'upi' ? 'selected' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'upi' }))}
                                >
                                    <FaGooglePay className="mb-2 d-block mx-auto fs-4" />
                                    <span className="small fw-bold">UPI / GPay</span>
                                </div>
                                <div 
                                    className={`payment-method-option flex-grow-1 text-center ${formData.paymentMethod === 'paypal' ? 'selected' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'paypal' }))}
                                >
                                    <FaPaypal className="mb-2 d-block mx-auto fs-4" />
                                    <span className="small fw-bold">PayPal</span>
                                </div>
                            </div>

                            {/* Card Details (Conditional) */}
                            {formData.paymentMethod === 'credit-card' && (
                                <div className="bg-light p-3 rounded-3 mb-4 border">
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label small fw-bold text-muted">Card Number</label>
                                            <input 
                                                type="text" 
                                                className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`} 
                                                name="cardNumber"
                                                placeholder="0000 0000 0000 0000"
                                                maxLength="16"
                                                value={formData.cardNumber}
                                                onChange={handleInputChange}
                                            />
                                            {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label small fw-bold text-muted">Expiry Date</label>
                                            <input 
                                                type="text" 
                                                className={`form-control ${errors.expiryDate ? 'is-invalid' : ''}`} 
                                                name="expiryDate"
                                                placeholder="MM/YY"
                                                maxLength="5"
                                                value={formData.expiryDate}
                                                onChange={handleInputChange}
                                            />
                                            {errors.expiryDate && <div className="invalid-feedback">{errors.expiryDate}</div>}
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label small fw-bold text-muted">CVV</label>
                                            <input 
                                                type="password" 
                                                className={`form-control ${errors.cvv ? 'is-invalid' : ''}`} 
                                                name="cvv"
                                                placeholder="123"
                                                maxLength="3"
                                                value={formData.cvv}
                                                onChange={handleInputChange}
                                            />
                                            {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm"
                                disabled={isProcessing || isSuccess}
                            >
                                {isProcessing ? (
                                    <span>Processing...</span>
                                ) : isSuccess ? (
                                    <span>Payment Successful!</span>
                                ) : (
                                    <span>Pay ₹{totalPrice}</span>
                                )}
                            </button>
                            
                            <div className="text-center mt-3">
                                <span className="secure-badge">
                                    <FaShieldAlt /> 100% Secure Transaction
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="col-lg-4">
                <div className="card shadow-sm border-0 rounded-4 overflow-hidden sticky-top" style={{ top: '100px', zIndex: 1 }}>
                    <div className="card-header bg-white border-bottom p-4">
                        <h5 className="mb-0 fw-bold">Order Summary</h5>
                    </div>
                    <div className="card-body p-4">
                        <div className="d-flex align-items-center mb-4">
                            <img 
                                src={vehicle.image} 
                                alt={vehicle.name} 
                                className="rounded-3 object-fit-cover"
                                style={{ width: '80px', height: '80px' }}
                            />
                            <div className="ms-3">
                                <h6 className="fw-bold mb-1">{vehicle.name}</h6>
                                <p className="mb-0 small text-muted">{vehicle.category}</p>
                            </div>
                        </div>

                        <div className="summary-row">
                            <span>Rate</span>
                            <span className="fw-bold">₹{vehicle.hourlyRate}/hr</span>
                        </div>
                        
                        {bookingDetails?.duration && (
                             <div className="summary-row">
                                <span>Duration</span>
                                <span className="fw-bold">{bookingDetails.duration}</span>
                            </div>
                        )}

                        <div className="summary-row">
                            <span>Service Fee</span>
                            <span className="fw-bold">₹50</span>
                        </div>

                        <div className="summary-row">
                            <span>Taxes</span>
                            <span className="fw-bold">₹{Math.round(totalPrice * 0.18)}</span>
                        </div>

                        <div className="summary-total">
                            <span>Total Amount</span>
                            <span className="text-primary">₹{Math.round(totalPrice * 1.18 + 50)}</span>
                        </div>
                    </div>
                    <div className="card-footer bg-light p-3 text-center">
                        <small className="text-muted"><FaCalendarAlt className="me-1"/> Free cancellation until 24 hours before</small>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentPage;
