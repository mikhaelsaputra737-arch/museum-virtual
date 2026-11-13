'use client';

import { useEffect, useRef, useState } from 'react';
import type { MotionValue } from 'framer-motion';

interface MuseumMinimapProps {
  /** Posisi avatar pada kanvas desain (px) dan kedalaman (0–1). */
  x: MotionValue<number>;
  depth: MotionValue<number>;
}

function Pin({ x, y, color, label, scale = 1 }: { x: number; y: number; color: string; label: string; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <title>{label}</title>
      <path d="M0 0 C-8 -10 -11 -16 -11 -21 a11 11 0 1 1 22 0 c0 5 -3 11 -11 21z" fill={color} stroke="#fff" strokeWidth={1.6} />
      <circle cx={0} cy={-21} r={4.2} fill="#fff" />
    </g>
  );
}

/** Peta Museum — denah isometrik sederhana dengan penanda posisi pengunjung. */
export function MuseumMinimap({ x, depth }: MuseumMinimapProps) {
  const [open, setOpen] = useState(false);
  const player = useRef<SVGGElement>(null);

  useEffect(() => {
    const draw = () => {
      const px = 116 + ((x.get() - 768) / 1536) * 150;
      const py = 118 - depth.get() * 44;
      player.current?.setAttribute('transform', `translate(${px.toFixed(1)} ${py.toFixed(1)})`);
    };
    draw();
    const offX = x.on('change', draw);
    const offD = depth.on('change', draw);
    return () => {
      offX();
      offD();
    };
  }, [x, depth]);

  return (
    <aside className={`ms-minimap${open ? ' is-open' : ''}`} aria-label="Peta museum">
      <div className="ms-minimap-head">
        <span>Peta Museum</span>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-pressed={open}
          aria-label={open ? 'Perkecil peta museum' : 'Perbesar peta museum'}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {open ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
          </svg>
        </button>
      </div>

      <svg viewBox="0 0 232 168" role="img" aria-label="Denah museum: ruang utama di tengah, Perang Dunia I di kiri, kebudayaan Indonesia di kanan">
        <defs>
          <linearGradient id="ms-map-floor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4b5575" />
            <stop offset="1" stopColor="#2a3250" />
          </linearGradient>
        </defs>
        {/* Bayangan & lantai denah */}
        <g transform="translate(0 7)" fill="#0a0e1f" opacity={0.7}>
          <polygon points="96,20 150,20 160,52 214,66 214,120 160,132 118,150 62,138 14,128 22,76 66,64" />
        </g>
        <g fill="url(#ms-map-floor)" stroke="#8ea2d8" strokeWidth={1} strokeLinejoin="round">
          <polygon points="96,18 150,18 158,50 118,58 80,50" />
          <polygon points="80,50 118,58 118,98 64,90" />
          <polygon points="118,58 158,50 214,64 214,112 118,98" />
          <polygon points="20,74 64,64 80,50 64,90 22,120" />
          <polygon points="64,90 118,98 118,148 60,136 22,120" />
          <polygon points="118,98 214,112 160,130 118,148" />
        </g>
        <g stroke="#0b1022" strokeWidth={2.2} strokeLinecap="round" fill="none" opacity={0.85}>
          <path d="M80 50 L118 58 L158 50" />
          <path d="M118 58 L118 148" />
          <path d="M64 90 L118 98 L214 112" />
        </g>
        <g fill="#f1c36a" opacity={0.9}>
          <rect x={132} y={30} width={10} height={6} rx={1} transform="rotate(-8 137 33)" />
          <rect x={152} y={82} width={14} height={7} rx={1} />
          <rect x={44} y={96} width={14} height={7} rx={1} />
        </g>

        <Pin x={118} y={46} color="#3ab0ff" label="Ruang Utama" />
        <Pin x={34} y={116} color="#ec4899" label="Perang Dunia I" />
        <Pin x={196} y={98} color="#f5a524" label="Kebudayaan Indonesia" />

        <g ref={player}>
          <Pin x={0} y={0} color="#18c8ff" label="Posisi Anda" scale={1.25} />
        </g>
      </svg>
    </aside>
  );
}
