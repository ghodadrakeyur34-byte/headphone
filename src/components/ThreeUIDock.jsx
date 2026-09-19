import React, { useRef, useEffect, useCallback } from 'react';

export default function ThreeUIDock({ onSectionClick, onPreOrderClick, activeSection = 'overview' }) {
  const dockRef = useRef(null);
  const itemsRef = useRef([]);
  const tickingRef = useRef(false);

  useEffect(() => {
    if (dockRef.current) {
      itemsRef.current = Array.from(dockRef.current.querySelectorAll('.dock-item'));
    }
  }, []);

  const handlePointerMove = useCallback((e) => {
    // Completely disable proximity layout recalculations on touch/mobile devices
    if (e.pointerType === 'touch' || window.innerWidth <= 768) {
      return;
    }
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) {
      return;
    }

    if (tickingRef.current) return;
    tickingRef.current = true;

    const cursorX = e.clientX;
    const cursorY = e.clientY;

    window.requestAnimationFrame(() => {
      const dock = dockRef.current;
      if (!dock) {
        tickingRef.current = false;
        return;
      }

      const rect = dock.getBoundingClientRect();

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
      const items = itemsRef.current.length > 0 ? itemsRef.current : Array.from(dock.querySelectorAll('.dock-item'));
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
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
      }
      tickingRef.current = false;
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    const dock = dockRef.current;
    if (!dock) return;

    dock.style.setProperty('--spec-bright', '0');
    const items = itemsRef.current.length > 0 ? itemsRef.current : Array.from(dock.querySelectorAll('.dock-item'));
    for (let i = 0; i < items.length; i++) {
      items[i].removeAttribute('data-near');
      items[i].style.transform = 'scale(1)';
    }
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
          aria-label="Aura Pro Home"
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
          <span className="dock-item-label">AURA PRO</span>
        </button>

        <button
          className={`dock-item ${activeSection === 'architecture' ? 'is-active' : ''}`}
          onClick={() => onSectionClick('architecture')}
        >
          <span className="glyph">
            <svg viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          </span>
          <span className="dock-item-label">ARCHITECTURE</span>
        </button>

        <button
          className={`dock-item ${activeSection === 'sound-lab' ? 'is-active' : ''}`}
          onClick={() => onSectionClick('sound-lab')}
        >
          <span className="glyph">
            <svg viewBox="0 0 24 24">
              <path d="M2 12h3l3-9 4 18 3-9h4" />
            </svg>
          </span>
          <span className="dock-item-label">SOUND LAB</span>
        </button>

        <button
          className={`dock-item ${activeSection === 'color-studio' ? 'is-active' : ''}`}
          onClick={() => onSectionClick('color-studio')}
        >
          <span className="glyph">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3a9 9 0 0 1 9 9" />
            </svg>
          </span>
          <span className="dock-item-label">FINISHES</span>
        </button>

        <button
          className={`dock-item ${activeSection === 'specifications' ? 'is-active' : ''}`}
          onClick={() => onSectionClick('specifications')}
        >
          <span className="glyph">
            <svg viewBox="0 0 24 24">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="14" y2="12" />
              <line x1="4" y1="18" x2="18" y2="18" />
            </svg>
          </span>
          <span className="dock-item-label">SPECS</span>
        </button>

        {/* CTA Enter Button */}
        <button
          className="dock-item dock-item--enter"
          onClick={onPreOrderClick}
        >
          <span className="glyph">
            <svg viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </span>
          <span className="dock-item-label">ORDER • $349</span>
        </button>
      </nav>
    </div>
  );
}
