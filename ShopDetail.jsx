import React, { useEffect, useState } from 'react';
import { vendorAPI, priceAPI, reviewAPI } from '../../services/api';
import { MOCK_VENDORS, MOCK_PRODUCTS, PRICE_MATRIX, MOCK_REVIEWS, SHOP_IMAGES } from '../../mockData';

export default function ShopDetail({ vendorId, onBack, isFav, onToggleFav, iotLive }) {
  const [vendor,     setVendor]     = useState(null);
  const [prices,     setPrices]     = useState([]);
  const [reviews,    setReviews]    = useState([]);
  const [rating,     setRating]     = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [posting,    setPosting]    = useState(false);
  const [activeTab,  setActiveTab]  = useState('info');
  const [myReviews,  setMyReviews]  = useState([]);

  useEffect(() => {
    setVendor(null);
    // Try backend, fall back to mock
    vendorAPI.getById(vendorId)
      .then(r => setVendor(r.data))
      .catch(() => {
        const m = MOCK_VENDORS.find(v => v.id === vendorId);
        if (m) setVendor(m);
      });

    priceAPI.byVendor(vendorId)
      .then(r => setPrices(r.data))
      .catch(() => {
        // Build prices from matrix
        const pm = PRICE_MATRIX[vendorId] || {};
        const built = Object.entries(pm).map(([pid, price]) => {
          const prod = MOCK_PRODUCTS.find(p => p.id === Number(pid));
          return prod ? { id: Number(pid), price, product: prod } : null;
        }).filter(Boolean);
        setPrices(built);
      });

    reviewAPI.byVendor(vendorId)
      .then(r => setReviews(r.data))
      .catch(() => setReviews(MOCK_REVIEWS[vendorId] || []));

    vendorAPI.incrementView(vendorId);
  }, [vendorId]);

  const postReview = () => {
    if (!reviewText.trim() || rating === 0) return;
    setPosting(true);
    const newRev = { id: Date.now(), userName: 'You', rating, text: reviewText, date: 'just now' };
    setTimeout(() => {
      setMyReviews(prev => [newRev, ...prev]);
      setReviewText(''); setRating(0); setPosting(false);
    }, 600);
  };

  if (!vendor) return (
    <div className="sd-wrap">
      <div className="back-row" onClick={onBack}>
        <span className="back-ico">←</span>
        <span className="back-title">Loading…</span>
      </div>
      <div className="loading-wrap" style={{ paddingTop: 80 }}>
        <div className="spinner" />
        <span>Loading shop details…</span>
      </div>
    </div>
  );

  const heroImg = SHOP_IMAGES[vendor.id] || SHOP_IMAGES[1];
  const isIotLive = vendor.hasIot && iotLive;
  const allReviews = [...myReviews, ...reviews];

  return (
    <div className="sd-wrap">
      {/* Back */}
      <div className="back-row" onClick={onBack}>
        <span className="back-ico">←</span>
        <span className="back-title">{vendor.name}</span>
        <button
          className={`sd-fav-btn ${isFav ? 'active' : ''}`}
          onClick={e => { e.stopPropagation(); onToggleFav?.(vendor.id); }}
        >
          {isFav ? '♥' : '♡'}
        </button>
      </div>

      {/* Hero Banner */}
      <div className="sd-hero">
        <img src={heroImg} alt={vendor.name} className="sd-hero-img" />
        <div className="sd-hero-gradient" />
        <div className="sd-hero-content">
          <div className="sd-badges">
            <span className={`sd-status-badge ${vendor.status}`}>
              ● {vendor.status === 'open' ? 'Open Now' : 'Closed'}
            </span>
            {isIotLive && <span className="sd-iot-badge">📡 IoT Live</span>}
          </div>
          <div className="sd-hero-name">{vendor.name}</div>
          <div className="sd-hero-cat">{vendor.category} · {vendor.address}</div>
          <div className="sd-hero-stats">
            <span>⭐ {vendor.rating} ({vendor.reviewCount} reviews)</span>
            <span>·</span>
            <span>📍 {vendor.distanceKm} km away</span>
            <span>·</span>
            <span className="sd-trust-lbl">✓ {vendor.trustScore}% trust</span>
          </div>
        </div>
      </div>

      {/* Quick info pills */}
      <div className="sd-info-strip">
        <div className="sd-info-pill">
          <span className="sd-info-icon">🕐</span>
          <span>{vendor.openHours || '7 AM – 9 PM'}</span>
        </div>
        <div className="sd-info-pill">
          <span className="sd-info-icon">📞</span>
          <span>{vendor.phone || '+91 98765 43210'}</span>
        </div>
        {vendor.hasIot && (
          <div className="sd-info-pill">
            <span className="sd-info-icon">📡</span>
            <span>IoT {isIotLive ? 'Active' : 'Offline'}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {vendor.tags && (
        <div className="sd-tags-row">
          {vendor.tags.map(t => (
            <span key={t} className="sd-tag">{t}</span>
          ))}
        </div>
      )}

      {/* Tab nav */}
      <div className="sd-tabs">
        {['info', 'prices', 'reviews'].map(t => (
          <button
            key={t}
            className={`sd-tab ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t === 'info' ? 'About' : t === 'prices' ? `Prices (${prices.length})` : `Reviews (${allReviews.length})`}
          </button>
        ))}
      </div>

      {/* ── ABOUT ── */}
      {activeTab === 'info' && (
        <div className="sd-section">
          <div className="sd-about-card">
            <div className="sd-about-title">About this shop</div>
            <p className="sd-about-text">
              {vendor.desc || 'A trusted local shop serving the community with quality products at fair prices.'}
            </p>
          </div>

          {/* Stat boxes */}
          <div className="sd-stat-grid">
            <div className="sd-stat-box">
              <div className="sd-stat-val" style={{ color: '#6366f1' }}>⭐ {vendor.rating}</div>
              <div className="sd-stat-lbl">Rating</div>
            </div>
            <div className="sd-stat-box">
              <div className="sd-stat-val" style={{ color: '#059669' }}>{vendor.trustScore}%</div>
              <div className="sd-stat-lbl">Trust</div>
            </div>
            <div className="sd-stat-box">
              <div className="sd-stat-val" style={{ color: '#f59e0b' }}>{vendor.viewCount}</div>
              <div className="sd-stat-lbl">Views today</div>
            </div>
            <div className="sd-stat-box">
              <div className="sd-stat-val" style={{ color: '#e11d48' }}>{vendor.reviewCount}</div>
              <div className="sd-stat-lbl">Reviews</div>
            </div>
          </div>

          {/* IoT live status */}
          {vendor.hasIot && (
            <div className={`sd-iot-card ${isIotLive ? 'live' : 'offline'}`}>
              <div className="sd-iot-icon">📡</div>
              <div className="sd-iot-body">
                <div className="sd-iot-title">
                  IoT Device {isIotLive ? '— Live & Syncing' : '— Currently Offline'}
                </div>
                <div className="sd-iot-sub">
                  {isIotLive
                    ? `Prices auto-synced · Last seen ${vendor.lastSeen}`
                    : 'Device offline — prices may be outdated. Verify manually.'}
                </div>
              </div>
              <div className={`sd-iot-dot ${isIotLive ? 'on' : 'off'}`} />
            </div>
          )}
        </div>
      )}

      {/* ── PRICES ── */}
      {activeTab === 'prices' && (
        <div className="sd-section">
          {prices.length === 0 ? (
            <div className="empty-state">
              <div className="empty-ico">📦</div>
              <div className="empty-title">No prices listed</div>
              <div className="empty-sub">This shop hasn't updated prices yet</div>
            </div>
          ) : (
            <div className="sd-prices-list">
              {prices.map(p => (
                <div key={p.id} className="sd-price-row">
                  <img
                    src={p.product?.img || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80&q=70'}
                    alt={p.product?.name}
                    className="sd-price-img"
                  />
                  <div className="sd-price-body">
                    <div className="sd-price-name">{p.product?.name}</div>
                    <div className="sd-price-cat">{p.product?.category}</div>
                  </div>
                  <div className="sd-price-right">
                    <span className="sd-price-val">₹{p.price}</span>
                    <span className="sd-price-unit"> /{p.product?.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="sd-prices-note">
            Prices crowd-sourced & IoT-verified · Updated frequently
          </div>
        </div>
      )}

      {/* ── REVIEWS ── */}
      {activeTab === 'reviews' && (
        <div className="sd-section">
          {/* Write review */}
          <div className="sd-write-review">
            <div className="sd-wr-title">Share your experience</div>
            <div className="sd-star-row">
              {[1,2,3,4,5].map(n => (
                <span
                  key={n}
                  className={`sd-star ${rating >= n ? 'lit' : ''}`}
                  onClick={() => setRating(n)}
                >★</span>
              ))}
            </div>
            <input
              className="sd-rev-input"
              placeholder="What did you think of this shop?"
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
            />
            <button
              className="sd-post-btn"
              disabled={posting || !reviewText.trim() || rating === 0}
              onClick={postReview}
            >
              {posting ? 'Posting…' : 'Post Review'}
            </button>
          </div>

          {/* Reviews list */}
          {allReviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-ico">💬</div>
              <div className="empty-title">No reviews yet</div>
              <div className="empty-sub">Be the first to review this shop!</div>
            </div>
          ) : (
            <div className="sd-reviews-list">
              {allReviews.map(r => (
                <div key={r.id} className="sd-review-card">
                  <div className="sd-rv-header">
                    <div className="sd-rv-avatar">{r.userName[0]}</div>
                    <div>
                      <div className="sd-rv-name">{r.userName}</div>
                      <div className="sd-rv-stars">
                        {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                      </div>
                    </div>
                    <div className="sd-rv-date">{r.date} ago</div>
                  </div>
                  <div className="sd-rv-text">{r.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
