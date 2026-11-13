import { Landmark, HeartHandshake } from 'lucide-react';
import { NAV_LINKS } from '@/data/museum';

/** Footer museum — menempel di dasar layar (mt-auto) dan terdorong alami saat konten panjang. */
export function MuseumFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-800 bg-zinc-950 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-32 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-zinc-950">
              <Landmark className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-bold text-zinc-50">Museum Virtual Sejarah</p>
              <p className="text-sm text-zinc-500">
                Perang Dunia I · Perang Dunia II · Kolonialisme dan Perjuangan Indonesia
              </p>
            </div>
          </div>

          <nav aria-label="Navigasi footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-zinc-400 transition-colors hover:text-amber-300"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-zinc-800/70 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} Museum Virtual Sejarah. Dibangun dengan proyeksi 3D
            interaktif untuk pembelajaran sejarah — gambar merupakan ilustrasi rekonstruksi.
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
            <HeartHandshake className="h-3.5 w-3.5 text-amber-400" aria-hidden />
            Mengenang masa lalu untuk memahami masa kini.
          </p>
        </div>
      </div>
    </footer>
  );
}
