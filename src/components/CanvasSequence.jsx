import React, { useEffect, useRef, useState, useCallback } from 'react';

export default function CanvasSequence({
  scrollProgress,
  onProgressUpdate,
  isAutoPlay = false,
  onToggleAutoPlay
}) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const rafRef = useRef(null);
  const autoPlayTimerRef = useRef(null);

  const TOTAL_FRAMES = 300;
  const pad = (n) => String(n).padStart(3, '0');

  // Draw frame on canvas with Retina DPR and aspect-ratio containment
  const drawFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Find closest loaded frame if requested frame isn't loaded yet
    let img = imagesRef.current[frameIndex];
    if (!img) {
      for (let offset = 1; offset < 25; offset++) {
        if (imagesRef.current[frameIndex - offset]) {
          img = imagesRef.current[frameIndex - offset];
          break;
        }
        if (imagesRef.current[frameIndex + offset]) {
          img = imagesRef.current[frameIndex + offset];
          break;
        }
      }
    }
    if (!img) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Deep black canvas background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Fit contain logic
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
  }, []);

  // Preload images progressively
  useEffect(() => {
    let isCancelled = false;
    const images = new Array(TOTAL_FRAMES);
    let loaded = 0;

    // Load first frame immediately
    const firstImg = new Image();
    firstImg.src = `/frames/ezgif-frame-${pad(1)}.png`;
    firstImg.onload = () => {
      images[0] = firstImg;
      loaded++;
      drawFrame(0);
      if (!isCancelled) {
        setLoadProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
      }
    };

    // Load the rest progressively
    const loadBatch = async () => {
      for (let i = 1; i < TOTAL_FRAMES; i++) {
        if (isCancelled) break;
        const img = new Image();
        img.src = `/frames/ezgif-frame-${pad(i + 1)}.png`;
        img.onload = () => {
          images[i] = img;
          loaded++;
          if (!isCancelled) {
            setLoadProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
          }
        };
        // Small pause every 15 images to avoid blocking main thread
        if (i % 15 === 0) {
          await new Promise((r) => setTimeout(r, 10));
        }
      }
    };

    imagesRef.current = images;
    loadBatch();

    return () => {
      isCancelled = true;
    };
  }, [drawFrame]);

  // Sync target frame with scroll progress when not in auto-play
  useEffect(() => {
    if (!isAutoPlay) {
      const rawFrame = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(scrollProgress * (TOTAL_FRAMES - 1))));
      targetFrameRef.current = rawFrame;
    }
  }, [scrollProgress, isAutoPlay]);

  // Auto-play loop
  useEffect(() => {
    if (isAutoPlay) {
      autoPlayTimerRef.current = setInterval(() => {
        targetFrameRef.current = (targetFrameRef.current + 1) % TOTAL_FRAMES;
      }, 1000 / 30);
    } else {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    }
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlay]);

  // Smooth animation loop (lerp)
  useEffect(() => {
    const updateLoop = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.05) {
        currentFrameRef.current += diff * (isAutoPlay ? 0.35 : 0.18);
        const renderIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrameRef.current)));
        drawFrame(renderIndex);
        if (onProgressUpdate) {
          onProgressUpdate(renderIndex / (TOTAL_FRAMES - 1), renderIndex + 1);
        }
      }
      rafRef.current = requestAnimationFrame(updateLoop);
    };

    rafRef.current = requestAnimationFrame(updateLoop);

    const handleResize = () => {
      drawFrame(Math.round(currentFrameRef.current));
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [drawFrame, onProgressUpdate, isAutoPlay]);

  return (
    <div className="fixed-background-canvas">
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
