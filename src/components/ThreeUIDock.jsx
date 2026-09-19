import React, { useRef, useEffect, useCallback } from 'react';

export default function ThreeUIDock({ onSectionClick, onPreOrderClick, activeSection = 'overview' }) {
  const dockRef = useRef(null);

  const handlePointerMove = useCallback((e) => {
    const dock = dockRef.current;
    if (!dock) return;

    const rect = dock.getBoundingClientRect();
    const cursorX = e.clientX;
    const cursorY = e.clientY;

    // Center of dock
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Specular angle & brightness
    const dx = cursorX - centerX;
    const dy = cursorY - centerY;
    const angle = Math.atan2(dy, dx);
    const distFromCenter = Math.hypot(dx, dy);
    const maxDist = rect.width / 2 + 60;
    const bright = Math.min(1, Math.max(0, 1 - distFromCenter / maxDist));

    dock.style.setProperty('--spec-angle', `${angle}rad`);
    dock.style.setProperty('--spec-bright', bright.toFixed(2));

    // Magnify nearest items
    const items = dock.querySelectorAll('.dock-item');
    items.forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenterX = itemRect.left + itemRect.width / 2;
      const itemCenterY = itemRect.top + itemRect.height / 2;
      const itemDist = Math.hypot(cursorX - itemCenterX, cursorY - itemCenterY);

      if (itemDist < 85) {
        item.setAttribute('data-near', 'true');
        const scale = 1 + (1 - itemDist / 85) * 0.14;
        item.style.transform = `scale(${scale})`;
      } else {
        item.removeAttribute('data-near');
        item.style.transform = 'scale(1)';
      }
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    const dock = dockRef.current;
    if (!dock) return;

    dock.style.setProperty('--spec-bright', '0');
    const items = dock.querySelectorAll('.dock-item');
    items.forEach((item) => {
      item.removeAttribute('data-near');
      item.style.transform = 'scale(1)';
    });
  }, []);

  return (
    <div className="dock-wrap">
      <nav
        ref={dockRef}
        className="dock"
        data-spec="true"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {/* Dock Brand Tile */}
        <button
          className="dock-item dock-mark"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Aura Pro"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
          </svg>
        </button>

        {/* Navigation items */}
        <button
          className={`dock-item ${activeSection === 'overview' ? 'is-active' : ''}`}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span className="glyph">
            <svg viewBox="0 0 24 24">
              <path d="M4 12h16M12 4v16" />
            </svg>
          </span>
          <span>AURA PRO</span>
        </button>

        <button
          className={`dock-item ${activeSection === 'architecture' ? 'is-active' : ''}`}
          onClick={() => onSectionClick('architecture')}
        >
          <span className="glyph">
            <svg viewBox="0 0 24 24">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </span>
          <span>ARCHITECTURE</span>
        </button>

        <button
          className={`dock-item ${activeSection === 'sound-lab' ? 'is-active' : ''}`}
          onClick={() => onSectionClick('sound-lab')}
        >
          <span className="glyph">
            <svg viewBox="0 0 24 24">
              <path d="M2 12h3l2-6 4 12 4-12 2 6h5" />
            </svg>
          </span>
          <span>SOUND LAB</span>
        </button>

        <button
          className={`dock-item ${activeSection === 'color-studio' ? 'is-active' : ''}`}
          onClick={() => onSectionClick('color-studio')}
        >
          <span className="glyph">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a10 10 0 0 1 0 20z" />
            </svg>
          </span>
          <span>FINISHES</span>
        </button>

        <button
          className={`dock-item ${activeSection === 'specifications' ? 'is-active' : ''}`}
          onClick={() => onSectionClick('specifications')}
        >
          <span className="glyph">
            <svg viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <line x1="9" y1="9" x2="15" y2="15" />
              <line x1="15" y1="9" x2="9" y2="15" />
            </svg>
          </span>
          <span>SPECS</span>
        </button>

        {/* Pre-Order Action Button */}
        <button
          className="dock-item dock-item--enter"
          onClick={onPreOrderClick}
        >
          <span className="glyph">
            <svg viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </span>
          <span>ORDER • $349</span>
        </button>
      </nav>
    </div>
  );
}
