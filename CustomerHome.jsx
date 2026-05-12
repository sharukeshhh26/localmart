import React, { useState } from 'react';
import { MOCK_VENDORS, CAT_IMAGES, SHOP_THUMBS } from '../../mockData';
import VendorCard from './VendorCard';
import ShopDetail from './ShopDetail';
import PriceCompare from './PriceCompare';

const CATS = [
  { l: 'All' }, { l: 'Kirana' }, { l: 'Vegetables' },
  { l: 'Dairy' }, { l: 'Provision' }, { l: 'Fruits' },
  { l: 'Bakery' }, { l: 'Grains' },
];

const IOT_LIVE = { 1: true, 2: true, 3: true, 5: true, 7: false, 9: true, 10: true };

export default function CustomerHome() {
  const [page,       setPage]       = useState('home');
  const [selectedId, setSelectedId] = useState(null);

  const [qInput,      setQInput]      = useState('');
  const [q,           setQ]           = useState('');
  const [radius,      setRadius]      = useState(3);
  const [radiusInput, setRadiusInput] = useState(3);
  const [cat,         setCat]         = useState('All');
  const [sort,        setSort]        = useState('dist');

  const [favs,   setFavs]   = useState([1, 5, 10]);
  const [recent, setRecent] = useState([10, 5, 2, 1]);

  const handleSearch = () => { setQ(qInput); setRadius(radiusInput); };

  const filt = MOCK_VENDORS
    .filter(v => !q || v.name.toLowerCase().includes(q.toLowerCase()) || v.category.toLowerCase().includes(q.toLowerCase()))
    .filter(v => cat === 'All' || v.category === cat)
    .filter(v => v.distanceKm <= radius)
    .sort((a, b) =>
      sort === 'dist'  ? a.distanceKm - b.distanceKm :
      sort === 'trust' ? b.trustScore  - a.trustScore :
                         b.rating      - a.rating
    );

  const recentVendors = recent
    .map(id => MOCK_VENDORS.find(v => v.id === id))
    .filter(Boolean).slice(0, 5);

  const toggleFav = id => setFavs(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

  const openShop = id => {
    setSelectedId(id);
    setPage('shop');
    setRecent(prev => [id, ...prev.filter(x => x !== id)].slice(0, 5));
  };

  if (page === 'shop') return (
    <ShopDetail
      vendorId={selectedId}
      onBack={() => setPage('home')}
      isFav={favs.includes(selectedId)}
      onToggleFav={toggleFav}
      iotLive={IOT_LIVE[selectedId]}
    />
  );

  if (page === 'compare') return (
    <PriceCompare
      onBack={() => setPage('home')}
      radius={radius}
      onRadiusChange={setRadius}
    />
  );

  return (
    <div className="customer-home">
      {/* ── HERO ── */}
      <div className="customer-hero">
        <div className="hero-headline">
          Find the best deals <span>near you</span> 📍
        </div>
        <div className="search-panel">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-inp"
              type="text"
              placeholder="Search shops, vegetables, rice, milk…"
              value={qInput}
              onChange={e => setQInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            {qInput && <button className="search-clear" onClick={() => { setQInput(''); setQ(''); }}>✕</button>}
          </div>

          <div className="radius-row">
            <span className="radius-label">📍 Radius</span>
            <div className="radius-track-wrap">
              <input
                type="range" min="1" max="5" step="1"
                value={radiusInput}
                onChange={e => setRadiusInput(parseInt(e.target.value))}
                className="radius-slider"
              />
              <div className="radius-stops">
                {[1,2,3,4,5].map(n => (
                  <span key={n} className={`radius-stop ${n === radiusInput ? 'active' : ''}`}>{n}km</span>
                ))}
              </div>
            </div>
            <button className="search-btn" onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <div className="section-wrap">
        <div className="section-hd">
          <span className="section-title">Browse by Category</span>
        </div>
        <div className="cat-grid">
          {CATS.map(c => (
            <div
              key={c.l}
              className={`cat-tile ${cat === c.l ? 'active' : ''}`}
              onClick={() => setCat(c.l)}
            >
              <div className="cat-tile-img-wrap">
                <img
                  src={CAT_IMAGES[c.l] || CAT_IMAGES.All}
                  alt={c.l}
                  className="cat-tile-img"
                  loading="lazy"
                />
                {cat === c.l && <div className="cat-tile-sel-overlay" />}
              </div>
              <div className="cat-tile-label">{c.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FILTER CHIPS ── */}
      <div className="filter-bar">
        {[
          { key: 'dist',   label: '📍 Nearest' },
          { key: 'trust',  label: '⭐ Most Trusted' },
          { key: 'rating', label: '🏆 Top Rated' },
        ].map(f => (
          <button
            key={f.key}
            className={`filter-chip ${sort === f.key ? 'active' : ''}`}
            onClick={() => setSort(f.key)}
          >{f.label}</button>
        ))}
        <button className="filter-chip compare" onClick={() => setPage('compare')}>
          🔀 Compare Prices
        </button>
      </div>

      {/* ── RECENTLY VISITED ── */}
      {recentVendors.length > 0 && (
        <div className="section-wrap">
          <div className="section-hd">
            <span className="section-title">Recently Visited</span>
            <span className="see-all">Clear</span>
          </div>
          <div className="recent-row">
            {recentVendors.map(v => (
              <div key={v.id} className="recent-chip" onClick={() => openShop(v.id)}>
                <div className="recent-chip-img">
                  {/* Unique image per shop */}
                  <img src={SHOP_THUMBS[v.id]} alt={v.name} loading="lazy" />
                </div>
                <div className="recent-chip-name">{v.name.split(' ')[0]}</div>
                <div className="recent-chip-dist">{v.distanceKm}km</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── RESULTS COUNT ── */}
      <div className="results-hd">
        <span className="results-count">{filt.length} shop{filt.length !== 1 ? 's' : ''} found</span>
        <span className="results-area">within {radius} km · {cat !== 'All' ? cat : 'All categories'}</span>
      </div>

      {filt.length === 0 && (
        <div className="empty-state">
          <div className="empty-ico">🔍</div>
          <div className="empty-title">No shops match your filters</div>
          <div className="empty-sub">Try a wider radius or different category</div>
        </div>
      )}

      {/* ── VENDOR GRID ── */}
      <div className="vendor-grid">
        {filt.map(v => (
          <VendorCard
            key={v.id}
            vendor={v}
            onClick={() => openShop(v.id)}
            isFav={favs.includes(v.id)}
            onToggleFav={toggleFav}
            iotLive={IOT_LIVE[v.id]}
          />
        ))}
      </div>

      {filt.length > 0 && (
        <div className="compare-cta" onClick={() => setPage('compare')}>
          🔀 Compare prices across all shops →
        </div>
      )}
    </div>
  );
}
