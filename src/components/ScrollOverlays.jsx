import React from 'react';

export default function ScrollOverlays({ progress, currentFrame }) {
  // Stage visibility thresholds
  const isStage1 = progress < 0.22;
  const isStage2 = progress >= 0.22 && progress < 0.48;
  const isStage3 = progress >= 0.48 && progress < 0.72;
  const isStage4 = progress >= 0.72;

  // Calculate local opacity for smooth transitions
  const getStageOpacity = (min, max) => {
    const fadeInEnd = min + 0.05;
    const fadeOutStart = max - 0.05;
    if (progress < min || progress > max) return 0;
    if (progress < fadeInEnd) return (progress - min) / 0.05;
    if (progress > fadeOutStart) return (max - progress) / 0.05;
    return 1;
  };

  return (
    <div className="scroll-overlays-container">
      {/* Top HUD Bar with Frame Indicator & Progress */}
      <div className="cinematic-hud">
        <div className="hud-left">
          <span className="hud-brand-tag">AURA PRO WIRELESS</span>
          <span className="hud-divider">/</span>
          <span className="hud-mode">3D ACOUSTIC EXPLORER</span>
        </div>
        <div className="hud-right">
          <div className="hud-stat">
            <span className="stat-label">FRAME</span>
            <span className="stat-value">{String(currentFrame).padStart(3, '0')} / 300</span>
          </div>
          <div className="hud-stat">
            <span className="stat-label">SEQUENCE</span>
            <span className="stat-value">{Math.round(progress * 100)}%</span>
          </div>
        </div>
      </div>

      {/* STAGE 1: Hero Intro (Frames 1-65) */}
      <div
        className="stage-overlay stage-hero"
        style={{
          opacity: getStageOpacity(0, 0.22),
          pointerEvents: isStage1 ? 'auto' : 'none',
          transform: `translateY(${(0.11 - progress) * 40}px)`,
        }}
      >
        <div className="hero-kicker">
          <span className="pulsing-radar"></span>
          NEXT-GENERATION ACOUSTIC MASTERPIECE
        </div>
        <h1 className="hero-main-title">
          PURE SONIC <br />
          <span className="hero-gradient-text">ARCHITECTURE.</span>
        </h1>
        <p className="hero-lead-text">
          Engineered without compromise. Experience 360-degree spatial audio powered by 40mm custom neodymium drivers and zero-distortion acoustic cavities.
        </p>

        <div className="hero-metrics-pill-row">
          <div className="metric-pill">
            <span className="pill-dot cyan"></span>
            <strong>40mm</strong> Custom Dynamic Driver
          </div>
          <div className="metric-pill">
            <span className="pill-dot indigo"></span>
            <strong>-42dB</strong> Hybrid Active Noise Cancelling
          </div>
          <div className="metric-pill">
            <span className="pill-dot gold"></span>
            <strong>60 Hours</strong> Ultra-Long Battery Life
          </div>
        </div>

        <div className="scroll-indicator-cue">
          <span className="mouse-icon">
            <span className="mouse-wheel"></span>
          </span>
          <span className="cue-label">SCROLL TO DECONSTRUCT INTERNALS</span>
        </div>
      </div>

      {/* STAGE 2: Ergonomic Acoustics (Frames 66-145) */}
      <div
        className="stage-overlay stage-ergonomics"
        style={{
          opacity: getStageOpacity(0.22, 0.48),
          pointerEvents: isStage2 ? 'auto' : 'none',
          transform: `translateY(${(0.35 - progress) * 50}px)`,
        }}
      >
        <div className="glass-narrative-card">
          <div className="card-kicker">STAGE 01 // ERGONOMIC MASTERY</div>
          <h2 className="card-headline">Formed to the Human Silhouette</h2>
          <p className="card-body">
            Multi-axis aerospace-grade aluminum swivel hinges adapt smoothly to cranial contours. Premium memory foam ear cushions deliver an acoustic seal that blocks passive ambient bleed while maintaining featherweight all-day comfort.
          </p>
          <div className="feature-tags-group">
            <span className="tech-tag">CNC Swivel Hinge</span>
            <span className="tech-tag">Pressure-Relief Foam</span>
            <span className="tech-tag">Acoustic Isolation Ring</span>
          </div>
        </div>
      </div>

      {/* STAGE 3: The Deconstruction (Frames 146-220) */}
      <div
        className="stage-overlay stage-exploded"
        style={{
          opacity: getStageOpacity(0.48, 0.72),
          pointerEvents: isStage3 ? 'auto' : 'none',
          transform: `translateY(${(0.60 - progress) * 50}px)`,
        }}
      >
        <div className="glass-narrative-card align-right">
          <div className="card-kicker">STAGE 02 // PHYSICAL DISASSEMBLY</div>
          <h2 className="card-headline">Inside the Chamber of Sound</h2>
          <p className="card-body">
            Watch the 3D explosion reveal the heart of the transducer: high-flux neodymium magnets, an ultra-low jitter digital-to-analog converter (DAC), and precision micro-baffles engineered to prevent unwanted harmonic distortion.
          </p>
          <div className="feature-tags-group justify-end">
            <span className="tech-tag cyan-glow">Dual-Baffle Chamber</span>
            <span className="tech-tag indigo-glow">32-Bit Audiophile DAC</span>
            <span className="tech-tag purple-glow">Quad Microphone Beamforming</span>
          </div>
        </div>
      </div>

      {/* STAGE 4: Precision Schematic Blueprint (Frames 221-300) */}
      <div
        className="stage-overlay stage-schematic"
        style={{
          opacity: getStageOpacity(0.72, 1.0),
          pointerEvents: isStage4 ? 'auto' : 'none',
          transform: `translateY(${(0.86 - progress) * 40}px)`,
        }}
      >
        <div className="schematic-floating-hud">
          <div className="schematic-header">
            <div>
              <span className="card-kicker">STAGE 03 // BLUEPRINT PRECISION</span>
              <h2 className="schematic-title">Microscopic Engineering Revealed</h2>
            </div>
            <span className="schematic-badge">300/300 COMPLETE</span>
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
    </div>
  );
}
