import React, { useState } from 'react';
import { MOCK_VENDORS, MOCK_PRODUCTS, MOCK_IOT_DEVICES, SHOP_THUMBS } from '../../mockData';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview');
  const [vendors,   setVendors]   = useState(MOCK_VENDORS);
  const [iotDevices, setIotDevices] = useState(MOCK_IOT_DEVICES);

  const pending   = vendors.filter(v => v.status === 'pending');
  const active    = vendors.filter(v => v.status !== 'pending');
  const openCount = active.filter(v => v.status === 'open').length;
  const iotOn     = iotDevices.filter(d => d.live).length;

  const approve = id => setVendors(vs => vs.map(v => v.id === id ? { ...v, status: 'open' } : v));
  const reject  = id => setVendors(vs => vs.filter(v => v.id !== id));
  const togVendor = id => setVendors(vs => vs.map(v => v.id === id ? { ...v, status: v.status === 'open' ? 'closed' : 'open' } : v));
  const togIoT    = id => setIotDevices(ds => ds.map(d => d.id === id ? { ...d, live: !d.live } : d));

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="admin-header-title">Admin Dashboard</div>
        <div className="admin-header-sub">LocalMart control centre · Coimbatore</div>
      </div>

      {/* Metrics */}
      <div className="admin-metrics">
        {[
          { val: vendors.length, lbl: 'Total Vendors',  sub: `+${pending.length} pending`,  color: '#6366f1', bg: '#eef2ff' },
          { val: openCount,      lbl: 'Open Now',        sub: `${active.length - openCount} closed`, color: '#059669', bg: '#ecfdf5' },
          { val: iotOn,          lbl: 'IoT Online',      sub: `of ${iotDevices.length} devices`, color: '#0ea5e9', bg: '#f0f9ff' },
          { val: active.length,  lbl: 'Active Vendors',  sub: '8 categories',               color: '#f59e0b', bg: '#fffbeb' },
        ].map((m, i) => (
          <div className="admin-metric-card" key={i} style={{ '--m-color': m.color, '--m-bg': m.bg }}>
            <div className="amc-val" style={{ color: m.color }}>{m.val}</div>
            <div className="amc-lbl">{m.lbl}</div>
            <div className="amc-sub" style={{ background: m.bg, color: m.color }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'pending',  label: 'Approvals' },
          { key: 'products', label: 'Products' },
          { key: 'iot',      label: 'IoT Monitor' },
        ].map(t => (
          <button key={t.key} className={`admin-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
            {t.label}
            {t.key === 'pending' && pending.length > 0 && (
              <span className="admin-tab-badge">{pending.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div className="admin-section">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Vendor</th><th>Category</th><th>Distance</th><th>Trust</th><th>IoT</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {active.map(v => (
                  <tr key={v.id}>
                    <td>
                      <div className="at-vendor-cell">
                        <img src={SHOP_THUMBS[v.id] || SHOP_THUMBS[1]} alt={v.name} className="at-product-img" />
                        <div>
                          <div className="at-name">{v.name}</div>
                          <div className="at-addr">{v.address}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="at-cat-tag">{v.category}</span></td>
                    <td>{v.distanceKm} km</td>
                    <td>
                      <div className="at-trust-bar">
                        <div style={{ width: `${v.trustScore}%`, background: '#6366f1', height: '100%', borderRadius: 4 }} />
                      </div>
                      <span style={{ fontSize: 11, color: '#666' }}>{v.trustScore}%</span>
                    </td>
                    <td>
                      <span className={`at-iot-dot ${v.hasIot ? 'on' : 'off'}`} />
                      {v.hasIot ? 'Live' : 'None'}
                    </td>
                    <td><span className={`at-status ${v.status}`}>{v.status === 'open' ? 'Open' : 'Closed'}</span></td>
                    <td>
                      <button className="at-action-btn" onClick={() => togVendor(v.id)}>
                        {v.status === 'open' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PENDING ── */}
      {activeTab === 'pending' && (
        <div className="admin-section">
          {pending.length === 0 ? (
            <div className="empty-state">
              <div className="empty-ico">✅</div>
              <div className="empty-title">All caught up!</div>
              <div className="empty-sub">No vendors waiting for approval</div>
            </div>
          ) : (
            <div className="pending-list">
              {pending.map(v => (
                <div key={v.id} className="pending-card">
                  <div className="pending-card-left">
                    <img src={SHOP_THUMBS[v.id] || SHOP_THUMBS[1]} alt={v.name} className="pending-avatar-img" />
                    <div className="pending-info">
                      <div className="pending-name">{v.name}</div>
                      <div className="pending-meta">{v.category} · {v.address}</div>
                      <div className="pending-tag">⏳ Awaiting verification</div>
                    </div>
                  </div>
                  <div className="pending-actions">
                    <button className="pending-btn approve" onClick={() => approve(v.id)}>✓ Approve</button>
                    <button className="pending-btn reject"  onClick={() => reject(v.id)}>✕ Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── PRODUCTS ── */}
      {activeTab === 'products' && (
        <div className="admin-section">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Product</th><th>Category</th><th>Unit</th><th>Avg Price</th><th>Shops</th><th>Trend</th></tr>
              </thead>
              <tbody>
                {MOCK_PRODUCTS.map((p, i) => {
                  const shopCount = Object.values(PRICE_MATRIX).filter(pm => pm[p.id] !== undefined).length;
                  const prices    = Object.values(PRICE_MATRIX).map(pm => pm[p.id]).filter(Boolean);
                  const avg       = prices.length ? Math.round(prices.reduce((a,b) => a+b, 0) / prices.length) : '—';
                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="at-vendor-cell">
                          <img src={p.img} alt={p.name} className="at-product-img" />
                          <span className="at-name">{p.name}</span>
                        </div>
                      </td>
                      <td><span className="at-cat-tag">{p.category}</span></td>
                      <td>{p.unit}</td>
                      <td><strong>₹{avg}</strong></td>
                      <td>{shopCount} shops</td>
                      <td>
                        <span className={`trend-tag ${i % 2 === 0 ? 'up' : 'down'}`}>
                          {i % 2 === 0 ? '↑ +3%' : '↓ -2%'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── IOT MONITOR ── */}
      {activeTab === 'iot' && (
        <div className="admin-section">
          <div className="iot-monitor-grid">
            {iotDevices.map(d => (
              <div key={d.id} className={`iot-monitor-card ${d.live ? 'live' : 'offline'}`}>
                <div className="imc-header">
                  <div className="imc-device-icon">
                    <img src={SHOP_THUMBS[d.vendorId] || SHOP_THUMBS[1]} alt={d.vendorName} className="imc-vendor-thumb" />
                  </div>
                  <div className="imc-info">
                    <div className="imc-vendor-name">{d.vendorName}</div>
                    <div className="imc-device-model">{d.model}</div>
                  </div>
                  <div className={`imc-status ${d.live ? 'live' : 'off'}`}>
                    <span className="imc-dot" />{d.live ? 'Live' : 'Offline'}
                  </div>
                </div>

                <div className="imc-metrics">
                  {[['Last sync', d.lastSync], ['Uptime', d.live ? d.uptime : '—'], ['Signal', d.live ? d.signal : '—']].map(([l, v]) => (
                    <div className="imc-metric" key={l}>
                      <div className="imc-metric-lbl">{l}</div>
                      <div className="imc-metric-val">{v}</div>
                    </div>
                  ))}
                </div>

                <div className="imc-heartbeat">
                  {Array.from({ length: 18 }, (_, i) => (
                    <div key={i} className={`hb-bar ${d.live ? '' : 'dead'}`}
                      style={{ height: d.live ? `${4 + Math.abs(Math.sin(i * 1.1)) * 14}px` : '4px', animationDelay: `${(i * 0.08).toFixed(2)}s` }}
                    />
                  ))}
                </div>

                <button className={`imc-toggle-btn ${d.live ? 'turn-off' : 'turn-on'}`} onClick={() => togIoT(d.id)}>
                  {d.live ? 'Simulate Offline' : 'Simulate Online'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
