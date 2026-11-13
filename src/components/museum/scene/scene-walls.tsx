import type { ReactNode } from 'react';

/** Maskot busana sederhana untuk etalase budaya. */
function Mannequin({
  x,
  y,
  scale = 1,
  dress,
  trim,
  hat,
}: {
  x: number;
  y: number;
  scale?: number;
  dress: string;
  trim: string;
  hat?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {hat && <path d="M-9 -4 L0 -16 L9 -4 Z" fill={hat} />}
      <circle cx={0} cy={0} r={7} fill="#d9b48f" />
      <rect x={-2.5} y={6} width={5} height={6} fill="#d9b48f" />
      <path d="M-11 12 L11 12 L18 74 L-18 74 Z" fill={dress} />
      <path d="M-11 12 L-18 46 L-12 48 L-6 24 Z" fill={dress} />
      <path d="M11 12 L18 46 L12 48 L6 24 Z" fill={dress} />
      <rect x={-11} y={30} width={22} height={4} fill={trim} />
      <path d="M-18 74 L18 74 L18 78 L-18 78 Z" fill={trim} />
    </g>
  );
}

function Helmet({ x, y, color, s = 1 }: { x: number; y: number; color: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-22 0 A22 19 0 0 1 22 0 Z" fill={color} />
      <path d="M-26 1 L26 1 L22 6 L-22 6 Z" fill="#111827" opacity={0.7} />
      <ellipse cx={-6} cy={-9} rx={9} ry={4} fill="#fff" opacity={0.18} />
    </g>
  );
}

/** Etalase pamer bergaya museum modern dengan tepi neon. */
export function SceneVitrines() {
  return (
    <svg className="ms-vitrines" viewBox="0 0 1536 1024" width={1536} height={1024} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="ms-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9fc4ff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#9fc4ff" stopOpacity="0.04" />
        </linearGradient>
        <filter id="ms-neon" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Etalase kiri: helm & perlengkapan perang */}
      <g>
        <polygon points="70,700 270,694 270,742 70,752" fill="#161b2c" />
        <polygon points="70,700 270,694 330,640 126,642" fill="url(#ms-glass)" stroke="#8fb4ff" strokeWidth={1.5} />
        <polygon points="126,642 330,640 330,692 270,694" fill="#0c1124" opacity={0.55} />
        <polygon points="70,700 126,642 126,700" fill="#8fb4ff" opacity={0.08} />
        <Helmet x={140} y={664} color="#3d4636" s={1.05} />
        <Helmet x={222} y={668} color="#7a6a46" s={0.9} />
        <rect x={262} y={672} width={44} height={9} rx={2} fill="#55503e" />
        <rect x={110} y={684} width={34} height={7} rx={2} fill="#3a3a30" />
        <path d="M70 752 L270 742" stroke="#44c8ff" strokeWidth={2.5} filter="url(#ms-neon)" />
      </g>
      <g>
        <polygon points="318,600 392,598 392,664 318,666" fill="url(#ms-glass)" stroke="#8fb4ff" strokeWidth={1.5} />
        <rect x={326} y={640} width={58} height={16} fill="#1c1f2b" />
        <path d="M334 640 L342 618 L366 616 L372 640 Z" fill="#41424c" />
        <circle cx={352} cy={650} r={7} fill="#2a2d38" />
        <circle cx={372} cy={650} r={7} fill="#2a2d38" />
      </g>

      {/* Etalase kanan: busana tradisional */}
      <g>
        <polygon points="982,528 1106,516 1106,690 982,702" fill="url(#ms-glass)" stroke="#a98bff" strokeWidth={2} filter="url(#ms-neon)" />
        <polygon points="982,690 1106,678 1106,690 982,702" fill="#2b1f55" />
        <Mannequin x={1012} y={580} scale={0.95} dress="#b8322e" trim="#f0c36a" hat="#7a1f1c" />
        <Mannequin x={1062} y={578} scale={0.95} dress="#d8423b" trim="#fff1d0" />
      </g>
      <g>
        <polygon points="1108,514 1196,508 1196,682 1108,690" fill="url(#ms-glass)" stroke="#a98bff" strokeWidth={2} filter="url(#ms-neon)" />
        <Mannequin x={1152} y={572} scale={0.98} dress="#14161e" trim="#d9a441" />
      </g>
      <g>
        <polygon points="1200,520 1300,510 1300,676 1200,684" fill="url(#ms-glass)" stroke="#a98bff" strokeWidth={2} filter="url(#ms-neon)" />
        <Mannequin x={1252} y={572} scale={0.96} dress="#b98a3a" trim="#5b3a12" hat="#8a5a1e" />
      </g>
      <path d="M960 648 L1262 744" stroke="#9b6bff" strokeWidth={3.5} filter="url(#ms-neon)" opacity={0.9} />

      {/* Tanaman hias */}
      <g>
        <path d="M1226 700 C1210 650 1224 616 1252 600 C1250 640 1262 664 1280 690 Z" fill="#1c6b3a" />
        <path d="M1260 706 C1248 664 1270 628 1304 620 C1296 660 1308 684 1316 710 Z" fill="#2a8a4a" />
        <path d="M1236 710 C1214 676 1196 668 1176 672 C1190 696 1210 706 1236 710 Z" fill="#15552f" />
        <rect x={1218} y={704} width={104} height={38} rx={4} fill="#10142a" stroke="#27305a" strokeWidth={2} />
      </g>
    </svg>
  );
}

