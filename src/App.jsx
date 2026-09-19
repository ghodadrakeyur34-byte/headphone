import React, { useState, useEffect, useCallback, useRef } from 'react';
import CanvasSequence from './components/CanvasSequence.jsx';
import ThreeUIDock from './components/ThreeUIDock.jsx';
import SoundLab from './components/SoundLab.jsx';
import ColorStudio from './components/ColorStudio.jsx';
import SpecsGrid from './components/SpecsGrid.jsx';
import CheckoutModal from './components/CheckoutModal.jsx';
import './App.css';

export default function App() {
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const activeSectionRef = useRef('overview');

  // Track active section only (debounced to avoid re-renders)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          let nextSection = 'overview';

          if (currentScroll < 700) {
            nextSection = 'overview';
          } else if (currentScroll < 1700) {
            nextSection = 'architecture';
          } else if (currentScroll < 2600) {
            nextSection = 'sound-lab';
          } else if (currentScroll < 3500) {
            nextSection = 'color-studio';
          } else {
            nextSection = 'specifications';
          }

          if (nextSection !== activeSectionRef.current) {
            activeSectionRef.current = nextSection;
            setActiveSection(nextSection);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sylva-app">
      {/* Fixed Fullscreen 3D Headphone Canvas Background */}
      <CanvasSequence
        isAutoPlay={isAutoPlay}
        onToggleAutoPlay={() => setIsAutoPlay(!isAutoPlay)}
      />

      {/* Floating ThreeUI Proximity Dock */}
      <ThreeUIDock
        activeSection={activeSection}
        onSectionClick={scrollToSection}
        onPreOrderClick={() => setIsCheckoutOpen(true)}
      />

      {/* ── THREEUI SYLVA HERO SHELL ─────────────────────────────────────── */}
      <header className="sylva-hero">
        <div className="stage">
          {/* Column guides (z 1) */}
          <div className="guides" aria-hidden="true">
            <i style={{ left: 'calc(46 * var(--u))' }}></i>
            <i style={{ left: 'calc(296 * var(--u))' }}></i>
            <i style={{ left: 'calc(546 * var(--u))' }}></i>
            <i style={{ left: 'calc(796 * var(--u))' }}></i>
            <i style={{ left: 'calc(1046 * var(--u))' }}></i>
            <i style={{ left: 'calc(1296 * var(--u))' }}></i>
            <i style={{ left: 'calc(1554 * var(--u))' }}></i>
          </div>

          {/* Monumental Ghost Wordmark (z 1) */}
          <div className="ghost" aria-hidden="true">AURA</div>

          {/* Hero Headline (z 4) */}
          <h1 className="headline">
            <span><i>Pure Sonic</i></span>
            <span><i>Architecture.</i></span>
          </h1>

          {/* Lede (z 4) */}
          <p className="lede">
            Restoring acoustic purity through patient unibody design, 40mm custom beryllium drivers, and a deeper kind of spatial immersion.
          </p>

          {/* Liquid-Metal Explore Control (z 4) */}
          <div className="pill-clip">
            <div className="pill">
              <div className="liquid-stage liquid-stage--explore">
                <div className="liquid-plate"></div>
                <button
                  className="liquid-button liquid-button--explore"
                  onClick={() => scrollToSection('architecture')}
                >
                  <span className="ico">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                  <span className="lbl">Explore 3D</span>
                </button>
              </div>
            </div>
          </div>

          {/* Liquid-Metal Play Control (z 4) */}
          <div className="play-wrap">
            <div className="play-clip">
              <div className="liquid-stage liquid-stage--play">
                <div className="liquid-plate"></div>
                <button
                  className="liquid-button liquid-button--play"
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  title={isAutoPlay ? 'Pause 3D Rotation' : 'Auto-Spin 3D Model'}
                >
                  <span className="ico">
                    {isAutoPlay ? (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    )}
                  </span>
                </button>
              </div>
            </div>
            <div className="play-ring" aria-hidden="true"></div>
          </div>

          {/* Stat A (z 4) */}
          <div className="stat stat--a">
            <div className="mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <dl>
              <dt>Playtime</dt>
              <dd>60 Hours Ultra-Life</dd>
            </dl>
          </div>

          {/* Stat B (z 4) */}
          <div className="stat stat--b">
            <div className="mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 0 1 10 10c0 5.5-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2z"></path>
                <path d="M12 6v12"></path>
              </svg>
            </div>
            <dl>
              <dt>Noise Cancellation</dt>
              <dd>-42dB Hybrid ANC</dd>
            </dl>
          </div>

          {/* Floating Luxury Card 1 (Acoustic Cavity) */}
          <div className="card card--about" onClick={() => scrollToSection('architecture')}>
            <span className="label">Field Note 01</span>
            <h2>Acoustic Cavity</h2>
            <figure>
              <img src="/frames/ezgif-frame-001.png" alt="Acoustic Cavity" />
            </figure>
            <div className="knob" title="View Details">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
          </div>

          {/* Floating Luxury Card 2 (Exploded Transducer) */}
          <div className="card card--stove" onClick={() => scrollToSection('architecture')}>
            <span className="label">Engineering</span>
            <h2>Exploded 3D Transducer</h2>
            <figure>
              <img src="/frames/ezgif-frame-250.png" alt="Exploded Transducer" />
            </figure>
            <div className="knob" title="View Details">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* ── FOREGROUND CONTENT SECTIONS ─────────────────────────────────── */}
      <div className="sylva-content-body">
        {/* SECTION: Ergonomic Architecture */}
        <section className="sylva-section" id="architecture">
          <div className="sylva-container">
            <div className="section-grid-split">
              <div className="sylva-text-block">
                <span className="sylva-tag">STAGE 01 // ERGONOMIC MASTERY</span>
                <h2 className="sylva-heading">Formed to the Cranial Silhouette</h2>
                <p className="sylva-copy">
                  Multi-axis aerospace-grade aluminum swivel hinges adapt smoothly to cranial contours. Premium memory foam ear cushions deliver an acoustic seal that blocks passive ambient bleed while maintaining featherweight all-day comfort.
                </p>
                <div className="sylva-pill-badges">
                  <span className="sylva-pill">CNC Swivel Hinge</span>
                  <span className="sylva-pill">Memory Foam Seal</span>
                  <span className="sylva-pill">Titanium Headband</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: Physical Deconstruction */}
        <section className="sylva-section justify-right">
          <div className="sylva-container align-right-container">
            <div className="sylva-text-block right-aligned">
              <span className="sylva-tag">STAGE 02 // PHYSICAL DISASSEMBLY</span>
              <h2 className="sylva-heading">Inside the Chamber of Sound</h2>
              <p className="sylva-copy">
                The 3D exploded sequence reveals the heart of the transducer: high-flux neodymium magnets, an ultra-low jitter digital-to-analog converter (DAC), and precision micro-baffles engineered to prevent harmonic resonance.
              </p>
              <div className="sylva-pill-badges justify-end">
                <span className="sylva-pill">Dual-Baffle Chamber</span>
                <span className="sylva-pill">32-Bit Audiophile DAC</span>
                <span className="sylva-pill">Quad Beamforming Mics</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: Precision Schematic Blueprint */}
        <section className="sylva-section">
          <div className="sylva-container">
            <div className="sylva-blueprint-card">
              <div className="blueprint-header">
                <div>
                  <span className="sylva-tag">STAGE 03 // BLUEPRINT PRECISION</span>
                  <h2 className="sylva-heading">Microscopic Engineering Revealed</h2>
                </div>
                <span className="blueprint-status-tag">300/300 ACTIVE</span>
              </div>

              <p className="sylva-copy">
                All 18 precision sub-assemblies calibrated in harmonious balance. From the internal lithium-ion power cell to the reinforced titanium headband slider.
              </p>

              <div className="blueprint-specs-grid">
                <div className="blueprint-spec-col">
                  <span className="spec-num">01</span>
                  <div>
                    <strong>Neodymium 40mm Driver</strong>
                    <p>Frequency response down to 5Hz</p>
                  </div>
                </div>
                <div className="blueprint-spec-col">
                  <span className="spec-num">02</span>
                  <div>
                    <strong>High-Density Li-Ion Cell</strong>
                    <p>10-minute quick charge yields 10 hours</p>
                  </div>
                </div>
                <div className="blueprint-spec-col">
                  <span className="spec-num">03</span>
                  <div>
                    <strong>Bluetooth 5.3 SoC</strong>
                    <p>Ultra-low 28ms gaming latency</p>
                  </div>
                </div>
                <div className="blueprint-spec-col">
                  <span className="spec-num">04</span>
                  <div>
                    <strong>Multi-Axis Swivel Mechanism</strong>
                    <p>Rated for 25,000+ flex cycles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: Sound Lab & ANC Simulation */}
        <SoundLab />

        {/* SECTION: Colorway Studio */}
        <ColorStudio />

        {/* SECTION: Comprehensive Specs Grid */}
        <SpecsGrid />

        {/* SECTION: Accolades & Critique */}
        <section className="sylva-accolades-section">
          <div className="sylva-container">
            <div className="sylva-accolades-grid">
              <div className="sylva-card-box">
                <span className="sylva-card-kicker">AWARD WINNER</span>
                <h4>Red Dot Best of the Best</h4>
                <p>Recognized for seamless unibody aluminum engineering and acoustic harmony.</p>
              </div>
              <div className="sylva-card-box">
                <span className="sylva-card-kicker">GOLD RATED</span>
                <h4>Japan Audio Society Hi-Res</h4>
                <p>Exceeds high-resolution playback criteria with response extending to 40kHz.</p>
              </div>
              <div className="sylva-card-box">
                <span className="sylva-card-kicker">ZERO LATENCY</span>
                <h4>Pro Studio Certified</h4>
                <p>Ultra-low latency audio processing suitable for broadcast and competitive esports.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final Pre-Order Banner */}
        <section className="sylva-cta-section">
          <div className="sylva-cta-box">
            <span className="sylva-tag">LIMITED FIRST EDITION</span>
            <h2 className="sylva-cta-title">Ascend to Pure Audio Architecture</h2>
            <p className="sylva-cta-sub">
              Each pair in the initial 1,500 unit production run includes a numbered commemorative stainless steel card and lifetime priority concierge support.
            </p>
            <button
              className="liquid-button liquid-button--explore cta-explore-btn"
              onClick={() => setIsCheckoutOpen(true)}
            >
              <span className="lbl">Reserve Aura Pro • $349 USD</span>
            </button>
          </div>
        </section>

        {/* ThreeUI Styled Footer */}
        <footer className="sylva-footer">
          <div className="sylva-container footer-flex">
            <div className="footer-left">
              <span className="footer-icon">◈</span>
              <strong>AURA PRO // APEX AUDIO ARCHITECTURE</strong>
            </div>
            <span className="footer-meta">
              © 2026 Aura Technologies Inc. All rights reserved.
            </span>
          </div>
        </footer>
      </div>

      {/* Pre-Order Slide-out Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
}
