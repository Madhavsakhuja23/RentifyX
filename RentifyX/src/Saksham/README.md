# Driveables Module - RentifyX

## Overview
The Driveables Module is a comprehensive rental hub for vehicles including Cars, Bikes & Scooters, EVs, and Bicycles. This module provides a complete solution for browsing, filtering, and booking driveable rentals with features like pricing management, license verification, and cancellation policies.

## Features

### 1. **Main Driveables Page** (`DriveablesMain.jsx`)
- Grid layout for displaying all available driveables
- Responsive design that adapts to different screen sizes
- Real-time filtering based on selected categories
- Results counter showing filtered items
- Integration with all sub-components

### 2. **Sub-Category Filters** (`SubCategoryFilter.jsx`)
- Filter by vehicle types:
  - All Vehicles
  - Cars 🚗
  - Bikes & Scooters 🏍️
  - EVs ⚡
  - Bicycles 🚴
- Visual feedback with active state highlighting
- Icon-based navigation for better UX

### 3. **Listing Cards** (`DriveableCard.jsx`)
- Image display with category badges
- Star ratings for each vehicle
- Location information
- Detailed specifications:
  - Fuel type
  - Transmission
  - Seating capacity
  - Range (for EVs)
  - Gear type (for bicycles)
- Pricing display (hourly and daily rates)
- Quick view details button

### 4. **Detail Page** (`DriveableDetail.jsx`)
Comprehensive detail view including:
- Image gallery with multiple views
- Complete specifications grid
- Integrated pricing calculator
- License verification section
- Features and amenities list
- Cancellation policy display
- Booking form with confirmation modal
- Back navigation to listings

### 5. **Pricing Section** (`PricingSection.jsx`)
- **Hourly Basis Pricing**
  - Base hourly rate
  - Extra charges for time exceeded (1.5x base rate)
  - Hour selector with increment/decrement controls
- **Day-Based Pricing** (Optional)
  - Daily rate option
  - Day selector
- **Price Breakdown**
  - Subtotal calculation
  - Service fee (5%)
  - Insurance (10%)
  - Total with all charges
- Visual warning about extra charges

### 6. **License Verification** (`LicenseVerification.jsx`)
- **Verification Status Display**
  - Unverified state warning
  - Verified state confirmation
- **Verification Form**
  - License number input with validation
  - Image upload for license document
  - File size validation (max 5MB)
  - Format validation
  - Educational information about why verification is needed
- **Security Features**
  - Pattern validation for license numbers
  - Simulated API verification process
  - Real-time error feedback

### 7. **Cancellation Policy** (`CancellationPolicy.jsx`)
- **Expandable/Collapsible Design**
- **Three Policy Tiers:**
  - **Flexible Cancellation**
    - Full refund: 24+ hours before booking
    - 50% refund: 12-24 hours before booking
    - No refund: Less than 12 hours before booking
  - **Time Extension Charges**
    - 15-minute grace period
    - Extra charges at 1.5x hourly rate
    - Automatic billing
  - **Important Terms**
    - Damage policy
    - Fuel/charge return policy
    - Late return penalties
    - No-show policy
    - Security deposit information
- **Additional Actions**
  - View complete terms & conditions
  - Download policy PDF

### 8. **Pagination** (`Pagination.jsx`)
- Smart page number display with ellipsis
- Previous/Next navigation buttons
- Direct page number selection
- Current page highlighting
- Page info display (e.g., "Page 3 of 10")
- Smooth scroll to top on page change
- Configurable items per page (default: 12)

## Component Structure

```
Saksham/
├── DriveablesMain.jsx          # Main container component
├── SubCategoryFilter.jsx       # Category filter component
├── DriveableCard.jsx           # Individual listing card
├── DriveableDetail.jsx         # Detailed view page
├── PricingSection.jsx          # Pricing calculator
├── LicenseVerification.jsx     # License verification form
├── CancellationPolicy.jsx      # Cancellation terms
├── Pagination.jsx              # Pagination controls
└── Driveables.css             # Complete styling
```

## Usage

### 1. Basic Integration
To use the Driveables module in your app, import and render the main component:

```jsx
import DriveablesMain from './Saksham/DriveablesMain';

function App() {
  return (
    <div>
      <DriveablesMain />
    </div>
  );
}
```

### 2. Individual Component Usage

**Using the Detail Page:**
```jsx
import DriveableDetail from './Saksham/DriveableDetail';

const driveable = {
  id: 1,
  name: 'Honda City',
  category: 'cars',
  image: 'path/to/image.jpg',
  hourlyRate: 15,
  dayRate: 100,
  rating: 4.5,
  location: 'Downtown',
  specifications: {
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: 5
  }
};

<DriveableDetail 
  driveable={driveable} 
  onClose={() => console.log('Closed')} 
/>
```

**Using License Verification:**
```jsx
import LicenseVerification from './Saksham/LicenseVerification';

<LicenseVerification 
  isVerified={false}
  onVerificationComplete={() => console.log('Verified!')}
/>
```

## Data Structure

### Driveable Object Schema
```javascript
{
  id: Number,                    // Unique identifier
  name: String,                  // Vehicle name
  category: String,              // 'cars' | 'bikes' | 'evs' | 'bicycles'
  image: String,                 // Image URL
  hourlyRate: Number,            // Hourly rental rate
  dayRate: Number,               // Optional daily rate
  rating: Number,                // Rating (0-5)
  location: String,              // Location name
  specifications: {
    fuelType?: String,           // For motorized vehicles
    transmission?: String,       // Automatic/Manual
    seatingCapacity?: Number,    // Number of seats
    range?: String,              // Range for EVs
    type?: String,               // Type for bicycles
    gears?: String,              // Gear system for bicycles
    frameMaterial?: String       // Frame material for bicycles
  }
}
```

## Styling

All styles are contained in `Driveables.css` with:
- Modern design with gradients and shadows
- Fully responsive layout
- Mobile-first approach
- Smooth transitions and animations
- Consistent color scheme (Primary: #667eea, #764ba2)
- Accessible UI elements

## Key Features Summary

✅ **Complete rental workflow** from browsing to booking  
✅ **Category-based filtering** for easy navigation  
✅ **Flexible pricing** with hourly and daily options  
✅ **License verification** for security and compliance  
✅ **Clear cancellation policy** with multiple tiers  
✅ **Responsive design** for all devices  
✅ **Pagination** for large datasets  
✅ **Extra charge warnings** for time exceeded  
✅ **Image galleries** for better vehicle showcase  
✅ **Real-time calculations** for pricing  

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

- All components are created in the `Saksham` folder without modifying any existing code
- Mock data is included for demonstration purposes
- Replace placeholder images with actual vehicle images
- Integrate with your backend API by replacing mock data calls
- License validation pattern can be customized based on your region
- All prices are in USD (can be customized)

## Future Enhancements

- Backend API integration
- Real-time availability checking
- Payment gateway integration
- User reviews and ratings
- Booking history
- Favorite/Wishlist functionality
- Map integration for location selection
- Multi-language support
- Dark mode theme

---

**Created for RentifyX - The Complete Rental Solution**
