import React, { useState } from 'react';
import { MOCK_PRODUCTS, MOCK_VENDORS, PRICE_MATRIX, SHOP_THUMBS } from '../../mockData';

export default function PriceCompare({ onBack, radius, onRadiusChange }) {
  const [selectedPid, setSelectedPid] = useState(1);

  const product = MOCK_PRODUCTS.find(p => p.id === selectedPid);

  // Build comparison rows from mock data
  const rows = MOCK_VENDORS
    .filter(v => v.distanceKm <= radius && PRICE_MATRIX[v.id]?.[selectedPid] !== undefined)
    .map(v => ({ vendor: v, price: PRICE_MATRIX[v.id][selectedPid] }))
    .sort((a, b) => a.price - b.price);

  const minPrice = rows.length ? rows[0].price : null;
  const maxPrice = rows.length ? rows[rows.length - 1].price : null;
  const savings  = minPrice !== null && maxPrice !== null && minPrice !== maxPrice
    ? maxPrice - minPrice : 0;

  return (
    <div className="cp-wrap">
      {/* Dark header */}
      <div className="cp-header">
        <button className="cp-back" onClick={onBack}>← Back</button>
        <div className="cp-header-title">Compare Prices</div>
        <div className="cp-header-sub">Find the best deal near you</div>

        {/* Radius control */}
        <div className="cp-radius-row">
          <span className="cp-radius-label">📍 Search radius</span>
          <input
            type="range" min="1" max="5" step="1" value={radius}
            className="cp-radius-slider"
            onChange={e => onRadiusChange(parseInt(e.target.value))}
          />
          <span className="cp-radius-val">{radius} km</span>
        </div>
      </div>

      {/* Product selector — pill grid */}
      <div className="cp-products-strip">
        <div className="cp-products-label">Select a product</div>
        <div className="cp-products-grid">
          {MOCK_PRODUCTS.map(p => (
            <div
              key={p.id}
              className={`cp-product-chip ${selectedPid === p.id ? 'active' : ''}`}
              onClick={() => setSelectedPid(p.id)}
            >
              <img src={p.img} alt={p.name} className="cp-product-img" />
              <span className="cp-product-name">{p.name}</span>
              {selectedPid === p.id && <span className="cp-product-check">✓</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Savings banner */}
      {savings > 0 && (
        <div className="cp-savings-banner">
          <div className="cp-savings-left">
            <div className="cp-savings-title">🏆 Best deal</div>
            <div className="cp-savings-shop">{rows[0]?.vendor?.name}</div>
            <div className="cp-savings-dist">📍 {rows[0]?.vendor?.distanceKm} km away</div>
          </div>
          <div className="cp-savings-right">
            <div className="cp-savings-amount">Save ₹{savings}</div>
            <div className="cp-savings-sub">vs most expensive</div>
          </div>
        </div>
      )}

      {/* Results header */}
      <div className="cp-results-hd">
        <span className="cp-results-title">
          {product?.name} — per {product?.unit}
        </span>
        <span className="cp-results-count">{rows.length} shops</span>
      </div>

      {/* Shop comparison cards */}
      {rows.length === 0 ? (
        <div className="empty-state" style={{ paddingTop: 60 }}>
          <div className="empty-ico">🔍</div>
          <div className="empty-title">No shops found</div>
          <div className="empty-sub">Try widening the radius or selecting another product</div>
        </div>
      ) : (
        <div className="cp-cards">
          {rows.map((row, idx) => {
            const isBest  = row.price === minPrice;
            const isWorst = row.price === maxPrice && rows.length > 1;
            const pct     = maxPrice > minPrice
              ? Math.round(((row.price - minPrice) / (maxPrice - minPrice)) * 100)
              : 0;

            return (
              <div key={row.vendor.id} className={`cp-card ${isBest ? 'best' : ''}`}>
                {isBest && <div className="cp-card-crown">🏆 Best Price</div>}

                <div className="cp-card-top">
                  <div className="cp-card-rank">#{idx + 1}</div>
                  <img
                    src={SHOP_THUMBS[row.vendor.id] || SHOP_THUMBS[1]}
                    alt={row.vendor.name}
                    className="cp-card-shop-img"
                  />
                  <div className="cp-card-info">
                    <div className="cp-card-name">{row.vendor.name}</div>
                    <div className="cp-card-meta">
                      📍 {row.vendor.distanceKm} km · ⭐ {row.vendor.rating}
                    </div>
                    <div className="cp-card-cat">{row.vendor.category}</div>
                  </div>
                  <div className="cp-card-price-wrap">
                    <div className={`cp-card-price ${isBest ? 'best' : isWorst ? 'worst' : ''}`}>
                      ₹{row.price}
                    </div>
                    <div className="cp-card-unit">per {product?.unit}</div>
                    {isBest && <div className="cp-cheapest-tag">Cheapest</div>}
                    {isWorst && rows.length > 1 && <div className="cp-costly-tag">+₹{savings}</div>}
                  </div>
                </div>

                {/* Price bar */}
                <div className="cp-price-bar-wrap">
                  <div className="cp-price-bar-track">
                    <div
                      className="cp-price-bar-fill"
                      style={{
                        width: `${Math.max(8, pct)}%`,
                        background: isBest ? '#059669' : isWorst ? '#e11d48' : '#6366f1',
                      }}
                    />
                  </div>
                  <span className="cp-price-bar-pct">
                    {isBest ? 'Lowest' : `+${pct}% more`}
                  </span>
                </div>

                {/* IoT badge */}
                {row.vendor.hasIot && (
                  <div className="cp-iot-verified">📡 IoT price verified</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="cp-footer-note">
        Prices crowd-sourced & IoT-verified · Updated in real time
      </div>
    </div>
  );
}
