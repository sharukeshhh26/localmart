import React from 'react';

export default function TopBar({ role, user, onMenuToggle, onProfile }) {
  return (
    <header className="topbar">
      <button className="topbar-menu-btn" onClick={onMenuToggle}>
        <span /><span /><span />
      </button>

      <div className="topbar-brand">
        local<span>mart</span>
      </div>

      <div className="topbar-location">
        <span className="topbar-loc-dot" />
        Coimbatore
      </div>

      <button className="topbar-avatar" onClick={onProfile} title="Profile">
        {user?.avatar}
      </button>
    </header>
  );
}
