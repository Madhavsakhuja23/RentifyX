import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  List,
  PlusCircle,
  History,
  BarChart3,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';
import './DashboardLayout.css';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/dashboard/listings', icon: List, label: 'My Listings' },
  { to: '/dashboard/add-listing', icon: PlusCircle, label: 'Add Listing' },
  { to: '/dashboard/rental-history', icon: History, label: 'Rental History' },
  { to: '/dashboard/revenue', icon: BarChart3, label: 'Revenue & Analytics' },
  { to: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
  { to: '/dashboard/profile', icon: User, label: 'Profile Settings' },
];

export default function DashboardLayout() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logOut();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'S';

  return (
    <div className={`dashboard-layout ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            {sidebarOpen && <span className="brand-text">RentifyX</span>}
          </div>
          <button
            className="sidebar-toggle desktop-only"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Collapse' : 'Expand'}
          >
            <ChevronLeft className={`toggle-icon ${sidebarOpen ? '' : 'rotated'}`} size={18} />
          </button>
          <button
            className="sidebar-close mobile-only"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setMobileOpen(false)}
            >
              <item.icon size={20} className="nav-icon" />
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-link logout-btn" onClick={handleLogout}>
            <LogOut size={20} className="nav-icon" />
            {sidebarOpen && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu-btn mobile-only"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div className="topbar-greeting">
            <h2>Welcome, <span className="greeting-name">{user?.name || 'Seller'}</span></h2>
          </div>
          <div className="topbar-actions">
            <NavLink to="/dashboard/notifications" className="topbar-bell">
              <Bell size={20} />
              <span className="bell-badge">3</span>
            </NavLink>
            <div className="topbar-avatar" title={user?.name || 'Seller'}>
              {initials}
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
