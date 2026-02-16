import { Link } from 'react-router-dom';
import {
    ListChecks,
    CalendarCheck,
    Star,
    DollarSign,
    TrendingUp,
    CheckCircle,
    Clock,
    Plus,
    Home,
    Car,
    ArrowUpRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    // Mock data
    const stats = {
        totalListings: 24,
        totalBookings: 156,
        averageRating: 4.8,
        totalEarnings: 45680
    };

    const quickStats = [
        { icon: Clock, label: 'Active Bookings', value: 8, color: 'blue' },
        { icon: CheckCircle, label: 'Completed Bookings', value: 148, color: 'green' },
        { icon: TrendingUp, label: 'This Month Revenue', value: '$3,420', color: 'orange' }
    ];

    const recentActivity = [
        { id: 1, type: 'booking', title: 'New booking for Ocean View', time: '2h ago', icon: CalendarCheck, color: '#F97316' },
        { id: 2, type: 'review', title: '5-star review from John', time: '5h ago', icon: Star, color: '#F59E0B' },
        { id: 3, type: 'earning', title: 'Payment received: $450', time: '1d ago', icon: DollarSign, color: '#10B981' },
    ];

    const revenueData = [
        { name: 'Jan', revenue: 4000 },
        { name: 'Feb', revenue: 3000 },
        { name: 'Mar', revenue: 5000 },
        { name: 'Apr', revenue: 2780 },
        { name: 'May', revenue: 1890 },
        { name: 'Jun', revenue: 2390 },
        { name: 'Jul', revenue: 3490 },
    ];

    const upcomingSchedule = [
        { id: 1, title: 'Check-in: Sarah Connor', time: '10:00 AM', type: 'Check-in' },
        { id: 2, title: 'Vehicle Maintenance: Honda City', time: '02:00 PM', type: 'Maintenance' },
        { id: 3, title: 'Check-out: Mike Ross', time: '11:00 AM', type: 'Check-out' },
    ];

    return (
        <div className="seller-dashboard">
            {/* Extended Welcome Section */}
            <div className="seller-welcome-section">
                <div className="seller-welcome-text">
                    <h2>Hi, Alex! 👋</h2>
                    <p>Here's what's happening with your properties today.</p>
                </div>
                <div className="seller-date-display">
                    <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            {/* Overview Cards - Now with more whitespace */}
            <div className="seller-cards-grid">
                <div className="seller-card">
                    <div className="seller-card-header">
                        <div className="seller-card-icon">
                            <ListChecks />
                        </div>
                        <span className="seller-card-change positive">+3 new</span>
                    </div>
                    <div className="seller-card-content">
                        <div className="seller-card-value">{stats.totalListings}</div>
                        <div className="seller-card-label">Total Listings</div>
                    </div>
                </div>

                <div className="seller-card">
                    <div className="seller-card-header">
                        <div className="seller-card-icon">
                            <CalendarCheck />
                        </div>
                        <span className="seller-card-change positive">+12%</span>
                    </div>
                    <div className="seller-card-content">
                        <div className="seller-card-value">{stats.totalBookings}</div>
                        <div className="seller-card-label">Total Bookings</div>
                    </div>
                </div>

                <div className="seller-card">
                    <div className="seller-card-header">
                        <div className="seller-card-icon">
                            <Star />
                        </div>
                        <span className="seller-card-change positive">4.8 avg</span>
                    </div>
                    <div className="seller-card-content">
                        <div className="seller-card-value">{stats.averageRating}</div>
                        <div className="seller-card-label">Average Rating</div>
                    </div>
                </div>

                <div className="seller-card">
                    <div className="seller-card-header">
                        <div className="seller-card-icon">
                            <DollarSign />
                        </div>
                        <span className="seller-card-change positive">+18%</span>
                    </div>
                    <div className="seller-card-content">
                        <div className="seller-card-value">${stats.totalEarnings.toLocaleString()}</div>
                        <div className="seller-card-label">Total Earnings</div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid: Charts & Activity */}
            <div className="seller-dashboard-grid">

                {/* Left Column: Charts */}
                <div className="seller-dashboard-main">
                    <div className="seller-chart-section">
                        <div className="seller-section-header">
                            <h3>Revenue Trends</h3>
                            <select className="seller-chart-select">
                                <option>Last 6 Months</option>
                                <option>This Year</option>
                            </select>
                        </div>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#F97316" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Quick Stats Row below chart */}
                    <div className="seller-quick-stats-row">
                        {quickStats.map((stat, index) => (
                            <div key={index} className="seller-quick-stat-card">
                                <div className={`seller-stat-icon-small ${stat.color}`}>
                                    <stat.icon size={18} />
                                </div>
                                <div>
                                    <span className="seller-quick-stat-value">{stat.value}</span>
                                    <span className="seller-quick-stat-label">{stat.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Schedule & Activity */}
                <div className="seller-dashboard-sidebar">

                    {/* Quick Actions - Moved to sidebar for better access */}
                    <div className="seller-action-card">
                        <h3>Quick Actions</h3>
                        <div className="seller-action-buttons">
                            <Link to="/seller/add-dwellings" className="seller-action-btn primary">
                                <Plus size={18} /> Add Dwelling
                            </Link>
                            <Link to="/seller/add-vehicles" className="seller-action-btn secondary">
                                <Car size={18} /> Add Vehicle
                            </Link>
                        </div>
                    </div>

                    <div className="seller-sidebar-section">
                        <h3>Today's Schedule</h3>
                        <div className="seller-schedule-list">
                            {upcomingSchedule.map(item => (
                                <div key={item.id} className="seller-schedule-item">
                                    <div className="seller-schedule-time">{item.time}</div>
                                    <div className="seller-schedule-info">
                                        <h4>{item.title}</h4>
                                        <span className={`schedule-badge ${item.type.toLowerCase()}`}>{item.type}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="seller-sidebar-section">
                        <h3>Recent Activity</h3>
                        <div className="seller-activity-list-compact">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="seller-activity-item-compact">
                                    <div className="seller-activity-icon-compact" style={{ color: activity.color, background: `${activity.color}15` }}>
                                        <activity.icon size={16} />
                                    </div>
                                    <div className="seller-activity-content">
                                        <p className="activity-text">{activity.title}</p>
                                        <span className="activity-time">{activity.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
