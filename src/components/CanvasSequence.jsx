import React, { useEffect, useRef, useState, useCallback } from 'react';

export default function CanvasSequence({
  isAutoPlay = false,
  onToggleAutoPlay
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const imagesRef = useRef([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const rafRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const lastDrawnIndexRef = useRef(-1);
  const autoPlayTimerRef = useRef(null);
  const isMobileRef = useRef(false);

  const TOTAL_FRAMES = 300;
  const pad = (n) => String(n).padStart(3, '0');

  // Check mobile device / small viewport
  useEffect(() => {
    const checkMobile = () => {
      isMobileRef.current =
        window.innerWidth <= 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Draw frame on canvas with clamped DPR and aspect-ratio containment
  const drawFrame = useCallback((frameIndex, force = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const roundedIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(frameIndex)));
    if (!force && roundedIndex === lastDrawnIndexRef.current) {
      return;
    }

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Find closest loaded frame if requested frame isn't loaded yet
    let img = imagesRef.current[roundedIndex];
    if (!img) {
      const maxSearch = isMobileRef.current ? 30 : 20;
      for (let offset = 1; offset <= maxSearch; offset++) {
        if (imagesRef.current[roundedIndex - offset]) {
          img = imagesRef.current[roundedIndex - offset];
          break;
        }
        if (imagesRef.current[roundedIndex + offset]) {
          img = imagesRef.current[roundedIndex + offset];
          break;
        }
      }
    }
    if (!img) return;

    const isMob = isMobileRef.current;
    // Cap DPR: 1.25 on mobile (saves 3-4x pixel fill vs 3x Retina), 1.75 on desktop
    const rawDpr = window.devicePixelRatio || 1;
    const dpr = isMob ? Math.min(rawDpr, 1.25) : Math.min(rawDpr, 1.75);

    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;

    const targetBufferW = Math.round(width * dpr);
    const targetBufferH = Math.round(height * dpr);

    if (canvas.width !== targetBufferW || canvas.height !== targetBufferH) {
      canvas.width = targetBufferW;
      canvas.height = targetBufferH;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Deep black canvas background
    ctx.fillStyle = '#040507';
    ctx.fillRect(0, 0, width, height);

    // Fit contain logic (1920x1080 source)
    const imgRatio = 1920 / 1080;
    const canvasRatio = width / height;

    let drawW, drawH, drawX, drawY;

    if (canvasRatio > imgRatio) {
      drawH = height;
      drawW = height * imgRatio;
      drawX = (width - drawW) / 2;
      drawY = 0;
    } else {
      drawW = width;
      drawH = width / imgRatio;
      drawX = 0;
      drawY = (height - drawH) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();

    lastDrawnIndexRef.current = roundedIndex;
  }, []);

  // Request an animation loop only when actively moving
  const startAnimationLoop = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const updateLoop = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      const isAuto = isAutoPlay;

      if (Math.abs(diff) > 0.03 || isAuto) {
        // Smooth lerp: slightly snappier on mobile to avoid trailing delay
        const lerpFactor = isAuto ? 0.35 : (isMobileRef.current ? 0.25 : 0.18);
        currentFrameRef.current += diff * lerpFactor;
        drawFrame(currentFrameRef.current);
        rafRef.current = requestAnimationFrame(updateLoop);
      } else {
        // Snapped to final position: draw final frame and SLEEP the RAF loop
        currentFrameRef.current = targetFrameRef.current;
        drawFrame(currentFrameRef.current);
        isAnimatingRef.current = false;
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(updateLoop);
  }, [drawFrame, isAutoPlay]);

  // Direct passive scroll listener: updates target frame without re-rendering parent React tree
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!isAutoPlay) {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const docHeight = document.documentElement.scrollHeight;
            const winHeight = window.innerHeight;
            const maxScroll = docHeight - winHeight;
            const scrollY = window.scrollY;

            const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
            const nextFrame = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(progress * (TOTAL_FRAMES - 1))));

            if (targetFrameRef.current !== nextFrame) {
              targetFrameRef.current = nextFrame;
              startAnimationLoop();
            }
            ticking = false;
          });
          ticking = true;
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial calculate
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [isAutoPlay, startAnimationLoop]);

  // Two-Phase Progressive Preloading
  // Phase 1: Load 25 keyframes across the 300 range first (gives instant scrubbing everywhere).
  // Phase 2: Load remaining frames (every 2nd frame on mobile: 150 frames, all 300 on desktop).
  useEffect(() => {
    let isCancelled = false;
    const images = new Array(TOTAL_FRAMES);
    const isMob =
      window.innerWidth <= 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const step = isMob ? 2 : 1;

    let loadedCount = 0;
    const totalToLoad = isMob ? Math.ceil(TOTAL_FRAMES / 2) : TOTAL_FRAMES;

    const loadImage = (index) => {
      return new Promise((resolve) => {
        if (images[index]) {
          resolve(images[index]);
          return;
        }
        const img = new Image();
        img.src = `/frames/ezgif-frame-${pad(index + 1)}.png`;
        img.onload = () => {
          if (!isCancelled) {
            images[index] = img;
            loadedCount++;
            setLoadProgress(Math.min(100, Math.round((loadedCount / totalToLoad) * 100)));
          }
          resolve(img);
        };
        img.onerror = () => resolve(null);
      });
    };

    const preloadAll = async () => {
      // Step 1: Load Frame 0 immediately
      await loadImage(0);
      drawFrame(0, true);

      // Step 2: Phase 1 Keyframes (every 12th frame) so scrubbing is responsive immediately
      const keyframeStep = isMob ? 24 : 12;
      for (let i = keyframeStep; i < TOTAL_FRAMES; i += keyframeStep) {
        if (isCancelled) return;
        await loadImage(i);
      }

      // Step 3: Phase 2 Infill (every 2nd frame on mobile, all on desktop)
      for (let i = 0; i < TOTAL_FRAMES; i += step) {
        if (isCancelled) return;
        if (!images[i]) {
          await loadImage(i);
          // Micro-pause every 10 images on mobile to yield main thread
          if (i % (isMob ? 10 : 20) === 0) {
            await new Promise((r) => setTimeout(r, isMob ? 18 : 8));
          }
        }
      }
    };

    imagesRef.current = images;
    preloadAll();

    return () => {
      isCancelled = true;
    };
  }, [drawFrame]);

  // Auto-play loop handling
  useEffect(() => {
    if (isAutoPlay) {
      startAnimationLoop();
      autoPlayTimerRef.current = setInterval(() => {
        targetFrameRef.current = (targetFrameRef.current + 1) % TOTAL_FRAMES;
        startAnimationLoop();
      }, 1000 / 30);
    } else {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    }
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlay, startAnimationLoop]);

  // Handle Window Resize / Orientation Change with debounce
  useEffect(() => {
    let resizeTimer = null;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        drawFrame(currentFrameRef.current, true);
      }, 100);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (resizeTimer) clearTimeout(resizeTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame]);

  return (
    <div ref={containerRef} className="fixed-background-canvas">
      {/* Loading Progress Strip */}
      {loadProgress < 100 && (
        <div className="preloader-strip">
          <div className="preloader-text">
            <span>PRELOADING 3D BACKGROUND</span>
            <span>{loadProgress}%</span>
          </div>
          <div className="preloader-track">
            <div
              className="preloader-fill"
              style={{ width: `${loadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Fullscreen Background Canvas */}
      <canvas ref={canvasRef} className="sequence-canvas" />

      {/* Ambient Vignette Overlay */}
      <div className="canvas-vignette"></div>
      <div className="canvas-ambient-glow"></div>
    </div>
  );
}
