# Quick Start Guide - Driveables Module

## Getting Started in 3 Steps

### Step 1: Import the Main Component
Open your `App.jsx` file and import the Driveables module:

```jsx
import DriveablesMain from './Saksham/DriveablesMain';
// Or use named import
// import { DriveablesMain } from './Saksham';
```

### Step 2: Use in Your App
Replace or add the component to your App:

```jsx
import DriveablesMain from './Saksham/DriveablesMain';
import './App.css';

function App() {
  return (
    <div className="App">
      <DriveablesMain />
    </div>
  );
}

export default App;
```

### Step 3: Run Your Development Server
If not already running, start the development server:

```bash
npm run dev
```

Then open your browser to the URL shown (typically http://localhost:5173)

## That's it! 🎉

You should now see the Driveables rental hub with:
- Category filters (Cars, Bikes & Scooters, EVs, Bicycles)
- Listing cards with vehicle information
- Pagination
- Fully functional detail pages with:
  - Pricing calculator
  - License verification
  - Cancellation policy
  - Booking system

## Customization Options

### Change the Number of Items Per Page
In `DriveablesMain.jsx`, line 12:
```jsx
const itemsPerPage = 12; // Change this number
```

### Add Your Own Vehicle Data
In `DriveablesMain.jsx`, replace the mock data in the `useEffect` hook (starting around line 16) with your API call:

```jsx
useEffect(() => {
  // Replace this with your API call
  fetch('/api/driveables')
    .then(res => res.json())
    .then(data => setDriveables(data));
}, []);
```

### Customize Colors
Edit `Driveables.css` and change the gradient colors:
```css
/* Current gradient: Purple/Blue */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change to your brand colors */
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
```

## Component-Level Usage

### Use Individual Components
You can also use individual components separately:

```jsx
import { DriveableCard, Pagination } from './Saksham';

// Use in your custom page
<DriveableCard driveable={vehicleData} />
<Pagination currentPage={1} totalPages={5} onPageChange={handlePage} />
```

## Testing the Features

1. **Filter Vehicles**: Click on category buttons (Cars, Bikes, EVs, Bicycles)
2. **View Details**: Click "View Details" on any vehicle card
3. **Verify License**: In detail page, click "Verify License"
4. **Check Pricing**: Change hours/days to see price updates
5. **Read Policy**: Expand the cancellation policy section
6. **Navigate Pages**: Use pagination at the bottom

## Need Help?

Check the full README.md in the Saksham folder for:
- Complete API documentation
- Data structure details
- Advanced customization
- Troubleshooting tips

## Example: Custom Integration

```jsx
import { useState } from 'react';
import DriveablesMain from './Saksham/DriveablesMain';

function App() {
  return (
    <div className="App">
      {/* Your header */}
      <header>
        <h1>Welcome to RentifyX</h1>
        <nav>{/* Your navigation */}</nav>
      </header>

      {/* Driveables Module */}
      <main>
        <DriveablesMain />
      </main>

      {/* Your footer */}
      <footer>
        <p>© 2026 RentifyX</p>
      </footer>
    </div>
  );
}

export default App;
```

Happy Renting! 🚗🏍️⚡🚴
