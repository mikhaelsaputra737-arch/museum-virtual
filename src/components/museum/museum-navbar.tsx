'use client';

import { useEffect, useState } from 'react';
import { Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MuseumNavbarProps {
  onOpenCurator: () => void;
}

/** Wajah pengunjung kecil untuk chip sapaan. */
function VisitorFace() {
  return (
    <svg viewBox="0 0 48 48" width="46" height="46" aria-hidden="true">
      <circle cx={24} cy={26} r={13} fill="#f0c9a6" />
      <path d="M10 24 C9 10 20 6 26 7 C36 7 40 15 38 25 C34 20 28 17 22 18 C17 19 13 21 10 24 Z" fill="#0b0b14" />
      <circle cx={19} cy={27} r={1.7} fill="#1a1a24" />
      <circle cx={29} cy={27} r={1.7} fill="#1a1a24" />
      <path d="M20 33 Q24 36 28 33" stroke="#9a5b44" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <path d="M8 48 C9 40 16 38 24 38 C32 38 39 40 40 48 Z" fill="#161a26" />
    </svg>
  );
}

/** Bilah atas museum: merek di kiri, sapaan pengunjung di kanan. */
export function MuseumNavbar({ onOpenCurator }: MuseumNavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={cn('ms-top', scrolled && 'is-scrolled')}>
      <a href="#beranda" className="ms-brand" aria-label="Museum Virtual — kembali ke beranda">
        <span className="ms-brand-mark" aria-hidden="true">
          <svg viewBox="0 0 64 64" width="66" height="66" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
            <path d="M8 24 L32 8 L56 24 Z" fill="currentColor" fillOpacity={0.18} />
            <path d="M12 28 H52" />
            <path d="M16 30 V48 M26 30 V48 M38 30 V48 M48 30 V48" strokeWidth={5} />
            <path d="M10 52 H54 M6 58 H58" />
          </svg>
        </span>
        <span>
          <span className="ms-brand-title">MUSEUM VIRTUAL</span>
          <span className="ms-brand-sub">Jelajahi Sejarah, Temukan Makna</span>
        </span>
      </a>

      <div className="ms-top-right">
        <div className="ms-greet">
          <span className="ms-greet-avatar">
            <VisitorFace />
          </span>
          <span className="ms-greet-text">
            <strong>Halo, Pengunjung!</strong>
            Jelajahi · Belajar · Pahami
          </span>
        </div>
        <button
          type="button"
          className="ms-curator"
          onClick={onOpenCurator}
          aria-label="Buka Mode Kurator untuk mengubah konten museum"
          title="Mode Kurator"
        >
          <Wrench className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </header>
  );
}
