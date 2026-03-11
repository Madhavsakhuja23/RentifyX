import { IndianRupee, TrendingUp, CreditCard, Activity } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import './RevenueAnalytics.css';

const revenueData = [
  { name: 'Jan', revenue: 42000 },
  { name: 'Feb', revenue: 38000 },
  { name: 'Mar', revenue: 45000 },
  { name: 'Apr', revenue: 52000 },
  { name: 'May', revenue: 48000 },
  { name: 'Jun', revenue: 61000 },
];

const conversionData = [
  { name: 'Week 1', views: 400, bookings: 24 },
  { name: 'Week 2', views: 300, bookings: 18 },
  { name: 'Week 3', views: 550, bookings: 32 },
  { name: 'Week 4', views: 600, bookings: 45 },
];

export default function RevenueAnalytics() {
  return (
    <div className="revenue-analytics">
      <div className="page-header">
        <h1>Revenue & Analytics</h1>
        <p>Detailed breakdown of your financial performance and listing metrics.</p>
      </div>

      <div className="financial-overview">
        <div className="finance-card primary">
          <div className="finance-icon"><IndianRupee size={24} /></div>
          <div>
            <h3>Total Earnings</h3>
            <p className="finance-value">₹2,86,000</p>
            <span className="finance-trend up">+15.3% from last year</span>
          </div>
          <div className="card-bg-shape"></div>
        </div>
        <div className="finance-card">
          <div className="finance-icon"><TrendingUp size={24} /></div>
          <div>
            <h3>Monthly Earnings</h3>
            <p className="finance-value">₹61,000</p>
            <span className="finance-trend up">+27% from last month</span>
          </div>
        </div>
        <div className="finance-card">
          <div className="finance-icon"><CreditCard size={24} /></div>
          <div>
            <h3>Avg. Booking Value</h3>
            <p className="finance-value">₹12,400</p>
            <span className="finance-trend up">+4.1%</span>
          </div>
        </div>
        <div className="finance-card">
          <div className="finance-icon"><Activity size={24} /></div>
          <div>
            <h3>Conversion Rate</h3>
            <p className="finance-value">8.4%</p>
            <span className="finance-trend down">-1.2%</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Revenue Overview (6 Months)</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  contentStyle={{ background: '#1e1e2d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Bar dataKey="revenue" fill="#ea580c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <h3>Views vs Bookings (Last 4 Weeks)</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conversionData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e1e2d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="views" stroke="#f97316" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                <Line type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="top-performers">
        <h3>Top Performing Listings</h3>
        <div className="perf-list">
          <div className="perf-item">
            <div className="perf-rank">1</div>
            <div className="perf-details">
              <h4>Modern 2BHK Flat</h4>
              <span>Dwelling · 24 Bookings</span>
            </div>
            <div className="perf-revenue">₹1,12,000</div>
          </div>
          <div className="perf-item">
            <div className="perf-rank">2</div>
            <div className="perf-details">
              <h4>Honda City 2023</h4>
              <span>Vehicle · 18 Bookings</span>
            </div>
            <div className="perf-revenue">₹45,000</div>
          </div>
          <div className="perf-item">
            <div className="perf-rank">3</div>
            <div className="perf-details">
              <h4>Luxury Villa</h4>
              <span>Dwelling · 4 Bookings</span>
            </div>
            <div className="perf-revenue">₹1,28,000</div>
          </div>
        </div>
      </div>
    </div>
  );
}
