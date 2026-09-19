import React, { useState, useEffect, useCallback } from 'react';
import CanvasSequence from './components/CanvasSequence.jsx';
import SoundLab from './components/SoundLab.jsx';
import ColorStudio from './components/ColorStudio.jsx';
import SpecsGrid from './components/SpecsGrid.jsx';
import CheckoutModal from './components/CheckoutModal.jsx';
import './App.css';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Track global page scroll progress for background frame sequence
  const handleScroll = useCallback(() => {
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const maxScroll = docHeight - winHeight;
    const currentScroll = window.scrollY;

    const progress = maxScroll > 0 ? Math.min(1, Math.max(0, currentScroll / maxScroll)) : 0;
    setScrollProgress(progress);

    if (currentScroll > 350) {
      setShowStickyBar(true);
    } else {
      setShowStickyBar(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleFrameProgress = useCallback((prog, frame) => {
    setCurrentFrame(frame);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="aura-cinema-app liquid-glass-theme">
      {/* 3D Headphone Sequence as Fixed Fullscreen Background */}
      <CanvasSequence
        scrollProgress={scrollProgress}
        onProgressUpdate={handleFrameProgress}
        isAutoPlay={isAutoPlay}
        onToggleAutoPlay={() => setIsAutoPlay(!isAutoPlay)}
      />

      {/* Floating Liquid Glass Navigation Bar (matching UI.jpg pill bar) */}
      <header className="liquid-floating-nav">
        <div className="nav-inner">
          <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="liquid-brand-bubble">◈</span>
            <span className="brand-name">AURA PRO</span>
            <span className="brand-model">LIQUID GLASS</span>
          </div>

          <nav className="nav-links">
            <button className="nav-link-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Overview
            </button>
            <button className="nav-link-btn" onClick={() => scrollToSection('architecture')}>
              Architecture
            </button>
            <button className="nav-link-btn" onClick={() => scrollToSection('sound-lab')}>
              Sound Lab
            </button>
            <button className="nav-link-btn" onClick={() => scrollToSection('color-studio')}>
              Finishes
            </button>
            <button className="nav-link-btn" onClick={() => scrollToSection('specifications')}>
              Specs
            </button>
          </nav>

          <div className="nav-cta-group">
            {/* 3D Background Control & Frame Telemetry */}
            <div className="liquid-nav-telemetry">
              <button
                id="btn-toggle-autoplay"
                className={`liquid-pill-toggle ${isAutoPlay ? 'active' : ''}`}
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                title="Toggle 3D auto rotation"
              >
                {isAutoPlay ? '⏸ Pause 3D' : '▶ 3D Auto-Spin'}
              </button>
              <span className="frame-counter-pill">
                FRM {String(currentFrame).padStart(3, '0')}/300
              </span>
            </div>

            {/* Primary Violet Liquid Button from UI.jpg */}
            <button
              id="nav-preorder-btn"
              className="btn-liquid-primary"
              onClick={() => setIsCheckoutOpen(true)}
            >
              Pre-Order • $349
            </button>
          </div>
        </div>
      </header>

      {/* Foreground Content Stack */}
      <div className="foreground-content-stack">
        {/* SECTION 1: Hero Stage */}
        <section className="scroll-stage-section hero-stage">
          <div className="hero-content-box">
            <div className="liquid-badge-pill">
              <span className="pulsing-radar"></span>
              LIQUID GLASS ACOUSTIC ARCHITECTURE
            </div>
            <h1 className="hero-main-title">
              PURE SONIC <br />
              <span className="hero-gradient-text">TRANSCENDENCE.</span>
            </h1>
            <p className="hero-lead-text">
              Sculpted for sensory perfection. The 3D headphone rotates and explodes in the background beneath refractive liquid glass surfaces.
            </p>

            {/* Liquid Action Buttons directly mirroring UI.jpg */}
            <div className="hero-liquid-btn-row">
              <button
                className="btn-liquid-primary hero-btn"
                onClick={() => setIsCheckoutOpen(true)}
              >
                Primary Button • Reserve Now
              </button>

              <button
                className="btn-liquid-secondary hero-btn"
                onClick={() => scrollToSection('architecture')}
              >
                Secondary Button • Explore 3D
              </button>

              <button
                className="btn-circle-bubble"
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                title="3D Auto-Spin Toggle"
              >
                +
              </button>
            </div>

            {/* Floating Metric Liquid Pills */}
            <div className="hero-metrics-pill-row">
              <div className="liquid-metric-pill">
                <span className="pill-dot cyan"></span>
                <strong>40mm</strong> Dynamic Driver
              </div>
              <div className="liquid-metric-pill">
                <span className="pill-dot indigo"></span>
                <strong>-42dB</strong> Hybrid ANC
              </div>
              <div className="liquid-metric-pill">
                <span className="pill-dot gold"></span>
                <strong>60 Hours</strong> Playtime
              </div>
            </div>

            <div className="scroll-indicator-cue">
              <span className="mouse-icon">
                <span className="mouse-wheel"></span>
              </span>
              <span className="cue-label">SCROLL TO ROTATE & EXPLODE 3D MODEL</span>
            </div>
          </div>
        </section>

        {/* SECTION 2: Ergonomic Architecture Stage */}
        <section className="scroll-stage-section" id="architecture">
          <div className="section-container">
            {/* Liquid Glass Narrative Card */}
            <div className="liquid-glass-slab narrative-card">
              <div className="card-kicker">STAGE 01 // ERGONOMIC MASTERY</div>
              <h2 className="card-headline">Formed to the Human Silhouette</h2>
              <p className="card-body">
                Multi-axis aerospace-grade aluminum swivel hinges adapt smoothly to cranial contours. Premium memory foam ear cushions deliver an acoustic seal that blocks passive ambient bleed while maintaining featherweight all-day comfort.
              </p>
              <div className="feature-tags-group">
                <span className="liquid-tag">CNC Swivel Hinge</span>
                <span className="liquid-tag">Pressure-Relief Foam</span>
                <span className="liquid-tag">Acoustic Isolation Ring</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: The Deconstruction (Exploded View) Stage */}
        <section className="scroll-stage-section justify-right">
          <div className="section-container align-right-container">
            {/* Iridescent Gradient Card from UI.jpg ("Modern Glass UI Design") */}
            <div className="iridescent-glass-card narrative-card">
              <div className="card-kicker">STAGE 02 // PHYSICAL DISASSEMBLY</div>
              <h2 className="card-headline">Inside the Chamber of Sound</h2>
              <p className="card-body">
                Our 3D exploded sequence reveals the heart of the transducer: high-flux neodymium magnets, an ultra-low jitter digital-to-analog converter (DAC), and precision micro-baffles engineered to prevent harmonic resonance.
              </p>
              <div className="feature-tags-group">
                <span className="liquid-tag violet-glow">Dual-Baffle Chamber</span>
                <span className="liquid-tag teal-glow">32-Bit Audiophile DAC</span>
                <span className="liquid-tag rose-glow">Quad Mic Beamforming</span>
              </div>
              <div className="milky-pill-btn" style={{ marginTop: '20px' }}>
                <span>↑ High-Precision Transducer Active</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Precision Blueprint Schematic Stage */}
        <section className="scroll-stage-section">
          <div className="section-container">
            <div className="liquid-glass-slab schematic-floating-hud">
              <div className="schematic-header">
                <div>
                  <span className="card-kicker">STAGE 03 // BLUEPRINT PRECISION</span>
                  <h2 className="schematic-title">Microscopic Engineering Revealed</h2>
                </div>
                <span className="liquid-badge-pill">300/300 COMPLETE</span>
              </div>

              <p className="schematic-desc">
                All 18 precision sub-assemblies calibrated in harmonious balance. From the internal lithium-ion power cell to the reinforced titanium headband slider.
              </p>

              <div className="schematic-highlights-grid">
                <div className="schematic-spec-item">
                  <span className="spec-bullet">01</span>
                  <div>
                    <strong>Neodymium 40mm Driver</strong>
                    <p>Pure bass response down to 5Hz</p>
                  </div>
                </div>
                <div className="schematic-spec-item">
                  <span className="spec-bullet">02</span>
                  <div>
                    <strong>High-Density Li-Ion Cell</strong>
                    <p>10-minute quick charge yields 10 hours</p>
                  </div>
                </div>
                <div className="schematic-spec-item">
                  <span className="spec-bullet">03</span>
                  <div>
                    <strong>Bluetooth 5.3 SoC</strong>
                    <p>Ultra-low 28ms gaming latency</p>
                  </div>
                </div>
                <div className="schematic-spec-item">
                  <span className="spec-bullet">04</span>
                  <div>
                    <strong>Multi-Axis Swivel Mechanism</strong>
                    <p>Rated for 25,000+ flex cycles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Narrative Acoustic Comparison Strip */}
        <section className="quote-banner-section">
          <div className="quote-banner-content">
            <div className="liquid-badge-pill">AUDIOPHILE CRITIQUE</div>
            <blockquote className="quote-text">
              “The Aura Pro renders micro-dynamics and acoustic separation so vividly, it feels like listening to music in zero gravity.”
            </blockquote>
            <span className="quote-author">— Sound & Vision Masterclass 2026</span>
          </div>
        </section>

        {/* Interactive Sound Lab & ANC Simulation */}
        <SoundLab />

        {/* Colorway Studio Section */}
        <ColorStudio />

        {/* Comprehensive Tech Specs Grid */}
        <SpecsGrid />

        {/* Feature Accolades Grid */}
        <section className="accolades-section">
          <div className="section-container">
            <div className="accolades-grid">
              <div className="liquid-glass-slab accolade-card">
                <span className="liquid-badge-sub">AWARD WINNER</span>
                <h4>Red Dot Best of the Best</h4>
                <p>Recognized for seamless unibody aluminum engineering and acoustic harmony.</p>
              </div>
              <div className="liquid-glass-slab accolade-card">
                <span className="liquid-badge-sub">GOLD RATED</span>
                <h4>Japan Audio Society Hi-Res</h4>
                <p>Exceeds high-resolution playback criteria with response extending to 40kHz.</p>
              </div>
              <div className="liquid-glass-slab accolade-card">
                <span className="liquid-badge-sub">ZERO LATENCY</span>
                <h4>Pro Studio Certified</h4>
                <p>Ultra-low latency audio processing suitable for broadcast and competitive esports.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final Pre-Order Call to Action Banner */}
        <section className="final-cta-section">
          <div className="final-cta-inner">
            <div className="liquid-badge-pill">LIMITED FIRST EDITION</div>
            <h2 className="final-title">Ascend to Pure Audio Architecture</h2>
            <p className="final-sub">
              Each pair in the initial 1,500 unit production run includes a numbered commemorative stainless steel card and lifetime priority concierge support.
            </p>
            <div className="final-btn-row">
              <button
                id="btn-final-preorder"
                className="btn-liquid-primary large"
                onClick={() => setIsCheckoutOpen(true)}
              >
                Reserve Aura Pro • $349 USD
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="cinema-footer">
          <div className="footer-inner">
            <div className="footer-top-row">
              <div className="footer-brand">
                <span className="brand-symbol">◈</span>
                <strong>AURA AUDIO ARCHITECTURE</strong>
              </div>
              <span className="footer-copyright">
                © 2026 Aura Technologies Inc. All rights reserved.
              </span>
            </div>
            <div className="footer-bottom-row">
              <span>Designed with Liquid Glass UI Kit</span>
              <span className="footer-spec-badge">VisionOS Aesthetic Active</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Bottom Sticky Purchase Dock (Reveals after scroll) */}
      <div className={`sticky-bottom-dock ${showStickyBar ? 'visible' : ''}`}>
        <div className="dock-inner liquid-glass-dock">
          <div className="dock-left">
            <img
              src="/frames/ezgif-frame-001.png"
              alt="Aura Pro"
              className="dock-thumb"
            />
            <div>
              <span className="dock-name">AURA PRO WIRELESS</span>
              <span className="dock-sub">Hi-Res • Hybrid ANC • 60H Battery</span>
            </div>
          </div>
          <div className="dock-right">
            <div className="dock-pricing">
              <span className="dock-strike">$399</span>
              <span className="dock-price">$349</span>
            </div>
            <button
              id="dock-preorder-btn"
              className="btn-liquid-primary compact"
              onClick={() => setIsCheckoutOpen(true)}
            >
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* Pre-Order Slide-out Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
}
