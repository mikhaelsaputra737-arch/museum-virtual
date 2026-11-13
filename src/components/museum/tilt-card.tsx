'use client';

import { useRef, useState, type ReactNode, type PointerEvent } from 'react';
import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees */
  maxTilt?: number;
  /** Perspective value in px */
  perspective?: number;
  /** Extra scale while hovering */
  scale?: number;
  glare?: boolean;
}

/**
 * TiltCard — kartu dengan proyeksi 3D yang mengikuti gerakan kursor.
 * Menggunakan transform-style: preserve-3d agar anak-anaknya ikut bervolume.
 */
export function TiltCard({
  children,
  className,
  maxTilt = 12,
  perspective = 1000,
  scale = 1.02,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<{ rx: number; ry: number; mx: number; my: number; active: boolean }>({
    rx: 0,
    ry: 0,
    mx: 50,
    my: 50,
    active: false,
  });

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setStyle({
      rx: (0.5 - py) * maxTilt * 2,
      ry: (px - 0.5) * maxTilt * 2,
      mx: px * 100,
      my: py * 100,
      active: true,
    });
  };

  const handleLeave = () => setStyle((s) => ({ ...s, rx: 0, ry: 0, active: false }));

  return (
    <div style={{ perspective: `${perspective}px` }} className={cn('group/tilt', className)}>
      <div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className="relative h-full w-full transition-transform duration-200 ease-out will-change-transform [transform-style:preserve-3d]"
        style={{
          transform: `rotateX(${style.rx}deg) rotateY(${style.ry}deg) scale(${style.active ? scale : 1})`,
        }}
      >
        {children}
        {glare && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
            style={{
              opacity: style.active ? 1 : 0,
              background: `radial-gradient(circle at ${style.mx}% ${style.my}%, rgba(255,240,200,0.18) 0%, transparent 55%)`,
            }}
          />
        )}
      </div>
    </div>
  );
}
