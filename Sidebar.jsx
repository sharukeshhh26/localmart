import React from 'react';

const NAV = {
  customer: [
    { id: 'home',    icon: '◎', label: 'Discover Shops' },
    { id: 'profile', icon: '◉', label: 'My Profile' },
  ],
  vendor: [
    { id: 'home',    icon: '◎', label: 'Dashboard' },
    { id: 'profile', icon: '◉', label: 'My Profile' },
  ],
  admin: [
    { id: 'home',    icon: '◎', label: 'Admin Panel' },
    { id: 'profile', icon: '◉', label: 'My Profile' },
  ],
};

const ROLE_BADGE = {
  customer: { label: 'Customer', color: '#6366f1', bg: '#eef2ff' },
  vendor:   { label: 'Vendor',   color: '#059669', bg: '#ecfdf5' },
  admin:    { label: 'Admin',    color: '#dc2626', bg: '#fef2f2' },
};

export default function Sidebar({ open, onClose, role, user, currentPage, onNavigate, onSwitchRole, onLogout }) {
  const badge = ROLE_BADGE[role];
  const links = NAV[role] || [];

  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">local<span>mart</span></div>
          <button className="sidebar-close" onClick={onClose}>✕</button>
        </div>

        {/* User card */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">{user?.avatar}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-email">{user?.email}</div>
          </div>
          <span className="sidebar-badge" style={{ background: badge.bg, color: badge.color }}>
            {badge.label}
          </span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-label">Navigation</div>
          {links.map(l => (
            <button
              key={l.id}
              className={`sidebar-link ${currentPage === l.id ? 'active' : ''}`}
              onClick={() => onNavigate(l.id)}
            >
              <span className="sidebar-link-icon">{l.icon}</span>
              {l.label}
            </button>
          ))}
        </nav>

        {/* Switch Role */}
        <div className="sidebar-section">
          <div className="sidebar-nav-label">Switch Role</div>
          {['customer', 'vendor', 'admin'].filter(r => r !== role).map(r => (
            <button key={r} className="sidebar-switch-btn" onClick={() => onSwitchRole(r)}>
              <span style={{ background: ROLE_BADGE[r].bg, color: ROLE_BADGE[r].color, padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                {ROLE_BADGE[r].label}
              </span>
              <span className="sidebar-switch-arrow">→</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
