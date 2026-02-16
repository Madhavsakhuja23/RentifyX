import { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    TrendingUp,
    Star,
    DollarSign,
    Calendar,
    Home,
    Car,
    ArrowUp,
    ArrowDown
} from 'lucide-react';

const Analytics = () => {
    const [timeFilter, setTimeFilter] = useState('6months');

    // Revenue data
    const revenueData = [
        { month: 'Aug', dwellings: 4500, vehicles: 2100 },
        { month: 'Sep', dwellings: 5200, vehicles: 2800 },
        { month: 'Oct', dwellings: 4800, vehicles: 3200 },
        { month: 'Nov', dwellings: 6100, vehicles: 2900 },
        { month: 'Dec', dwellings: 7200, vehicles: 3800 },
        { month: 'Jan', dwellings: 5900, vehicles: 3400 },
    ];

    // Booking trends
    const bookingData = [
        { day: 'Mon', bookings: 12 },
        { day: 'Tue', bookings: 18 },
        { day: 'Wed', bookings: 15 },
        { day: 'Thu', bookings: 22 },
        { day: 'Fri', bookings: 28 },
        { day: 'Sat', bookings: 35 },
        { day: 'Sun', bookings: 30 },
    ];

    // Category breakdown
    const categoryData = [
        { name: 'Houses', value: 35, color: '#F97316' },
        { name: 'Flats', value: 28, color: '#FB923C' },
        { name: 'PGs', value: 20, color: '#FDBA74' },
        { name: 'Vehicles', value: 17, color: '#FED7AA' },
    ];

    // Ratings data
    const ratingsData = [
        { listing: 'Ocean View Apt', rating: 4.9, reviews: 45 },
        { listing: 'City Center Flat', rating: 4.7, reviews: 38 },
        { listing: 'Beach House', rating: 4.8, reviews: 52 },
        { listing: 'Honda City', rating: 4.6, reviews: 28 },
        { listing: 'Sunset Villa', rating: 4.9, reviews: 61 },
    ];

    return (
        <div className="seller-analytics">
            {/* Page Header */}
            <div className="seller-page-header">
                <h1>Analytics</h1>
                <p>Track your performance and revenue insights</p>
            </div>

            {/* Stats Overview */}
            <div className="seller-cards-grid">
                <div className="seller-card">
                    <div className="seller-card-header">
                        <div className="seller-card-icon">
                            <DollarSign />
                        </div>
                        <span className="seller-card-change positive">
                            <ArrowUp size={14} /> 18%
                        </span>
                    </div>
                    <div className="seller-card-value">$45,680</div>
                    <div className="seller-card-label">Total Revenue</div>
                </div>

                <div className="seller-card">
                    <div className="seller-card-header">
                        <div className="seller-card-icon">
                            <Star />
                        </div>
                        <span className="seller-card-change positive">
                            <ArrowUp size={14} /> 0.3
                        </span>
                    </div>
                    <div className="seller-card-value">4.8</div>
                    <div className="seller-card-label">Average Rating</div>
                </div>

                <div className="seller-card">
                    <div className="seller-card-header">
                        <div className="seller-card-icon">
                            <Calendar />
                        </div>
                        <span className="seller-card-change negative">
                            <ArrowDown size={14} /> 5%
                        </span>
                    </div>
                    <div className="seller-card-value">156</div>
                    <div className="seller-card-label">Total Bookings</div>
                </div>

                <div className="seller-card">
                    <div className="seller-card-header">
                        <div className="seller-card-icon">
                            <TrendingUp />
                        </div>
                        <span className="seller-card-change positive">
                            <ArrowUp size={14} /> 24%
                        </span>
                    </div>
                    <div className="seller-card-value">78%</div>
                    <div className="seller-card-label">Occupancy Rate</div>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="seller-chart-container">
                <div className="seller-chart-header">
                    <h3>Revenue Overview</h3>
                    <div className="seller-chart-filters">
                        <button
                            className={`seller-chart-filter-btn ${timeFilter === '3months' ? 'active' : ''}`}
                            onClick={() => setTimeFilter('3months')}
                        >
                            3 Months
                        </button>
                        <button
                            className={`seller-chart-filter-btn ${timeFilter === '6months' ? 'active' : ''}`}
                            onClick={() => setTimeFilter('6months')}
                        >
                            6 Months
                        </button>
                        <button
                            className={`seller-chart-filter-btn ${timeFilter === '1year' ? 'active' : ''}`}
                            onClick={() => setTimeFilter('1year')}
                        >
                            1 Year
                        </button>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="month" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip
                            contentStyle={{
                                background: 'white',
                                border: '1px solid #E2E8F0',
                                borderRadius: '8px'
                            }}
                        />
                        <Bar dataKey="dwellings" fill="#F97316" radius={[4, 4, 0, 0]} name="Dwellings" />
                        <Bar dataKey="vehicles" fill="#FED7AA" radius={[4, 4, 0, 0]} name="Vehicles" />
                    </BarChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#F97316' }}></div>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Dwellings</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#FED7AA' }}></div>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Vehicles</span>
                    </div>
                </div>
            </div>

            {/* Two Column Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                {/* Booking Trends */}
                <div className="seller-chart-container">
                    <div className="seller-chart-header">
                        <h3>Booking Trends (Weekly)</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={bookingData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                            <XAxis dataKey="day" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip
                                contentStyle={{
                                    background: 'white',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '8px'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="bookings"
                                stroke="#F97316"
                                strokeWidth={3}
                                dot={{ fill: '#F97316', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Breakdown */}
                <div className="seller-chart-container">
                    <div className="seller-chart-header">
                        <h3>Category Breakdown</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ResponsiveContainer width="60%" height={250}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {categoryData.map((item, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: item.color }}></div>
                                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{item.name} ({item.value}%)</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Ratings & Reviews */}
            <div className="seller-chart-container">
                <div className="seller-chart-header">
                    <h3>Ratings & Reviews by Listing</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {ratingsData.map((item, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '12px 16px',
                            background: '#F8FAFC',
                            borderRadius: '10px'
                        }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '600', color: '#1a1a2e', marginBottom: '4px' }}>{item.listing}</div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{item.reviews} reviews</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Star size={18} fill="#F59E0B" color="#F59E0B" />
                                <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1a1a2e' }}>{item.rating}</span>
                            </div>
                            <div style={{
                                width: '120px',
                                height: '8px',
                                background: '#E2E8F0',
                                borderRadius: '4px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${(item.rating / 5) * 100}%`,
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #F97316, #FB923C)',
                                    borderRadius: '4px'
                                }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
