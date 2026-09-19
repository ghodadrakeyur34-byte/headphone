import React, { useState, useEffect, useRef } from 'react';

export default function SoundLab() {
  const [activeMode, setActiveMode] = useState('anc');
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);
  const filterNodeRef = useRef(null);
  const animFrameRef = useRef(null);

  const modes = [
    {
      id: 'anc',
      title: 'Active Noise Cancellation',
      shortTitle: 'ANC Mode',
      metric: '-42 dB Isolation',
      description: 'Dual inverted phase anti-noise waves silence low-frequency rumble, subway noise, and airplane cabins.',
      badgeColor: '#38bdf8',
      filterFreq: 180,
      filterType: 'lowpass'
    },
    {
      id: 'transparency',
      title: 'Crystal Transparency',
      shortTitle: 'Transparency',
      metric: 'Audio Pass-Through',
      description: 'Low-latency beamforming microphones amplify human voices and ambient safety sounds naturally.',
      badgeColor: '#2dd4bf',
      filterFreq: 3200,
      filterType: 'bandpass'
    },
    {
      id: 'spatial',
      title: '360° Dynamic Spatial Sound',
      shortTitle: 'Spatial 3D',
      metric: 'Binaural 3D Stage',
      description: 'Proprietary HRTF spatial algorithms position instruments in a holographic 3-dimensional dome around your head.',
      badgeColor: '#c084fc',
      filterFreq: 800,
      filterType: 'allpass'
    }
  ];

  const stopAudio = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {}
      oscillatorRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  const startAudio = (modeId = activeMode) => {
    stopAudio();

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      const selected = modes.find((m) => m.id === modeId) || modes[0];

      if (modeId === 'anc') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(65, ctx.currentTime);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(selected.filterFreq, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
      } else if (modeId === 'transparency') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(selected.filterFreq, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        filter.type = 'peaking';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);
        filter.Q.setValueAtTime(4, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
      }

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
      filterNodeRef.current = filter;

      setIsPlaying(true);
    } catch (e) {
      console.warn('AudioContext failed to start', e);
    }
  };

  const handleModeSelect = (id) => {
    setActiveMode(id);
    if (isPlaying) {
      startAudio(id);
    }
  };

  // Oscilloscope waveform animation with IntersectionObserver pause
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;
    let isVisible = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animFrameRef.current) {
          animFrameRef.current = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const render = () => {
      if (!isVisible) {
        animFrameRef.current = null;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.beginPath();
      ctx.lineWidth = 2.5;

      const cur = modes.find((m) => m.id === activeMode);
      ctx.strokeStyle = isPlaying ? cur.badgeColor : 'rgba(255, 255, 255, 0.25)';
      ctx.shadowColor = isPlaying ? cur.badgeColor : 'transparent';
      ctx.shadowBlur = isPlaying ? 16 : 0;

      const segments = window.innerWidth <= 768 ? 60 : 100;
      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * width;
        let amplitude = isPlaying ? 28 : 6;
        if (activeMode === 'anc' && isPlaying) amplitude = 12;
        if (activeMode === 'spatial' && isPlaying) amplitude = 34;

        const freq = activeMode === 'transparency' ? 0.08 : 0.04;
        const y = centerY + Math.sin(x * freq + phase) * amplitude * Math.sin((i / segments) * Math.PI);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      phase += isPlaying ? 0.08 : 0.02;
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      observer.disconnect();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, activeMode]);

  useEffect(() => {
    return () => stopAudio();
  }, []);

  const currentModeData = modes.find((m) => m.id === activeMode);

  return (
    <section className="sound-lab-section" id="sound-lab">
      <div className="section-container">
        <div className="lab-intro-header">
          <div className="liquid-badge-pill">
            <span className="bubble-icon">🧪</span>
            LIQUID SOUND INTELLIGENCE
          </div>
          <h2 className="section-title">Acoustic States in Pure Glass</h2>
          <p className="section-subtext">
            Toggle between our three hardware listening states with tactile liquid glass controls and live oscilloscope feedback.
          </p>
        </div>

        {/* Liquid Glass Console Slab */}
        <div className="liquid-glass-slab sound-lab-console">
          {/* Segmented Liquid Pill Selector (from UI.jpg) */}
          <div className="liquid-segmented-tabs">
            {modes.map((m) => (
              <button
                key={m.id}
                id={`mode-${m.id}`}
                className={`liquid-segment-btn ${activeMode === m.id ? 'active' : ''}`}
                onClick={() => handleModeSelect(m.id)}
              >
                <div className="segment-btn-inner">
                  <span
                    className="liquid-bubble-dot"
                    style={{ backgroundColor: m.badgeColor, boxShadow: `0 0 10px ${m.badgeColor}` }}
                  ></span>
                  <span className="segment-title">{m.shortTitle}</span>
                </div>
                {activeMode === m.id && <span className="segment-active-line"></span>}
              </button>
            ))}
          </div>

          {/* Liquid Waveform Stage */}
          <div className="waveform-display-stage">
            <div className="waveform-info-top">
              <span className="liquid-status-pill">
                <span className={`live-dot ${isPlaying ? 'pulse' : ''}`}></span>
                {isPlaying ? `ACOUSTIC FREQUENCY: ${currentModeData.title.toUpperCase()}` : 'ENGINE READY'}
              </span>
              <span className="liquid-codec-pill">96kHz / 24-Bit Studio DAC</span>
            </div>

            <div className="waveform-glass-well">
              <canvas
                ref={canvasRef}
                width={800}
                height={140}
                className="waveform-canvas"
              />
            </div>

            <div className="waveform-bottom-controls">
              <div className="mode-desc-box">
                <span className="mode-metric-tag">{currentModeData.metric}</span>
                <p className="mode-long-desc">{currentModeData.description}</p>
              </div>

              <div className="btn-action-group">
                <button
                  id="btn-toggle-audio-sim"
                  className={`btn-liquid-secondary ${isPlaying ? 'btn-playing-stop' : ''}`}
                  onClick={() => (isPlaying ? stopAudio() : startAudio())}
                >
                  {isPlaying ? '⏹ Pause Sound Test' : '▶ Simulate Audio Tone'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
