'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Image as ImageIcon, Landmark } from 'lucide-react';
import { LOBBY_HALLS } from '@/data/museum';
import { TiltCard } from './tilt-card';

/**
 * MuseumLobby — "peta besar isi museum" (4 ruang pamer) berupa kartu
 * portal 3D. Setiap kartu memuat pokok bahasan dan objek visual yang disarankan.
 */
export function MuseumLobby() {
  return (
    <section id="lobi" className="scroll-mt-24 bg-zinc-950 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.3em] text-amber-400 uppercase">
            <Landmark className="h-4 w-4" aria-hidden />
            Lobi Museum
          </p>
          <h2 className="text-3xl font-bold text-zinc-50 sm:text-4xl">Peta Besar Isi Museum</h2>
          <p className="mt-4 text-zinc-400 sm:text-lg">
            Empat ruang pamer menanti. Arahkan kursor ke gerbang untuk merasakan kedalaman
            ruangnya, lalu klik untuk memasuki pameran.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:gap-8">
          {LOBBY_HALLS.map((hall, i) => (
            <motion.div
              key={hall.href}
              initial={{ opacity: 0, y: 40, rotateX: -8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              style={{ perspective: '1000px' }}
            >
              <TiltCard maxTilt={8} className="h-full">
                <a
                  href={hall.href}
                  className="group relative block h-80 overflow-hidden rounded-2xl border border-zinc-700/70 shadow-2xl shadow-black/60 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none sm:h-96"
                  aria-label={`Masuk ke ${hall.title}`}
                >
                  <Image
                    src={hall.image}
                    alt={hall.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${hall.accent} to-transparent`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-transparent to-transparent" />

                  {/* Garis cahaya portal */}
                  <div
                    aria-hidden
                    className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />

                  <div className="relative flex h-full flex-col justify-end p-6 [transform:translateZ(40px)]">
                    <span className="mb-3 w-fit rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold tracking-widest text-amber-300 uppercase">
                      {hall.badge}
                    </span>
                    <h3 className="text-xl font-bold text-white sm:text-2xl">{hall.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">{hall.topics}</p>
                    <p className="mt-2 inline-flex items-start gap-1.5 text-xs leading-relaxed text-amber-200/80">
                      <ImageIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                      {hall.visuals}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-amber-300 transition-transform duration-300 group-hover:translate-x-1">
                      Masuki Ruang Pamer <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                </a>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
