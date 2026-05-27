import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  List,
  PlusCircle,
  History,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import './DashboardLayout.css';

const navItems = [
  { to: '/seller/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/seller/listings', icon: List, label: 'My Listings' },
  { to: '/seller/add-listing', icon: PlusCircle, label: 'Add Listing' },
  { to: '/seller/history', icon: History, label: 'Rental History' },
  { to: '/seller/notifications', icon: Bell, label: 'Notifications' },
  { to: '/seller/profile', icon: User, label: 'Profile Settings' },
];

export default function DashboardLayout() {
  const { user, logOut } = useAuth();
  const { unreadCount } = useSocket() || { unreadCount: 0 };
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

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
    <div className={`seller-dashboard-layout ${sidebarOpen ? '' : 'seller-sidebar-collapsed'}`}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="seller-sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`seller-sidebar ${mobileOpen ? 'seller-mobile-open' : ''}`}>
        <div className="seller-sidebar-header">
          <div className="seller-sidebar-brand">
            {sidebarOpen && <span className="seller-brand-text">RentifyX</span>}
          </div>
          <button
            className="seller-sidebar-toggle seller-desktop-only"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Collapse' : 'Expand'}
          >
            <ChevronLeft className={`seller-toggle-icon ${sidebarOpen ? '' : 'seller-rotated'}`} size={18} />
          </button>
          <button
            className="seller-sidebar-close seller-mobile-only"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="seller-sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `seller-nav-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setMobileOpen(false)}
            >
              <item.icon size={20} className="nav-icon" />
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="seller-sidebar-footer">
          <button className="seller-nav-link logout-btn" onClick={handleLogout}>
            <LogOut size={20} className="nav-icon" />
            {sidebarOpen && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="seller-main-area">
        <header className="seller-topbar">
          <button
            className="seller-mobile-menu-btn seller-mobile-only"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div className="seller-topbar-greeting">
            <h2>Welcome, <span className="seller-greeting-name">{user?.name || 'Seller'}</span></h2>
          </div>
          <div className="seller-topbar-actions">
            <NavLink to="/seller/notifications" className="seller-topbar-bell">
              <Bell size={20} />
              {unreadCount > 0 && <span className="seller-bell-badge">{unreadCount}</span>}
            </NavLink>
            <div className="seller-topbar-avatar" title={user?.name || 'Seller'}>
              {initials}
            </div>
          </div>
        </header>

        <main className="seller-dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