interface WallLinkProps {
  href: string;
  label: string;
  children: ReactNode;
}

function EnterButton({ href, label, children }: WallLinkProps) {
  return (
    <a className="ms-enter" href={href} aria-label={label}>
      {children}
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </a>
  );
}

/** Dua dinding pamer bergambar (diproyeksikan perspektif lewat matrix3d). */
export function SceneWallPanels() {
  return (
    <>
      {/* Dinding kiri — Perang Dunia I */}
      <section className="ms-wall ms-wall-left" aria-label="Perang Dunia I, 1914 sampai 1918">
        <img src="/museum/ww1-trench.png" alt="" decoding="async" />
        <div className="ms-wall-shade" />
        <div className="ms-wall-copy">
          <h2 className="ms-wall-title">
            PERANG
            <br />
            DUNIA I
          </h2>
          <p className="ms-year">1914 - 1918</p>
          <p className="ms-wall-text">
            Sebuah perang besar yang mengubah dunia. Jelajahi kisah, fakta, dan dampaknya di sini.
          </p>
          <EnterButton href="#ruang-pd1" label="Masuk ke ruang Perang Dunia I">
            Masuk
          </EnterButton>
        </div>
      </section>

      {/* Dinding kanan — Kebudayaan Indonesia */}
      <section className="ms-wall ms-wall-right" aria-label="Kebudayaan Indonesia">
        <img src="/museum/id-majapahit.png" alt="" decoding="async" />
        <div className="ms-wall-shade" />
        <div className="ms-wall-copy">
          <h2 className="ms-wall-title">
            KEBUDAYAAN
            <br />
            INDONESIA
          </h2>
          <p className="ms-tagline">Ragam Budaya, Satu Bangsa</p>
          <EnterButton href="#ruang-indonesia" label="Masuk ke ruang Kolonialisme dan Perjuangan Indonesia">
            Masuk
          </EnterButton>
        </div>
      </section>
    </>
  );
}

const GALLERY_ITEMS = [
  {
    href: '#lobi',
    label: 'Peta Sejarah',
    icon: <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14" />,
  },
  {
    href: '#sumber',
    label: 'Arsip Digital',
    icon: (
      <>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v4h4M9 12h6M9 16h6" />
      </>
    ),
  },
  {
    href: '#refleksi',
    label: 'Kuis & Tantangan',
    icon: (
      <>
        <path d="M6 9h12a4 4 0 0 1 4 4v1a3 3 0 0 1-5 2l-1.5-2h-7L7 16a3 3 0 0 1-5-2v-1a4 4 0 0 1 4-4z" />
        <path d="M8 11v4M6 13h4M16 12h.01M18 14h.01" />
      </>
    ),
  },
  {
    href: '#ruang-pd2',
    label: 'Video Edukasi',
    icon: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M10 9l5 3-5 3z" />
      </>
    ),
  },
];

/** Panel kaca melayang "Galeri Interaktif". */
export function SceneGallery() {
  return (
    <nav className="ms-gallery" aria-label="Galeri interaktif">
      <p className="ms-gallery-title">GALERI INTERAKTIF</p>
      <ul>
        {GALLERY_ITEMS.map((it) => (
          <li key={it.label}>
            <a href={it.href}>
              <span className="ms-gallery-icon">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {it.icon}
                </svg>
              </span>
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
