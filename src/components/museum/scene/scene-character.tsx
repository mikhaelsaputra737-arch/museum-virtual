/**
 * SceneCharacter — pengunjung (tampak belakang) dengan hoodie, ransel, dan
 * celana kargo. Kaki bergantian naik-turun saat `walking` bernilai true.
 */
export function SceneCharacter({ walking }: { walking: boolean }) {
  return (
    <svg
      className={`ms-avatar${walking ? ' is-walking' : ''}`}
      viewBox="0 0 200 335"
      width={270}
      height={452}
      role="img"
      aria-label="Avatar pengunjung museum"
    >
      <defs>
        <linearGradient id="ms-hood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a90a0" />
          <stop offset="1" stopColor="#585e6e" />
        </linearGradient>
        <linearGradient id="ms-jacket" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1d222e" />
          <stop offset="0.5" stopColor="#141821" />
          <stop offset="1" stopColor="#1f2431" />
        </linearGradient>
      </defs>

      {/* Bayangan kaki */}
      <ellipse className="ms-avatar-shadow" cx={100} cy={326} rx={78} ry={9} fill="#000" opacity={0.45} />

      <g className="ms-avatar-body">
        {/* Kaki */}
        <g className="ms-leg ms-leg-l">
          <path d="M62 212 L98 212 L96 296 L60 296 Z" fill="#14171f" />
          <rect x={64} y={246} width={22} height={20} rx={3} fill="#1b1f2a" stroke="#262b38" />
          <path d="M56 296 L98 296 L100 312 C100 322 92 326 78 326 L54 326 C48 326 48 316 52 310 Z" fill="#f3f4f8" />
          <path d="M52 318 L100 318 L100 326 L52 326 Z" fill="#b9bdc9" />
        </g>
        <g className="ms-leg ms-leg-r">
          <path d="M102 212 L140 212 L142 296 L104 296 Z" fill="#14171f" />
          <rect x={116} y={246} width={22} height={20} rx={3} fill="#1b1f2a" stroke="#262b38" />
          <path d="M102 296 L146 296 L150 310 C154 316 152 326 146 326 L122 326 C108 326 100 322 100 312 Z" fill="#f3f4f8" />
          <path d="M100 318 L150 318 L150 326 L100 326 Z" fill="#b9bdc9" />
        </g>

        {/* Hoodie */}
        <path d="M42 108 C46 94 70 88 100 88 C130 88 154 94 158 108 L164 190 L150 214 L50 214 L36 190 Z" fill="url(#ms-jacket)" />
        <path d="M48 208 L152 208 L152 218 L48 218 Z" fill="#c2c6d2" />
        {/* Lengan */}
        <path d="M44 110 L28 186 L26 206 L44 208 L58 150 Z" fill="#161a24" />
        <path d="M156 110 L172 186 L174 206 L156 208 L142 150 Z" fill="#161a24" />
        <ellipse cx={35} cy={212} rx={10} ry={8} fill="#e5bd98" />
        <ellipse cx={165} cy={212} rx={10} ry={8} fill="#e5bd98" />

        {/* Ransel */}
        <rect x={62} y={104} width={80} height={104} rx={14} fill="#10131b" stroke="#2a3040" strokeWidth={2} />
        <rect x={70} y={112} width={64} height={40} rx={9} fill="#161a25" stroke="#252b3a" />
        <rect x={72} y={168} width={60} height={32} rx={7} fill="#0d1017" stroke="#252b3a" />
        <path d="M102 128 L92 148 L112 148 Z" fill="none" stroke="#f1f4ff" strokeWidth={2.4} strokeLinejoin="round" />
        <path d="M96 140 L108 140" stroke="#f1f4ff" strokeWidth={2} />
        <path d="M62 112 C54 140 56 178 62 196" stroke="#1f2431" strokeWidth={6} fill="none" />
        <path d="M142 112 C150 140 148 178 142 196" stroke="#1f2431" strokeWidth={6} fill="none" />

        {/* Tudung hoodie */}
        <path d="M58 100 C64 82 82 76 100 76 C118 76 136 82 142 100 C130 110 114 112 100 112 C86 112 70 110 58 100 Z" fill="url(#ms-hood)" />
        <path d="M70 98 C82 104 118 104 130 98" stroke="#4a4f5e" strokeWidth={2} fill="none" />

        {/* Kepala & rambut */}
        <rect x={90} y={70} width={20} height={14} rx={5} fill="#e0b48c" />
        <ellipse cx={64} cy={52} rx={7} ry={11} fill="#e5bd98" />
        <ellipse cx={136} cy={52} rx={7} ry={11} fill="#e5bd98" />
        <path
          d="M62 54 C56 26 76 8 100 8 C126 8 146 24 138 54 C138 66 130 74 122 76 L78 76 C70 74 62 66 62 54 Z"
          fill="#0a0a12"
        />
        <path d="M66 28 L74 12 L84 22 L96 6 L108 20 L122 8 L128 24 L142 22 L134 38 C120 26 84 26 66 40 Z" fill="#0a0a12" />
        <path d="M70 40 C88 28 116 28 134 40" stroke="#1d1d2c" strokeWidth={2} fill="none" />
      </g>
    </svg>
  );
}
