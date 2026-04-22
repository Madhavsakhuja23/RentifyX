import {
  TrendingUp,
  Home,
  Car,
  IndianRupee,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useListings } from '../../context/ListingsContext';
import './DashboardHome.css';

const dummyStats = [
  {
    label: 'Total Listings',
    value: null, // will be overridden
    icon: Home,
    color: '#6366f1',
    trend: '+12%',
    up: true,
  },
  {
    label: 'Active Rentals',
    value: '8',
    icon: Clock,
    color: '#10b981',
    trend: '+5%',
    up: true,
  },
  {
    label: 'Pending Requests',
    value: '3',
    icon: TrendingUp,
    color: '#f59e0b',
    trend: '-2%',
    up: false,
  },
  {
    label: 'Total Revenue',
    value: '₹1,24,500',
    icon: IndianRupee,
    color: '#8b5cf6',
    trend: '+18%',
    up: true,
  },
  {
    label: 'Monthly Revenue',
    value: '₹32,400',
    icon: IndianRupee,
    color: '#ec4899',
    trend: '+8%',
    up: true,
  },
  {
    label: 'Average Rating',
    value: '4.7',
    icon: Star,
    color: '#f59e0b',
    trend: '+0.2',
    up: true,
  },
];

const recentActivity = [
  {
    id: 1,
    text: 'New rental request from Priya Sharma',
    time: '2 min ago',
    type: 'request',
  },
  {
    id: 2,
    text: 'Payment of ₹4,500 received for "Modern 2BHK Flat"',
    time: '1 hour ago',
    type: 'payment',
  },
  {
    id: 3,
    text: 'Rental completed for "Honda City"',
    time: '3 hours ago',
    type: 'completed',
  },
  {
    id: 4,
    text: 'Booking confirmed by Rahul Verma',
    time: '5 hours ago',
    type: 'confirmed',
  },
  {
    id: 5,
    text: 'New 5-star review on "Luxury Villa"',
    time: '1 day ago',
    type: 'review',
  },
];

function getActivityDot(type) {
  const colors = {
    request: '#f59e0b',
    payment: '#10b981',
    completed: '#6366f1',
    confirmed: '#3b82f6',
    review: '#ec4899',
  };
  return colors[type] || '#6366f1';
}

export default function DashboardHome() {
  const { listings } = useListings();

  const stats = dummyStats.map((s) => {
    if (s.label === 'Total Listings') {
      const dwellings = listings.filter((l) => l.category === 'Dwelling').length;
      const vehicles = listings.filter((l) => l.category === 'Vehicle').length;
      return {
        ...s,
        value: `${listings.length}`,
        subtitle: `${dwellings} Dwellings · ${vehicles} Vehicles`,
      };
    }
    return s;
  });

  return (
    <div className="dashboard-home">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Here&apos;s what&apos;s happening with your listings today.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-icon-wrap" style={{ background: `${stat.color}15` }}>
              <stat.icon size={22} style={{ color: stat.color }} />
            </div>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
              {stat.subtitle && (
                <span className="stat-subtitle">{stat.subtitle}</span>
              )}
            </div>
            <div className={`stat-trend ${stat.up ? 'up' : 'down'}`}>
              {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="section-card recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {recentActivity.map((a) => (
              <div className="activity-item" key={a.id}>
                <div
                  className="activity-dot"
                  style={{ background: getActivityDot(a.type) }}
                />
                <div className="activity-text">
                  <p>{a.text}</p>
                  <span>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card quick-actions">
          <h3>Quick Actions</h3>
          <div className="actions-list">
            <a href="/dashboard/add-listing" className="action-btn">
              <Home size={18} />
              Add Dwelling
            </a>
            <a href="/dashboard/add-listing" className="action-btn">
              <Car size={18} />
              Add Vehicle
            </a>
            <a href="/dashboard/listings" className="action-btn">
              <TrendingUp size={18} />
              View Listings
            </a>
            <a href="/dashboard/revenue" className="action-btn">
              <IndianRupee size={18} />
              View Revenue
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
