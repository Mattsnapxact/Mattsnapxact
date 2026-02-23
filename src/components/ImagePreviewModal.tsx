"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface ImagePreviewModalProps {
  src: string;
  alt?: string;
  onClose: () => void;
}

export default function ImagePreviewModal({
  src,
  alt = "Image preview",
  onClose,
}: ImagePreviewModalProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const lastTouchDistance = useRef<number | null>(null);
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null);
  const isDragging = useRef(false);
  const lastDragPos = useRef<{ x: number; y: number } | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll while modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const resetTransform = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  // Double-tap to zoom/reset
  const lastTap = useRef(0);
  const handleTap = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      const now = Date.now();
      if (now - lastTap.current < 300) {
        // Double tap
        if (scale > 1) {
          resetTransform();
        } else {
          setScale(2.5);
        }
      }
      lastTap.current = now;
    },
    [scale, resetTransform]
  );

  // Pinch-to-zoom touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDistance.current = Math.hypot(dx, dy);
      lastTouchCenter.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
    } else if (e.touches.length === 1) {
      isDragging.current = true;
      lastDragPos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2 && lastTouchDistance.current !== null) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.hypot(dx, dy);
        const ratio = distance / lastTouchDistance.current;

        setScale((prev) => Math.min(Math.max(prev * ratio, 1), 5));
        lastTouchDistance.current = distance;
      } else if (e.touches.length === 1 && isDragging.current && scale > 1) {
        e.preventDefault();
        const currentPos = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        if (lastDragPos.current) {
          const dx = currentPos.x - lastDragPos.current.x;
          const dy = currentPos.y - lastDragPos.current.y;
          setTranslate((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
        }
        lastDragPos.current = currentPos;
      }
    },
    [scale]
  );

  const handleTouchEnd = useCallback(() => {
    lastTouchDistance.current = null;
    lastTouchCenter.current = null;
    isDragging.current = false;
    lastDragPos.current = null;
    // Snap back to 1x if zoomed out below threshold
    setScale((prev) => (prev < 1.1 ? 1 : prev));
    if (scale <= 1.1) {
      setTranslate({ x: 0, y: 0 });
    }
  }, [scale]);

  // Mouse wheel zoom for desktop
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => {
      const next = prev * delta;
      if (next < 1.05) {
        setTranslate({ x: 0, y: 0 });
        return 1;
      }
      return Math.min(next, 5);
    });
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close preview"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Zoom hint */}
      {scale === 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/50 text-xs select-none pointer-events-none">
          Pinch or scroll to zoom &middot; Double-tap to enlarge
        </div>
      )}

      {/* Image container */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        onClick={handleTap}
        style={{ touchAction: "none" }}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain select-none"
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            transition: isDragging.current ? "none" : "transform 0.15s ease-out",
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}
