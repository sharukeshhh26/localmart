import React, { useEffect, useState } from 'react';
import { vendorAPI, priceAPI, productAPI } from '../../services/api';
import { MOCK_VENDORS, MOCK_PRODUCTS, PRICE_MATRIX, SHOP_IMAGES } from '../../mockData';

const TRUST_BARS = [
  ['Device Activity',  'IoT uptime & heartbeat',   88, '#6366f1'],
  ['Price Updates',    'How often you update',      75, '#059669'],
  ['Customer Reviews', 'Based on ratings received', 95, '#f59e0b'],
  ['Availability',     'Shop open hours tracked',   92, '#e11d48'],
];

const HOW_TO_VIDEOS = [
  { id: 1, title: 'Setting up your IoT device',    duration: '3:45', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80', desc: 'Step-by-step ESP8266 NodeMCU setup and WiFi pairing' },
  { id: 2, title: 'Syncing prices via IoT',         duration: '2:20', thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80', desc: 'How live price sync works between device and LocalMart' },
  { id: 3, title: 'Reading IoT diagnostics',        duration: '4:10', thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80', desc: 'Understanding heartbeat, signal strength, and uptime stats' },
  { id: 4, title: 'Updating your shop profile',     duration: '1:55', thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80', desc: 'Add products, update hours, and manage your storefront' },
];

// Prototype: vendor 1 = Ravi Kirana Store
const VENDOR_MOCK = MOCK_VENDORS[0];

function PriceRow({ product, initPrice }) {
  const [val,   setVal]   = useState(initPrice ?? '');
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (!val || isNaN(val)) return;
    setSaved(true); setTimeout(() => setSaved(false), 1600);
  };

  return (
    <div className="price-edit-row">
      <div className="pe-left">
        <img src={product.img} alt={product.name} className="pe-prod-img" />
        <div>
          <div className="pe-name">{product.name}</div>
          <div className="pe-unit">per {product.unit}</div>
        </div>
      </div>
      <div className="pe-right">
        <span className="pe-rupee">₹</span>
        <input
          className="pe-input" type="number" min="1"
          value={val} onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && save()}
        />
        <button className={`upd-btn ${saved ? 'saved' : ''}`} onClick={save}>
          {saved ? '✓ Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
}

function VideoModal({ video, onClose }) {
  if (!video) return null;
  return (
    <div className="video-modal-overlay" onClick={onClose}>
      <div className="video-modal-card" onClick={e => e.stopPropagation()}>
        <button className="video-modal-close" onClick={onClose}>✕</button>
        <div style={{ position: 'relative' }}>
          <img src={video.thumbnail} alt={video.title} style={{ width: '100%', display: 'block' }} />
          <div className="video-modal-play-big">▶</div>
        </div>
        <div className="video-modal-info">
          <div className="video-modal-title">{video.title}</div>
          <div className="video-modal-desc">{video.desc}</div>
          <div className="video-modal-duration">⏱ {video.duration} min</div>
        </div>
      </div>
    </div>
  );
}

export default function VendorDashboard({ vendorId = 1 }) {
  const [activeTab,    setActiveTab]    = useState('overview');
  const [syncing,      setSyncing]      = useState(false);
  const [synced,       setSynced]       = useState(false);
  const [playingVideo, setPlayingVideo] = useState(null);
  // Always live for prototype
  const [iotLive] = useState(true);

  const vendor   = VENDOR_MOCK;
  const products = MOCK_PRODUCTS;
  const priceMap = PRICE_MATRIX[vendorId] || {};
  const heroImg  = SHOP_IMAGES[vendorId] || SHOP_IMAGES[1];

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => { setSyncing(false); setSynced(true); setTimeout(() => setSynced(false), 2500); }, 1800);
  };

  return (
    <div className="vendor-dash">
      {/* Hero */}
      <div className="vd-hero">
        <div className="vd-hero-bg">
          <img src={heroImg} alt={vendor.name} className="vd-hero-bg-img" />
          <div className="vd-hero-bg-overlay" />
        </div>
        <div className="vd-hero-content">
          <div className="vd-shop-name">{vendor.name}</div>
          <div className="vd-shop-addr">{vendor.address}</div>
          <div className="vd-status-row">
            <span className="vd-status-tag open">● Open Now</span>
            <span className="vd-iot-badge">📡 IoT Active</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="vd-stats-row">
        {[
          { val: vendor.viewCount, lbl: 'Views today' },
          { val: `⭐ ${vendor.rating}`, lbl: 'Rating' },
          { val: `${vendor.trustScore}%`, lbl: 'Trust score' },
          { val: products.length, lbl: 'Products' },
        ].map((s, i) => (
          <div className="vd-stat-box" key={i}>
            <div className="vd-stat-val">{s.val}</div>
            <div className="vd-stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="vd-tabs">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'prices',   label: 'Prices' },
          { key: 'iot',      label: 'IoT Device' },
          { key: 'howto',    label: 'How-To' },
        ].map(t => (
          <button key={t.key} className={`vd-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div className="vd-section">
          <div className="trust-card">
            <div className="trust-card-hd">Trust Score Breakdown</div>
            {TRUST_BARS.map(([label, desc, val, color]) => (
              <div key={label} className="tb-row">
                <div className="tb-hd"><span className="tb-label">{label}</span><span className="tb-val" style={{ color }}>{val}%</span></div>
                <div className="tb-desc">{desc}</div>
                <div className="tb-track"><div className="tb-fill" style={{ width: `${val}%`, background: color }} /></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PRICES ── */}
      {activeTab === 'prices' && (
        <div className="vd-section">
          <div className="prices-card">
            <div className="prices-card-hd">
              <span>Update My Prices</span>
              <span className="prices-hint">Press Enter or Save</span>
            </div>
            {products.map(prod => (
              <PriceRow key={prod.id} product={prod} initPrice={priceMap[prod.id]} />
            ))}
          </div>
        </div>
      )}

      {/* ── IOT DEVICE (always live) ── */}
      {activeTab === 'iot' && (
        <div className="vd-section">
          <div className="iot-device-card">
            <div className="iot-device-hd">
              <div className="iot-device-icon-wrap">
                <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=80&q=80" alt="device" className="iot-device-icon-img" />
              </div>
              <div className="iot-device-info">
                <div className="iot-device-name">ESP8266 NodeMCU</div>
                <div className="iot-device-sub">
                  {synced ? 'Last seen: just now ✓' : `Last seen: ${vendor.lastSeen}`}
                </div>
              </div>
              <span className="iot-status-badge">● Active</span>
            </div>

            {/* Heartbeat */}
            <div className="iot-heartbeat">
              {Array.from({ length: 30 }, (_, i) => (
                <div key={i} className="hb-bar"
                  style={{ height: `${6 + Math.abs(Math.sin(i * 1.1)) * 22}px`, animationDelay: `${(i * 0.07).toFixed(2)}s` }}
                />
              ))}
              <span className="hb-label">Heartbeat active</span>
            </div>

            {/* Metrics */}
            <div className="iot-metrics">
              {[['98%','Uptime'], ['-72 dBm','Signal'], ['1.2s','Latency']].map(([v, l]) => (
                <div className="iot-metric" key={l}>
                  <div className="iot-metric-val">{v}</div>
                  <div className="iot-metric-lbl">{l}</div>
                </div>
              ))}
            </div>

            <button
              className={`sync-btn ${syncing ? 'syncing' : synced ? 'synced' : ''}`}
              onClick={handleSync} disabled={syncing}
            >
              {syncing ? <><span className="sync-spin">⟳</span> Syncing…</> : synced ? '✓ Synced Successfully!' : '⟳ Sync Device Now'}
            </button>
          </div>

          {/* Logs */}
          <div className="iot-logs-card">
            <div className="iot-logs-hd">Recent Activity</div>
            {[
              { time: '2 min ago',  msg: 'Price sync completed — 5 products updated', type: 'ok' },
              { time: '18 min ago', msg: 'Heartbeat received from device', type: 'ok' },
              { time: '1 hr ago',   msg: 'WiFi reconnected after brief dropout', type: 'warn' },
              { time: '3 hr ago',   msg: 'Device booted successfully', type: 'ok' },
            ].map((log, i) => (
              <div key={i} className={`iot-log-row ${log.type}`}>
                <span className={`iot-log-dot ${log.type}`} />
                <div>
                  <div className="iot-log-msg">{log.msg}</div>
                  <div className="iot-log-time">{log.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── HOW-TO ── */}
      {activeTab === 'howto' && (
        <div className="vd-section">
          <div className="howto-hd">
            <div className="howto-hd-title">How-To Guides</div>
            <div className="howto-hd-sub">Learn how to get the most out of LocalMart</div>
          </div>
          <div className="howto-grid">
            {HOW_TO_VIDEOS.map(v => (
              <div key={v.id} className="howto-card" onClick={() => setPlayingVideo(v)}>
                <div className="howto-thumb-wrap">
                  <img src={v.thumbnail} alt={v.title} className="howto-thumb" />
                  <div className="howto-play-btn">▶</div>
                  <div className="howto-duration">{v.duration}</div>
                </div>
                <div className="howto-body">
                  <div className="howto-title">{v.title}</div>
                  <div className="howto-desc">{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <VideoModal video={playingVideo} onClose={() => setPlayingVideo(null)} />
    </div>
  );
}
