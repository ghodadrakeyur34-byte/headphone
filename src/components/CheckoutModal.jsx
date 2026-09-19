import React, { useState } from 'react';

export default function CheckoutModal({ isOpen, onClose }) {
  const [selectedColor, setSelectedColor] = useState('Midnight Navy');
  const [isOrdered, setIsOrdered] = useState(false);

  if (!isOpen) return null;

  const handleOrder = (e) => {
    e.preventDefault();
    setIsOrdered(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="liquid-glass-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="liquid-close-bubble" onClick={onClose}>
          ✕
        </button>

        {!isOrdered ? (
          <div className="checkout-content">
            <div className="liquid-badge-pill">
              <span className="bubble-icon">✨</span>
              FLAGSHIP PRE-ORDER
            </div>
            <h3 className="checkout-title">Reserve Aura Pro Wireless</h3>
            <p className="checkout-subtitle">
              Batch 01 production limited to 1,500 serialized units. Ships worldwide with priority carbon-neutral express.
            </p>

            {/* Order Summary Glass Card */}
            <div className="liquid-summary-card">
              <div className="summary-left">
                <img
                  src="/frames/ezgif-frame-001.png"
                  alt="Aura Pro Headphones"
                  className="summary-thumb"
                />
                <div>
                  <h4 className="summary-item-name">AURA PRO WIRELESS</h4>
                  <span className="summary-item-finish">Selected: {selectedColor}</span>
                </div>
              </div>
              <div className="summary-right">
                <span className="summary-original-price">$399</span>
                <span className="summary-price">$349</span>
              </div>
            </div>

            {/* Finish Selector with Liquid Glass Pills */}
            <div className="checkout-field-group">
              <label className="field-label">Select Acoustic Finish:</label>
              <div className="finish-pill-group">
                {['Midnight Navy', 'Obsidian Matte', 'Lunar Silver', 'Celestial Bronze'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`liquid-finish-pill ${selectedColor === c ? 'active' : ''}`}
                    onClick={() => setSelectedColor(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleOrder} className="checkout-form">
              <div className="form-row">
                <div className="milky-input-wrapper">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    className="milky-white-input"
                  />
                </div>
                <div className="milky-input-wrapper">
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    className="milky-white-input"
                  />
                </div>
              </div>

              <div className="form-guarantees">
                <div className="guarantee-item">
                  <span>🔒</span> 256-Bit Encrypted Checkout
                </div>
                <div className="guarantee-item">
                  <span>✈️</span> Free Express Global Shipping
                </div>
                <div className="guarantee-item">
                  <span>🛡️</span> 2-Year Manufacturer Warranty
                </div>
              </div>

              {/* Primary Liquid Button matching UI.jpg violet pill */}
              <button type="submit" className="btn-liquid-primary full-width">
                Confirm Pre-Order • $349 USD
              </button>
            </form>
          </div>
        ) : (
          <div className="order-confirmed-box">
            <div className="confirmed-icon">✨</div>
            <h3 className="confirmed-title">Reservation Confirmed!</h3>
            <p className="confirmed-text">
              Your serialized Aura Pro Wireless in <strong>{selectedColor}</strong> has been reserved. Check your email for tracking and assembly updates.
            </p>
            <button className="btn-liquid-primary" onClick={onClose}>
              Return to Showcase
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
