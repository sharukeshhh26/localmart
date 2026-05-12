import React, { useState } from 'react';

const STATS = {
  customer: [
    { label: 'Shops visited',  value: '24' },
    { label: 'Reviews given',  value: '8' },
    { label: 'Favourites',     value: '5' },
    { label: 'Comparisons',    value: '12' },
  ],
  vendor: [
    { label: 'Products listed', value: '18' },
    { label: 'Views today',     value: '47' },
    { label: 'Trust score',     value: '88%' },
    { label: 'Rating',          value: '4.6 ⭐' },
  ],
  admin: [
    { label: 'Vendors managed', value: '32' },
    { label: 'IoT devices',     value: '14' },
    { label: 'Pending reviews', value: '3' },
    { label: 'Active today',    value: '28' },
  ],
};

const ROLE_COLOR = {
  customer: '#6366f1',
  vendor: '#059669',
  admin: '#dc2626',
};

export default function ProfilePage({ user, role, onBack }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const stats = STATS[role] || [];
  const accent = ROLE_COLOR[role];

  return (
    <div className="profile-page">
      {/* Back */}
      <div className="profile-back" onClick={onBack}>
        ← Back
      </div>

      {/* Hero */}
      <div className="profile-hero" style={{ '--accent': accent }}>
        <div className="profile-avatar-lg">{user?.avatar}</div>
        <div className="profile-hero-name">{editing ? name : user?.name}</div>
        <div className="profile-hero-role">{role.charAt(0).toUpperCase() + role.slice(1)} Account</div>
        <div className="profile-hero-meta">{user?.location} · Member since {user?.joined}</div>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        {stats.map(s => (
          <div className="profile-stat-box" key={s.label}>
            <div className="profile-stat-val" style={{ color: accent }}>{s.value}</div>
            <div className="profile-stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Details card */}
      <div className="profile-card">
        <div className="profile-card-hd">
          <span>Account Details</span>
          <button className="profile-edit-btn" onClick={() => setEditing(e => !e)}>
            {editing ? 'Save' : 'Edit'}
          </button>
        </div>

        <div className="profile-field">
          <label>Full Name</label>
          {editing
            ? <input value={name} onChange={e => setName(e.target.value)} className="profile-input" />
            : <div className="profile-field-val">{user?.name}</div>
          }
        </div>
        <div className="profile-field">
          <label>Email</label>
          <div className="profile-field-val">{user?.email}</div>
        </div>
        <div className="profile-field">
          <label>Phone</label>
          {editing
            ? <input value={phone} onChange={e => setPhone(e.target.value)} className="profile-input" />
            : <div className="profile-field-val">{user?.phone}</div>
          }
        </div>
        <div className="profile-field">
          <label>Location</label>
          <div className="profile-field-val">{user?.location}</div>
        </div>
      </div>

      {/* Preferences */}
      <div className="profile-card">
        <div className="profile-card-hd"><span>Preferences</span></div>
        {[
          ['Push Notifications', true],
          ['Email Alerts', false],
          ['Price Drop Alerts', true],
        ].map(([label, def]) => {
          const [on, setOn] = React.useState(def);
          return (
            <div className="profile-pref-row" key={label}>
              <span>{label}</span>
              <div
                className={`profile-toggle ${on ? 'on' : ''}`}
                style={{ '--t-color': accent }}
                onClick={() => setOn(v => !v)}
              >
                <div className="profile-toggle-knob" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
