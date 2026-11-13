'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { BookMarked, House, Landmark, Lightbulb, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MuseumDockProps {
  onOpenCurator: () => void;
}

type DockKey = 'beranda' | 'pameran' | 'koleksi' | 'kuis';

/** Urutan section dari atas ke bawah → item dok yang menyala. `null` = tidak ada item. */
const SECTIONS: { id: string; key: DockKey | null }[] = [
  { id: 'beranda', key: 'beranda' },
  { id: 'lobi', key: 'pameran' },
  { id: 'ruang-pd1', key: 'koleksi' },
  { id: 'ruang-pd2', key: 'koleksi' },
  { id: 'ruang-indonesia', key: 'koleksi' },
  { id: 'refleksi', key: 'kuis' },
  { id: 'sumber', key: null },
];

const LINKS: { key: DockKey; href: string; label: string; icon: ReactNode }[] = [
  { key: 'beranda', href: '#beranda', label: 'Beranda', icon: <House className="h-6 w-6" aria-hidden /> },
  { key: 'pameran', href: '#lobi', label: 'Pameran', icon: <Landmark className="h-6 w-6" aria-hidden /> },
  { key: 'koleksi', href: '#ruang-pd1', label: 'Koleksi', icon: <BookMarked className="h-6 w-6" aria-hidden /> },
  { key: 'kuis', href: '#refleksi', label: 'Kuis', icon: <Lightbulb className="h-6 w-6" aria-hidden /> },
];

/** Dok navigasi mengambang di dasar layar (Beranda · Pameran · Koleksi · Kuis · Profil). */
export function MuseumDock({ onOpenCurator }: MuseumDockProps) {
  const [active, setActive] = useState<DockKey | null>('beranda');

  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.4;
      let current: DockKey | null = 'beranda';
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) current = s.key;
      }
      setActive(current);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <nav className="ms-dock" aria-label="Navigasi museum">
      {LINKS.map((l) => (
        <a
          key={l.key}
          href={l.href}
          className={cn('ms-dock-item', active === l.key && 'is-active')}
          aria-current={active === l.key ? 'true' : undefined}
        >
          <span className="ms-dock-icon">{l.icon}</span>
          {l.label}
        </a>
      ))}
      <button type="button" className="ms-dock-item" onClick={onOpenCurator} aria-label="Profil: buka Mode Kurator">
        <span className="ms-dock-icon">
          <UserRound className="h-6 w-6" aria-hidden />
        </span>
        Profil
      </button>
    </nav>
  );
}
