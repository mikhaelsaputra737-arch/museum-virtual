'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Artifact } from '@/data/museum';

interface Carousel3DProps {
  artifacts: Artifact[];
  accentLabel?: string;
  onSelect: (artifact: Artifact) => void;
}

/**
 * Carousel3D — cincin proyeksi 3D yang berputar.
 * Artefak tersusun melingkar di ruang 3D (rotateY + translateZ) dan
 * dapat diputar otomatis, dengan tombol, atau dengan drag/swipe.
 */
export function Carousel3D({ artifacts, accentLabel, onSelect }: Carousel3DProps) {
  const [angle, setAngle] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startAngle: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const count = artifacts.length;
  const step = 360 / count;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Rotasi otomatis
  useEffect(() => {
    if (!playing || hovered) return;
    const id = window.setInterval(() => setAngle((a) => a - step / 2), 2400);
    return () => window.clearInterval(id);
  }, [playing, hovered, step]);

  const activeIndex = ((Math.round(-angle / step) % count) + count) % count;

  const rotate = useCallback((dir: 1 | -1) => setAngle((a) => a - dir * step), [step]);

  // Drag / swipe
  const onPointerDown = (clientX: number) => {
    dragRef.current = { startX: clientX, startAngle: angle };
    setDragging(true);
    setPlaying(false);
  };
  const onPointerMove = (clientX: number) => {
    if (!dragRef.current || !containerRef.current) return;
    const w = containerRef.current.offsetWidth || 1;
    const delta = ((clientX - dragRef.current.startX) / w) * 360 * 0.6;
    setAngle(dragRef.current.startAngle + delta);
  };
  const onPointerUp = () => {
    dragRef.current = null;
    setDragging(false);
    // Snap ke kartu terdekat
    setAngle((a) => Math.round(a / step) * step);
    window.setTimeout(() => setPlaying(true), 4000);
  };

  // Radius menyesuaikan jumlah kartu dan ukuran layar
  const radius = isMobile ? 190 : count <= 4 ? 340 : 420;
  const cardW = isMobile ? 150 : 230;
  const cardH = isMobile ? 210 : 320;

  // Pagar pengaman: bila tidak ada artefak, tampilkan pesan panggung kosong
  if (count === 0) {
    return (
      <div
        className="flex h-72 items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 text-center"
        role="region"
        aria-label="Panggung proyeksi 3D kosong"
      >
        <p className="max-w-sm px-6 text-sm text-zinc-500">
          Vitrin ini masih kosong. Buka <span className="font-semibold text-amber-300">Mode Kurator</span>{' '}
          untuk menambahkan artefak pertama ke galeri ini.
        </p>
      </div>
    );
  }

  const activeArtifact = artifacts[activeIndex] ?? artifacts[0];

  return (
    <div className="relative">
      {/* Deskripsi instrumen */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="flex items-center gap-2 text-sm text-zinc-400">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-amber-400" aria-hidden />
          Ruang proyeksi 3D aktif — arahkan, geser, atau gunakan tombol untuk memutar pameran.
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Putar pameran ke kiri"
            onClick={() => rotate(1)}
            className="h-10 w-10 rounded-full border-zinc-600 bg-zinc-900/70 text-zinc-200 hover:border-amber-400/60 hover:text-amber-300"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label={playing ? 'Jeda rotasi otomatis' : 'Putar rotasi otomatis'}
            onClick={() => setPlaying((p) => !p)}
            className="h-10 w-10 rounded-full border-zinc-600 bg-zinc-900/70 text-zinc-200 hover:border-amber-400/60 hover:text-amber-300"
          >
            {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Putar pameran ke kanan"
            onClick={() => rotate(-1)}
            className="h-10 w-10 rounded-full border-zinc-600 bg-zinc-900/70 text-zinc-200 hover:border-amber-400/60 hover:text-amber-300"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </Button>
        </div>
      </div>

      {/* Panggung 3D */}
      <div
        ref={containerRef}
        className="relative h-[440px] cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing sm:h-[540px]"
        style={{ perspective: '1400px' }}
        onPointerDown={(e) => onPointerDown(e.clientX)}
        onPointerMove={(e) => {
          if (dragRef.current) onPointerMove(e.clientX);
        }}
        onPointerUp={onPointerUp}
        onPointerLeave={() => {
          if (dragRef.current) onPointerUp();
          setHovered(false);
        }}
        onPointerEnter={() => setHovered(true)}
        role="region"
        aria-label={`Cincin proyeksi 3D artefak ${accentLabel ?? ''}`}
      >
        {/* Lingkaran panggung */}
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: radius * 2 + 120,
            height: radius * 2 + 120,
            transform: 'translate(-50%, -50%) perspective(900px) rotateX(72deg)',
            border: '1px dashed rgba(217,119,6,0.35)',
            boxShadow: '0 0 90px rgba(245,158,11,0.08) inset',
          }}
        />

        {/* Cincin kartu */}
        <div
          className="absolute top-1/2 left-1/2 will-change-transform"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translate(-50%, -50%) rotateX(-8deg) rotateY(${angle}deg)`,
            transition: dragging ? 'none' : 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {artifacts.map((art, i) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={art.id}
                className="absolute top-1/2 left-1/2"
                style={{
                  width: cardW,
                  height: cardH,
                  transformStyle: 'preserve-3d',
                  transform: `translate(-50%, -50%) rotateY(${i * step}deg) translateZ(${radius}px)`,
                }}
              >
                <button
                  type="button"
                  onClick={() => onSelect(art)}
                  aria-label={`Buka detail artefak: ${art.title}`}
                  className="group relative block h-full w-full overflow-hidden rounded-xl border transition-all duration-500 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                  style={{
                    borderColor: isActive ? 'rgba(251,191,36,0.8)' : 'rgba(63,63,70,0.9)',
                    boxShadow: isActive
                      ? '0 25px 70px -12px rgba(245,158,11,0.45)'
                      : '0 18px 50px -12px rgba(0,0,0,0.8)',
                    filter: isActive ? 'none' : 'brightness(0.55) saturate(0.8)',
                  }}
                >
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    sizes="230px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 text-left">
                    <p className="text-[10px] font-semibold tracking-widest text-amber-300 uppercase">
                      {art.tag}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs leading-snug font-semibold text-white sm:text-sm">
                      {art.title}
                    </p>
                    <p className="mt-0.5 text-[10px] text-zinc-400">{art.year}</p>
                  </div>
                  <div className="absolute top-2 right-2 rounded-full bg-zinc-950/70 p-1.5 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                    <Maximize2 className="h-3.5 w-3.5 text-amber-300" aria-hidden />
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Kabut bawah panggung */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"
        />
      </div>

      {/* Indikator kartu aktif */}
      <div className="mt-2 flex flex-col items-center gap-2">
        <p className="text-center text-sm text-zinc-400">
          <span className="font-bold text-amber-300">
            {String(activeIndex + 1).padStart(2, '0')}
          </span>{' '}
          <span className="text-zinc-600">/ {String(count).padStart(2, '0')}</span>
          <span className="mx-3 text-zinc-700" aria-hidden>
            ·
          </span>
          <span className="font-medium text-zinc-200">{activeArtifact.title}</span>
        </p>
        <div className="flex gap-1.5" aria-hidden>
          {artifacts.map((a, i) => (
            <span
              key={a.id}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === activeIndex ? 'w-8 bg-amber-400' : 'w-3 bg-zinc-700'
              }`}
            />
          ))}
        </div>
        <Button
          variant="ghost"
          onClick={() => onSelect(artifacts[activeIndex])}
          className="mt-2 text-amber-300 hover:bg-amber-400/10 hover:text-amber-200"
        >
          <Maximize2 className="mr-2 h-4 w-4" aria-hidden />
          Perbesar artefak ini
        </Button>
      </div>
    </div>
  );
}
