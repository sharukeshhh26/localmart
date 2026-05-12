import React from 'react';
import { SHOP_IMAGES } from '../../mockData';

function trustBadge(t) {
  if (t >= 92) return { label: 'Highly Trusted', cls: 'trust-hi' };
  if (t >= 85) return { label: 'Trusted', cls: 'trust-mid' };
  return { label: 'New Shop', cls: 'trust-lo' };
}

export default function VendorCard({ vendor: v, onClick, isFav, onToggleFav, iotLive }) {
  const img = SHOP_IMAGES[v.id] || SHOP_IMAGES[1];
  const tb  = trustBadge(v.trustScore);

  return (
    <div className="vcard" onClick={onClick}>
      <div className="vcard-img-wrap">
        <img src={img} alt={v.name} className="vcard-img" loading="lazy" />
        <div className="vcard-img-overlay" />

        {v.status === 'closed' && (
          <div className="vcard-closed-overlay">
            <span className="closed-badge">Closed</span>
          </div>
        )}

        {v.hasIot && iotLive && (
          <div className="iot-live-tag">
            <span className="iot-pulse-dot" /> Live IoT
          </div>
        )}

        <button
          className={`fav-btn-card ${isFav ? 'active' : ''}`}
          onClick={e => { e.stopPropagation(); onToggleFav?.(v.id); }}
        >
          {isFav ? '♥' : '♡'}
        </button>

        <span className="vcard-cat-tag">{v.category}</span>
      </div>

      <div className="vcard-body">
        <div className="vcard-row1">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="vcard-name">{v.name}</div>
            <div className="vcard-addr">{v.address}</div>
          </div>
          <div className={`rating-pill ${v.rating < 4.3 ? 'low' : ''}`}>
            ⭐ {v.rating}
          </div>
        </div>

        <div className="vcard-meta">
          <span className="vmeta-chip">📍 {v.distanceKm} km</span>
          <span className="vmeta-chip">💬 {v.reviewCount}</span>
          <span className={`vmeta-chip trust ${tb.cls}`}>✓ {tb.label}</span>
        </div>

        {v.openHours && (
          <div className="vcard-hours">🕐 {v.openHours}</div>
        )}
      </div>
    </div>
  );
}
