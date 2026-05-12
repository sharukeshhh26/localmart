import React, { useState } from 'react';
import Sidebar from './components/shared/Sidebar';
import TopBar from './components/shared/TopBar';
import LoginModal from './components/shared/LoginModal';
import CustomerHome from './components/customer/CustomerHome';
import VendorDashboard from './components/vendor/VendorDashboard';
import AdminPanel from './components/admin/AdminPanel';
import ProfilePage from './components/shared/ProfilePage';
import './styles/App.css';

const USERS = {
  customer: { name: 'Arjun Kumar', email: 'arjun@gmail.com', avatar: 'AK', phone: '+91 98765 43210', location: 'Coimbatore, TN', joined: 'Jan 2024' },
  vendor:   { name: 'Ravi Stores', email: 'ravi@localmart.in', avatar: 'RS', phone: '+91 99887 76655', location: 'RS Puram, Coimbatore', joined: 'Mar 2023' },
  admin:    { name: 'Admin Desk', email: 'admin@localmart.in', avatar: 'AD', phone: '+91 80001 00001', location: 'LocalMart HQ', joined: 'Jan 2022' },
};

export default function App() {
  const [role, setRole] = useState(null); // null = not logged in
  const [page, setPage] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    setShowLogin(false);
    setPage('home');
  };

  const handleLogout = () => {
    setRole(null);
    setShowLogin(true);
    setPage('home');
    setSidebarOpen(false);
  };

  const switchRole = (newRole) => {
    setRole(newRole);
    setPage('home');
    setSidebarOpen(false);
  };

  const user = role ? USERS[role] : null;

  return (
    <div className="app-shell">
      {/* Login modal when not logged in */}
      {showLogin && <LoginModal onLogin={handleLogin} />}

      {role && (
        <>
          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            role={role}
            user={user}
            currentPage={page}
            onNavigate={(p) => { setPage(p); setSidebarOpen(false); }}
            onSwitchRole={switchRole}
            onLogout={handleLogout}
          />

          <div className={`main-area ${sidebarOpen ? 'sidebar-pushed' : ''}`}>
            <TopBar
              role={role}
              user={user}
              onMenuToggle={() => setSidebarOpen(o => !o)}
              onProfile={() => setPage('profile')}
            />

            <div className="content-zone">
              {page === 'profile' && <ProfilePage user={user} role={role} onBack={() => setPage('home')} />}
              {page === 'home' && role === 'customer' && <CustomerHome />}
              {page === 'home' && role === 'vendor'   && <VendorDashboard vendorId={1} />}
              {page === 'home' && role === 'admin'    && <AdminPanel />}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
