'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flag, Info, Quote } from 'lucide-react';
import type { Artifact } from '@/data/museum';
import type { MuseumModels } from '@/hooks/use-museum-content';
import { ID_INTRO, ID_NOTE, PRE_EUROPE_ERAS } from '@/data/museum';
import { Carousel3D } from './carousel-3d';
import { Timeline3D } from './timeline-3d';
import { EraShowcase } from './era-showcase';
import { ArtifactDialog } from './artifact-dialog';

interface IndonesiaHallProps {
  models: MuseumModels;
}

/**
 * IndonesiaHall — Ruang 3: Kolonialisme dan Perjuangan Indonesia.
 * Konteks Nusantara pra-ekspansi Eropa, garis waktu kolonialisme,
 * lima narasi utama, lalu vitrin artefak 3D dan catatan kurator.
 */
export function IndonesiaHall({ models }: IndonesiaHallProps) {
  const [selected, setSelected] = useState<Artifact | null>(null);

  return (
    <section id="ruang-indonesia" className="relative scroll-mt-20 overflow-hidden bg-zinc-950 py-20 sm:py-28">
      {/* Latar bendera merah-putih samar */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.05]">
        <div className="absolute top-0 right-0 left-0 h-1/2 bg-red-600" />
        <div className="absolute right-0 bottom-0 left-0 h-1/2 bg-zinc-200" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Kepala ruangan */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-xs font-bold tracking-[0.4em] text-amber-400 uppercase">
            Ruang Pamer 3
          </p>
          <h2 className="mt-3 text-3xl font-black text-zinc-50 sm:text-5xl">
            Kolonialisme dan Perjuangan Indonesia
          </h2>
          <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-red-400 sm:text-base">
            <Flag className="h-4 w-4" aria-hidden />
            1511 – 1949 · Dari Malaka hingga Pengakuan Kedaulatan
          </p>
          <p className="mt-5 leading-relaxed text-zinc-400 sm:text-lg">{ID_INTRO}</p>
        </motion.div>

        {/* Konteks: Nusantara sebelum dan di awal ekspansi Eropa */}
        <div className="mt-14">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-xl font-bold text-zinc-100 sm:text-2xl"
          >
            Sebelum Ekspansi Eropa — <span className="text-amber-400">Nusantara Sudah Terhubung</span>
          </motion.h3>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {PRE_EUROPE_ERAS.map((era, i) => (
              <motion.article
                key={era.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50"
              >
                <div className="relative h-36">
                  <Image
                    src={era.image}
                    alt={era.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-sm font-bold text-zinc-50">
                    {era.title}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-[11px] font-semibold tracking-widest text-amber-400/90 uppercase">
                    {era.period}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{era.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Garis waktu kolonialisme */}
        <div className="mt-20 sm:mt-28">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center text-2xl font-bold text-zinc-100 sm:text-3xl"
          >
            Garis Waktu <span className="text-amber-400">Kolonialisme</span>
          </motion.h3>
          <Timeline3D events={models.events.kolonial} />
        </div>

        {/* Narasi utama */}
        <div className="mt-20 sm:mt-28">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14 text-center text-2xl font-bold text-zinc-100 sm:text-3xl"
          >
            Lima Narasi <span className="text-amber-400">Ruang 3</span>
          </motion.h3>
          <EraShowcase eras={models.topics} />
        </div>

        {/* Vitrin artefak 3D */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8 }}
          className="mt-24 rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-4 shadow-2xl shadow-black/50 backdrop-blur sm:p-8"
        >
          <Carousel3D artifacts={models.artifacts.kolonial} accentLabel="Ruang 3" onSelect={setSelected} />
        </motion.div>

        {/* Catatan kurator */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-14 max-w-4xl rounded-2xl border border-amber-500/25 bg-gradient-to-b from-amber-500/10 to-transparent p-6 sm:p-8"
        >
          <h3 className="inline-flex items-center gap-2 text-base font-bold text-amber-200 sm:text-lg">
            <Info className="h-5 w-5 text-amber-400" aria-hidden />
            Catatan kurator
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300 sm:text-base">{ID_NOTE}</p>
        </motion.div>

        {/* Penutup ruangan */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-14 max-w-3xl rounded-2xl border border-red-500/25 bg-gradient-to-b from-red-950/30 to-transparent p-8 text-center sm:p-12"
        >
          <Quote className="mx-auto h-8 w-8 text-red-400" aria-hidden />
          <p className="mt-4 text-lg font-semibold text-zinc-100 sm:text-xl">
            &ldquo;Sekali merdeka, tetap merdeka! Selama hidupku pun, aku tetap mengusahakan
            dan mempertahankannya.&rdquo;
          </p>
          <p className="mt-3 text-sm text-zinc-400">
            — Ir. Soekarno, Proklamator Kemerdekaan Republik Indonesia
          </p>
        </motion.div>
      </div>

      <ArtifactDialog artifact={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
