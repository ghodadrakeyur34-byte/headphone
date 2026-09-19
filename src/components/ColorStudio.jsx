import React, { useState } from 'react';

export default function ColorStudio() {
  const [selectedColor, setSelectedColor] = useState('navy');

  const colorways = [
    {
      id: 'navy',
      name: 'Midnight Navy',
      finish: 'Anodized Micro-Bead Blasted Alloy',
      earpad: 'Deep Indigo Protein Leather',
      hex: '#1e2942',
      glow: 'rgba(56, 189, 248, 0.6)',
      tag: 'Original 3D Model'
    },
    {
      id: 'obsidian',
      name: 'Obsidian Matte',
      finish: 'Cerakote Ultra-Matte Surface',
      earpad: 'Carbon Stealth Memory Foam',
      hex: '#18181b',
      glow: 'rgba(255, 255, 255, 0.4)',
      tag: 'Stealth Edition'
    },
    {
      id: 'silver',
      name: 'Lunar Silver',
      finish: 'Diamond-Cut 7075 Aluminum',
      earpad: 'Pebble Gray Breathable Weave',
      hex: '#e2e8f0',
      glow: 'rgba(226, 232, 240, 0.6)',
      tag: 'Pure Metal'
    },
    {
      id: 'bronze',
      name: 'Celestial Bronze',
      finish: 'PVD Vapor-Deposited Titanium Gold',
      earpad: 'Espresso Tuscan Vegan Leather',
      hex: '#d97706',
      glow: 'rgba(217, 119, 6, 0.6)',
      tag: 'Limited Production'
    }
  ];

  const current = colorways.find((c) => c.id === selectedColor);

  return (
    <section className="color-studio-section" id="color-studio">
      <div className="section-container">
        <div className="color-intro">
          <div className="liquid-badge-pill">
            <span className="bubble-icon">🎨</span>
            CURATED FINISHES
          </div>
          <h2 className="section-title">Form Meets Fluidity</h2>
          <p className="section-subtext">
            Four bespoke material treatments crafted through multi-step anodizing, electroplating, and acoustic-transparent textiles.
          </p>
        </div>

        <div className="color-studio-grid">
          {/* Swatch Selector Cards with Liquid Glass Pills */}
          <div className="color-options-column">
            {colorways.map((color) => (
              <div
                key={color.id}
                id={`color-${color.id}`}
                className={`liquid-color-card ${selectedColor === color.id ? 'selected' : ''}`}
                onClick={() => setSelectedColor(color.id)}
              >
                <div
                  className="liquid-swatch-bubble"
                  style={{
                    backgroundColor: color.hex,
                    boxShadow: selectedColor === color.id ? `0 0 20px ${color.glow}` : 'none'
                  }}
                >
                  {selectedColor === color.id && <span className="bubble-check">✓</span>}
                </div>
                <div className="color-info">
                  <div className="color-name-row">
                    <span className="color-title">{color.name}</span>
                    <span className="liquid-tag-pill">{color.tag}</span>
                  </div>
                  <span className="color-finish-sub">{color.finish}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Iridescent Liquid Glass Card (Directly inspired by Modern Glass UI Design in UI.jpg) */}
          <div className="iridescent-glass-card">
            <div className="iridescent-card-header">
              <span className="liquid-badge-sub">ACOUSTIC FINISH SPECIFICATION</span>
              <span className="glass-indicator-bubble"></span>
            </div>

            <h3 className="color-hero-name" style={{ color: current.hex === '#18181b' ? '#f8fafc' : current.hex }}>
              {current.name}
            </h3>
            
            <div className="material-detail-list">
              <div className="material-detail-item">
                <span className="mat-label">Chassis Treatment</span>
                <span className="mat-val">{current.finish}</span>
              </div>
              <div className="material-detail-item">
                <span className="mat-label">Cushion Material</span>
                <span className="mat-val">{current.earpad}</span>
              </div>
              <div className="material-detail-item">
                <span className="mat-label">Coating Durability</span>
                <span className="mat-val">MIL-STD-810H Scratch Resistance</span>
              </div>
              <div className="material-detail-item">
                <span className="mat-label">Acoustic Mass</span>
                <span className="mat-val">252g (Ultra-Lightweight Ergonomics)</span>
              </div>
            </div>

            <div className="iridescent-bottom-action">
              <div className="milky-pill-btn">
                <span>↑ Active in 3D Viewport</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
