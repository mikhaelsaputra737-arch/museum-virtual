/**
 * SceneShell — cangkang ruangan 3D untuk "Ruang Utama":
 * langit-langit + layar LED, dinding kiri/kanan, aula belakang (globe, patung,
 * pilar), dan lantai mengilap. Semua digambar sebagai SVG pada kanvas desain
 * 1536 × 1024 supaya proporsinya tetap sama di semua ukuran layar.
 */

const FLOOR_RAYS = [-1400, -1000, -700, -450, -250, -100, 60, 200, 340, 480, 620, 760, 900, 1040, 1180, 1320, 1460, 1600, 1760, 1960, 2300, 2700, 3200];
const FLOOR_ROWS = [668, 690, 716, 748, 788, 838, 900, 980, 1080, 1210, 1380];

export function SceneShell() {
  return (
    <svg
      className="ms-shell"
      viewBox="0 0 1536 1024"
      width={1536}
      height={1024}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="ms-ceiling" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#04061a" />
          <stop offset="1" stopColor="#141c40" />
        </linearGradient>
        <linearGradient id="ms-wall-l" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0b1022" />
          <stop offset="1" stopColor="#1a2344" />
        </linearGradient>
        <linearGradient id="ms-wall-r" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1b1a42" />
          <stop offset="1" stopColor="#0b1022" />
        </linearGradient>
        <linearGradient id="ms-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#10193a" />
          <stop offset="1" stopColor="#241f3f" />
        </linearGradient>
        <linearGradient id="ms-floor" gradientUnits="userSpaceOnUse" x1="0" y1="640" x2="0" y2="1100">
          <stop offset="0" stopColor="#1d2547" />
          <stop offset="0.45" stopColor="#2f3761" />
          <stop offset="1" stopColor="#4b5380" />
        </linearGradient>
        <linearGradient id="ms-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a62d6" />
          <stop offset="0.6" stopColor="#6f9be8" />
          <stop offset="1" stopColor="#c7a9d8" />
        </linearGradient>
        <linearGradient id="ms-led" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b78e8" />
          <stop offset="0.55" stopColor="#7ea8ee" />
          <stop offset="1" stopColor="#e3b9c8" />
        </linearGradient>
        <radialGradient id="ms-warm" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffb764" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ffb764" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ms-violet" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#9b6bff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#9b6bff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ms-blue" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#5fb4ff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#5fb4ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ms-globe" cx="0.36" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#3a4f7e" />
          <stop offset="0.55" stopColor="#16223f" />
          <stop offset="1" stopColor="#070b19" />
        </radialGradient>
        <filter id="ms-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="ms-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <clipPath id="ms-floor-clip">
          <polygon points="-800,888 445,655 445,650 955,640 2336,1092 2336,1500 -800,1500" />
        </clipPath>
        <clipPath id="ms-globe-clip">
          <circle cx="735" cy="574" r="78" />
        </clipPath>
        <clipPath id="ms-banner-clip">
          <polygon points="490,106 1033,116 946,300 548,297" />
        </clipPath>
      </defs>

      {/* Dasar gelap */}
      <rect x={-800} y={-400} width={3136} height={1900} fill="#060a18" />

      {/* Langit-langit */}
      <polygon points="-800,-400 2336,-400 2336,-187 955,300 445,318 -800,-304" fill="url(#ms-ceiling)" />

      {/* Balok langit-langit */}
      <g stroke="#0a0f26" strokeWidth={10} opacity={0.9}>
        <line x1={300} y1={-80} x2={470} y2={310} />
        <line x1={1180} y1={-120} x2={940} y2={296} />
        <line x1={-100} y1={20} x2={450} y2={316} />
        <line x1={1536} y1={40} x2={955} y2={298} />
      </g>

      {/* Strip lampu hangat di langit-langit */}
      <g stroke="#ffc46e" strokeWidth={5} strokeLinecap="round" filter="url(#ms-glow)">
        <line x1={190} y1={172} x2={372} y2={160} />
        <line x1={60} y1={118} x2={230} y2={140} opacity={0.7} />
        <line x1={1060} y1={238} x2={1268} y2={178} />
        <line x1={1170} y1={210} x2={1330} y2={168} opacity={0.75} />
        <line x1={555} y1={298} x2={940} y2={300} strokeWidth={3} opacity={0.6} />
      </g>

      {/* Jendela langit + layar LED */}
      <polygon points="498,-80 990,-80 1033,116 490,106" fill="url(#ms-sky)" />
      <g opacity={0.9} fill="#fff">
        <ellipse cx={560} cy={56} rx={56} ry={16} opacity={0.75} />
        <ellipse cx={620} cy={40} rx={42} ry={14} opacity={0.6} />
        <ellipse cx={930} cy={64} rx={64} ry={18} opacity={0.7} />
        <ellipse cx={880} cy={44} rx={40} ry={12} opacity={0.55} />
      </g>
      <polygon points="490,106 1033,116 946,300 548,297" fill="url(#ms-led)" />
      <g clipPath="url(#ms-banner-clip)">
        <path d="M480 262 L560 214 L610 238 L690 190 L770 250 L840 216 L900 252 L960 226 L1040 270 L1040 310 L480 310 Z" fill="#1c3a74" opacity={0.85} />
        <path d="M480 282 L580 246 L650 270 L730 240 L820 278 L900 258 L1000 290 L1000 310 L480 310 Z" fill="#12274f" opacity={0.9} />
        <ellipse cx={600} cy={158} rx={50} ry={13} fill="#fff" opacity={0.55} />
        <ellipse cx={940} cy={150} rx={56} ry={14} fill="#fff" opacity={0.5} />
      </g>
      <polygon points="490,106 1033,116 946,300 548,297" fill="none" stroke="#0a1026" strokeWidth={7} />

      {/* Tulisan LED */}
      <g className="ms-marker" fill="#fff" transform="translate(742 222) rotate(-9)" textAnchor="middle">
        <g transform="translate(-6 -92) scale(1.05)" fill="none" stroke="#fff" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
          <path d="M-20 12 L-24 -12 L-10 0 L0 -16 L10 0 L24 -12 L20 12 Z" />
          <line x1={-20} y1={20} x2={20} y2={20} />
        </g>
        <text x={-4} y={-22} fontSize={46} textLength={196} lengthAdjust="spacingAndGlyphs">MASA LALU</text>
        <text x={6} y={22} fontSize={46} textLength={252} lengthAdjust="spacingAndGlyphs">ADALAH KUNCI</text>
        <text x={14} y={66} fontSize={46} textLength={304} lengthAdjust="spacingAndGlyphs">UNTUK MASA DEPAN</text>
        <path d="M-130 84 C-40 78 60 72 170 64" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>

      {/* Dinding kiri & kanan polos (panel bergambar ada di lapisan depan) */}
      <polygon points="-800,-304 445,318 445,655 -800,888" fill="url(#ms-wall-l)" />
      <polygon points="955,300 2336,-187 2336,1092 955,640" fill="url(#ms-wall-r)" />

      {/* Aula belakang */}
      <polygon points="445,318 955,300 955,640 445,650" fill="url(#ms-back)" />
      <ellipse cx={730} cy={540} rx={260} ry={150} fill="url(#ms-warm)" opacity={0.7} />

      {/* Etalase kecil di aula belakang */}
      <g>
        <rect x={522} y={560} width={60} height={84} fill="#0b1228" stroke="#5f86d8" strokeWidth={2} opacity={0.95} />
        <rect x={528} y={568} width={22} height={28} fill="#c8b28a" opacity={0.8} />
        <rect x={554} y={576} width={20} height={36} fill="#7d6a52" opacity={0.8} />
        <rect x={878} y={556} width={60} height={88} fill="#0b1228" stroke="#5f86d8" strokeWidth={2} opacity={0.95} />
        <rect x={886} y={566} width={42} height={30} fill="#9aa7c4" opacity={0.75} />
        <rect x={890} y={604} width={34} height={28} fill="#7d6a52" opacity={0.8} />
        <rect x={606} y={470} width={30} height={170} fill="#0e1631" opacity={0.7} />
        <rect x={826} y={470} width={30} height={170} fill="#0e1631" opacity={0.7} />
      </g>

      {/* Pilar kiri & kanan */}
      <g>
        <rect x={500} y={304} width={103} height={338} fill="#0a1022" stroke="#1c2750" strokeWidth={2} />
        <rect x={868} y={306} width={80} height={336} fill="#0a1022" stroke="#1c2750" strokeWidth={2} />
        <g className="ms-sign" fill="#e0b86a" textAnchor="middle" fontSize={17}>
          <text x={552} y={388} textLength={56} lengthAdjust="spacingAndGlyphs">KENALI</text>
          <text x={552} y={408} textLength={66} lengthAdjust="spacingAndGlyphs">SEJARAH</text>
          <text x={552} y={432} textLength={58} lengthAdjust="spacingAndGlyphs">HARGAI</text>
          <text x={552} y={452} textLength={90} lengthAdjust="spacingAndGlyphs">PERJUANGAN</text>
          <text x={908} y={394} textLength={58} lengthAdjust="spacingAndGlyphs">BELAJAR</text>
          <text x={908} y={414} textLength={36} lengthAdjust="spacingAndGlyphs">DARI</text>
          <text x={908} y={434} textLength={62} lengthAdjust="spacingAndGlyphs">MASA LALU</text>
          <text x={908} y={456} textLength={46} lengthAdjust="spacingAndGlyphs">UNTUK</text>
          <text x={908} y={476} textLength={66} lengthAdjust="spacingAndGlyphs">MASA DEPAN</text>
        </g>
      </g>

      {/* Papan "Ruang Utama" */}
      <g>
        <rect x={606} y={340} width={250} height={100} rx={3} fill="#0a1128" stroke="#2a3a78" strokeWidth={2} />
        <text className="ms-sign" x={731} y={388} textAnchor="middle" fontSize={30} fill="#f2f5ff" letterSpacing="1">
          RUANG
        </text>
        <text className="ms-sign" x={731} y={416} textAnchor="middle" fontSize={30} fill="#f2f5ff" letterSpacing="1">
          UTAMA
        </text>
        <text x={731} y={433} textAnchor="middle" fontSize={11.5} fill="#c8d2ee" fontFamily="var(--font-geist-sans), system-ui, sans-serif">
          Sejarah · Budaya · Peradaban
        </text>
        <path d="M598 446 Q731 424 864 446" stroke="#ffc46e" strokeWidth={3.5} fill="none" filter="url(#ms-glow)" />
      </g>

      {/* Patung di atas globe */}
      <g fill="#1a1d27" stroke="#3a3f52" strokeWidth={1.2}>
        <rect x={706} y={520} width={58} height={20} rx={3} />
        <path d="M722 474 C720 462 724 452 736 450 C748 452 752 462 750 474 L756 520 L716 520 Z" />
        <circle cx={736} cy={443} r={9} />
        <path d="M750 470 L774 452 L778 458 L756 486 Z" />
        <path d="M716 476 L700 498 L706 504 L724 486 Z" />
        <path d="M722 478 C710 500 708 516 712 522 L744 522 C752 508 756 494 752 478 Z" fill="#242836" opacity={0.7} />
      </g>

      {/* Globe */}
      <circle cx={735} cy={574} r={78} fill="url(#ms-globe)" />
      <g clipPath="url(#ms-globe-clip)">
        <path d="M690 548 C700 526 726 520 748 530 C760 538 752 552 742 560 C732 568 738 584 724 592 C712 588 706 574 696 568 C688 562 686 556 690 548 Z" fill="#c49a62" opacity={0.85} />
        <path d="M742 592 C758 590 768 604 764 624 C760 640 748 650 740 644 C734 634 736 612 742 592 Z" fill="#b98f58" opacity={0.85} />
        <path d="M772 540 C786 536 796 548 790 562 C784 574 770 572 768 560 Z" fill="#a98355" opacity={0.7} />
        <g fill="none" stroke="#7fa2e6" strokeWidth={0.8} opacity={0.35}>
          <ellipse cx={735} cy={574} rx={78} ry={26} />
          <ellipse cx={735} cy={574} rx={78} ry={52} />
          <ellipse cx={735} cy={574} rx={26} ry={78} />
          <ellipse cx={735} cy={574} rx={52} ry={78} />
          <line x1={657} y1={574} x2={813} y2={574} />
        </g>
        <ellipse cx={708} cy={540} rx={30} ry={18} fill="#fff" opacity={0.08} transform="rotate(-25 708 540)" />
      </g>
      <circle cx={735} cy={574} r={78} fill="none" stroke="#5f86d8" strokeWidth={1.5} opacity={0.5} />

      {/* Alas globe bercahaya */}
      <ellipse cx={730} cy={650} rx={112} ry={18} fill="#0a0f22" />
      <ellipse cx={730} cy={642} rx={110} ry={15} fill="none" stroke="#ffd48a" strokeWidth={3} filter="url(#ms-glow)" />
      <ellipse cx={730} cy={656} rx={108} ry={14} fill="none" stroke="#fff3d6" strokeWidth={2} opacity={0.8} />

      {/* Lantai */}
      <polygon points="-800,888 445,655 445,650 955,640 2336,1092 2336,1500 -800,1500" fill="url(#ms-floor)" />
      <g clipPath="url(#ms-floor-clip)">
        <ellipse cx={300} cy={930} rx={520} ry={150} fill="url(#ms-warm)" opacity={0.28} />
        <ellipse cx={1180} cy={800} rx={420} ry={110} fill="url(#ms-violet)" opacity={0.7} />
        <ellipse cx={760} cy={700} rx={380} ry={70} fill="url(#ms-blue)" opacity={0.55} />
        <ellipse cx={730} cy={720} rx={150} ry={36} fill="#ffb764" opacity={0.22} filter="url(#ms-soft)" />
        <g stroke="#9fb4ff" strokeWidth={1} opacity={0.12}>
          {FLOOR_RAYS.map((x) => (
            <line key={x} x1={768} y1={470} x2={x} y2={1500} />
          ))}
          {FLOOR_ROWS.map((y) => (
            <line key={y} x1={-800} y1={y} x2={2336} y2={y} />
          ))}
        </g>
        <polygon points="-300,1020 540,730 640,760 120,1060" fill="#fff" opacity={0.05} />
        <polygon points="940,770 1500,880 1536,960 1100,880" fill="#b79bff" opacity={0.08} />
      </g>

      {/* Garis neon di lantai */}
      <g strokeLinecap="round" fill="none" filter="url(#ms-glow)">
        <path d="M-420 996 L378 757" stroke="#cfeaff" strokeWidth={3.5} />
        <path d="M-420 1010 L378 771" stroke="#6fc3ff" strokeWidth={2} opacity={0.6} />
        <path d="M1128 777 L1292 806" stroke="#ffe3b0" strokeWidth={4} />
        <path d="M955 646 L1262 746" stroke="#8b5cff" strokeWidth={3} opacity={0.8} />
        <path d="M445 656 L-60 750" stroke="#4aa8ff" strokeWidth={3} opacity={0.7} />
      </g>
    </svg>
  );
}
