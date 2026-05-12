import React, { useState } from 'react';

const ROLES = [
  {
    id: 'customer',
    label: 'Customer',
    desc: 'Browse local shops, compare prices, track orders',
    icon: '🛍️',
    color: '#6366f1',
    bg: '#eef2ff',
  },
  {
    id: 'vendor',
    label: 'Vendor',
    desc: 'Manage your shop, sync IoT device, update prices',
    icon: '🏪',
    color: '#059669',
    bg: '#ecfdf5',
  },
  {
    id: 'admin',
    label: 'Admin',
    desc: 'Approve vendors, monitor IoT devices, manage platform',
    icon: '⚙️',
    color: '#dc2626',
    bg: '#fef2f2',
  },
];

export default function LoginModal({ onLogin }) {
  const [selected, setSelected] = useState('customer');
  const [animating, setAnimating] = useState(false);

  const handleLogin = () => {
    setAnimating(true);
    setTimeout(() => onLogin(selected), 400);
  };

  return (
    <div className={`login-overlay ${animating ? 'fade-out' : ''}`}>
      <div className="login-bg-pattern" />
      <div className="login-card">
        <div className="login-logo">
          local<span>mart</span>
          <div className="login-logo-dot" />
        </div>
        <h2 className="login-title">Welcome back</h2>
        <p className="login-sub">Choose your role to continue</p>

        <div className="role-cards">
          {ROLES.map(r => (
            <div
              key={r.id}
              className={`role-option ${selected === r.id ? 'selected' : ''}`}
              style={{ '--role-color': r.color, '--role-bg': r.bg }}
              onClick={() => setSelected(r.id)}
            >
              <div className="role-option-icon">{r.icon}</div>
              <div className="role-option-body">
                <div className="role-option-label">{r.label}</div>
                <div className="role-option-desc">{r.desc}</div>
              </div>
              <div className="role-option-radio">
                {selected === r.id && <div className="role-option-dot" />}
              </div>
            </div>
          ))}
        </div>

        <button className="login-btn" onClick={handleLogin}>
          Continue as {ROLES.find(r => r.id === selected)?.label}
          <span className="login-btn-arrow">→</span>
        </button>

        <p className="login-notice">Demo mode — no real auth required</p>
      </div>
    </div>
  );
}
