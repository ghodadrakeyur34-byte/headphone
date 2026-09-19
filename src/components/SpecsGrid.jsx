import React from 'react';

export default function SpecsGrid() {
  const specsCategories = [
    {
      category: 'Acoustic Architecture',
      icon: '🎵',
      specs: [
        { label: 'Transducer Type', value: '40mm High-Flux Neodymium Dynamic Driver' },
        { label: 'Frequency Response', value: '5 Hz – 40,000 Hz (Hi-Res Certified)' },
        { label: 'Total Harmonic Distortion', value: '< 0.05% @ 1kHz, 100dB SPL' },
        { label: 'Impedance', value: '32 Ω (Passive Mode Compatible)' },
        { label: 'Spatial Engine', value: 'Binaural 360° Dynamic HRTF Head-Tracking' }
      ]
    },
    {
      category: 'Noise Control & Microphones',
      icon: '🛡️',
      specs: [
        { label: 'ANC Technology', value: 'Quad-Mic Hybrid Feed-Forward & Feed-Back' },
        { label: 'Noise Reduction Depth', value: '-42 dB Active Sound Attenuation' },
        { label: 'Voice Microphones', value: 'Beamforming Dual-Mic with AI Wind-Screening' },
        { label: 'Transparency Mode', value: 'Natural Human Voice Micro-Amplification' }
      ]
    },
    {
      category: 'Connectivity & Wireless',
      icon: '📡',
      specs: [
        { label: 'Bluetooth Version', value: 'Bluetooth 5.3 with LE Audio' },
        { label: 'Supported Codecs', value: 'Sony LDAC (990kbps), AAC, SBC, aptX HD' },
        { label: 'Wireless Range', value: 'Up to 20 meters (65 feet)' },
        { label: 'Multipoint Connection', value: 'Simultaneous 2-Device Seamless Switch' },
        { label: 'Wired Connection', value: '3.5mm Gold-Plated Lossless Audio Cable' }
      ]
    },
    {
      category: 'Battery & Power Matrix',
      icon: '⚡',
      specs: [
        { label: 'Total Playback Time', value: 'Up to 60 Hours (ANC Off) / 45 Hours (ANC On)' },
        { label: 'Fast Fuel Charging', value: '10 Minutes Charge = 10 Hours Playtime' },
        { label: 'Full Recharge Duration', value: '75 Minutes via High-Speed USB-C' },
        { label: 'Battery Chemistry', value: '1000mAh High-Density Safe Lithium-Polymer' }
      ]
    }
  ];

  return (
    <section className="specs-section" id="specifications">
      <div className="section-container">
        <div className="specs-header">
          <div className="liquid-badge-pill">
            <span className="bubble-icon">📐</span>
            TECHNICAL MASTERY
          </div>
          <h2 className="section-title">Precision Down to the Micron</h2>
          <p className="section-subtext">
            Every acoustic parameter verified in sound labs and certified to the highest fidelity standards.
          </p>
        </div>

        <div className="specs-masonry-grid">
          {specsCategories.map((group, idx) => (
            <div key={idx} className="liquid-glass-slab spec-card">
              <div className="spec-card-header">
                <span className="liquid-icon-bubble">{group.icon}</span>
                <h3 className="spec-group-title">{group.category}</h3>
              </div>

              <div className="spec-table">
                {group.specs.map((item, sIdx) => (
                  <div key={sIdx} className="spec-row">
                    <span className="spec-item-label">{item.label}</span>
                    <span className="spec-item-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* In the Box Section with Liquid Glass Accessories Bar */}
        <div className="liquid-glass-slab in-the-box-card">
          <div className="box-header">
            <span className="liquid-badge-sub">IN THE BOX</span>
            <h3>Complete Audiophile Kit</h3>
          </div>
          <div className="box-items-row">
            <div className="liquid-accessory-bubble">
              <span className="box-item-emoji">🎧</span>
              <span className="box-item-name">Aura Pro Wireless</span>
            </div>
            <div className="liquid-accessory-bubble">
              <span className="box-item-emoji">🧳</span>
              <span className="box-item-name">Hard-Shell Ballistic Case</span>
            </div>
            <div className="liquid-accessory-bubble">
              <span className="box-item-emoji">🔌</span>
              <span className="box-item-name">Braided 3.5mm Aux Cable</span>
            </div>
            <div className="liquid-accessory-bubble">
              <span className="box-item-emoji">⚡</span>
              <span className="box-item-name">USB-C Fast Charge Cable</span>
            </div>
            <div className="liquid-accessory-bubble">
              <span className="box-item-emoji">✈️</span>
              <span className="box-item-name">Flight Audio Adapter</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
