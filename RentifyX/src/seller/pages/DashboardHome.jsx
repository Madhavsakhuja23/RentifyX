import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Home,
  Car,
  IndianRupee,
  Clock,
  MessageCircle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../api';
import './DashboardHome.css';
import './DashboardHomeStyles.css';

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [revenueRange, setRevenueRange] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsRes, activityRes, revenueRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/activity'),
          api.get(`/dashboard/revenue?range=${revenueRange}`)
        ]);
        
        setStats(statsRes);
        setActivity(activityRes.activity || []);
        setRevenueData(revenueRes.data || []);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Poll every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [revenueRange]);

  const kpiCards = stats ? [
    {
      label: 'Active Listings',
      value: stats.activeListings,
      icon: Home,
      color: '#6366f1',
    },
    {
      label: 'Total Earnings',
      value: `₹${stats.totalEarnings.toLocaleString()}`,
      icon: IndianRupee,
      color: '#10b981',
    },
    {
      label: 'Ongoing Bookings',
      value: stats.ongoingBookings,
      icon: Clock,
      color: '#f59e0b',
    },
    {
      label: 'Unread Messages',
      value: stats.unreadMessages,
      icon: MessageCircle,
      color: '#ec4899',
    }
  ] : [];

  function getActivityDot(type) {
    const colors = {
      booking: '#10b981',
      enquiry: '#f59e0b',
    };
    return colors[type] || '#6366f1';
  }

  return (
    <div className="dashboard-home">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Here's what's happening with your listings today.</p>
      </div>

      <div className="stats-grid">
        {loading && !stats ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="stat-card skeleton-card">
               <div className="skeleton-icon"></div>
               <div className="skeleton-text">
                  <div className="skeleton-line short"></div>
                  <div className="skeleton-line long"></div>
               </div>
            </div>
          ))
        ) : (
          kpiCards.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <div className="stat-icon-wrap" style={{ background: `${stat.color}15` }}>
                <stat.icon size={22} style={{ color: stat.color }} />
              </div>
              <div className="stat-info">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{stat.value}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="dashboard-sections">
        
        {/* Revenue Chart Section */}
        <div className="section-card revenue-chart-section">
          <div className="section-header-flex">
            <h3>Revenue Overview</h3>
            <div className="chart-toggles">
              <button className={revenueRange === 'week' ? 'active' : ''} onClick={() => setRevenueRange('week')}>Week</button>
              <button className={revenueRange === 'month' ? 'active' : ''} onClick={() => setRevenueRange('month')}>Month</button>
              <button className={revenueRange === 'year' ? 'active' : ''} onClick={() => setRevenueRange('year')}>Year</button>
            </div>
          </div>
          <div className="chart-container" style={{ height: '300px', marginTop: '20px' }}>
            {loading && revenueData.length === 0 ? (
              <div className="loading-placeholder">Loading chart...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    labelFormatter={(val) => new Date(val).toLocaleDateString()}
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#ea580c" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="side-sections">
          <div className="section-card recent-activity">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {loading && activity.length === 0 ? (
                <div className="loading-placeholder">Loading activity...</div>
              ) : activity.length === 0 ? (
                <div className="empty-state-text">No recent activity</div>
              ) : (
                activity.map((a) => (
                  <div className="activity-item" key={a.id}>
                    <div
                      className="activity-dot"
                      style={{ background: getActivityDot(a.type) }}
                    />
                    <div className="activity-text">
                      <p>{a.text}</p>
                      <span>{formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="section-card quick-actions" style={{ marginTop: '32px' }}>
            <h3>Quick Actions</h3>
            <div className="actions-list">
              <Link to="/seller/add-listing" className="action-btn">
                <Home size={18} />
                Add Dwelling
              </Link>
              <Link to="/seller/add-listing" className="action-btn">
                <Car size={18} />
                Add Vehicle
              </Link>
              <Link to="/seller/listings" className="action-btn">
                <TrendingUp size={18} />
                Manage Listings
              </Link>
              <Link to="/seller/messages" className="action-btn">
                <MessageCircle size={18} />
                Inbox
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
