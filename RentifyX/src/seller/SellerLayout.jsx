import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    BarChart3,
    MessageSquare,
    Home,
    Car,
    LogOut,
    Building2
} from 'lucide-react';
import './SellerLayout.css';

const SellerLayout = () => {
    const location = useLocation();

    const navItems = [
        { path: '/seller/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/seller/analytics', icon: BarChart3, label: 'Analytics' },
        { path: '/seller/messages', icon: MessageSquare, label: 'Messages', badge: 3 },
        { path: '/seller/add-dwellings', icon: Home, label: 'Add Dwellings' },
        { path: '/seller/add-vehicles', icon: Car, label: 'Add Vehicles' },
    ];

    return (
        <div className="seller-layout">
            {/* Sidebar */}
            <aside className="seller-sidebar">
                {/* Logo */}
                <div className="seller-logo">
                    <h1>
                        <Building2 size={28} />
                        <span>RentifyX</span>
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="seller-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `seller-nav-link ${isActive ? 'active' : ''}`
                            }
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                            {item.badge && <span className="badge">{item.badge}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div className="seller-logout">
                    <a href="/" className="seller-nav-link">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <main className="seller-main">
                <Outlet />
            </main>
        </div>
    );
};

export default SellerLayout;
