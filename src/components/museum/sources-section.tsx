'use client';

import { motion } from 'framer-motion';
import { AlertCircle, BookOpen, ExternalLink, Library } from 'lucide-react';
import {
  ACADEMIC_BOOKS,
  BIBLIO_NOTE,
  IMAGE_DISCLAIMER,
  MUSEUM_SOURCES,
  SOURCES_INTRO,
} from '@/data/museum';

/**
 * SourcesSection — sumber museum/arsip terpercaya (tautan eksternal),
 * peringatan hak penggunaan gambar, dan bacaan akademik awal.
 */
export function SourcesSection() {
  return (
    <section id="sumber" className="relative scroll-mt-20 bg-zinc-950 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Kepala */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.3em] text-amber-400 uppercase">
            <Library className="h-4 w-4" aria-hidden />
            Referensi Museum
          </p>
          <h2 className="mt-3 text-3xl font-black text-zinc-50 sm:text-5xl">
            Sumber Museum, Arsip, dan Penelitian
          </h2>
          <p className="mt-5 leading-relaxed text-zinc-400 sm:text-lg">{SOURCES_INTRO}</p>
        </motion.div>

        {/* Grid lembaga */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {MUSEUM_SOURCES.map((src, i) => (
            <motion.a
              key={src.name}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors hover:border-amber-500/40 hover:bg-zinc-900"
              aria-label={`Buka situs ${src.name} (tautan eksternal)`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold text-zinc-100 group-hover:text-amber-200">
                  {src.name}
                </h3>
                <ExternalLink
                  className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500 transition-colors group-hover:text-amber-300"
                  aria-hidden
                />
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{src.description}</p>
              <p className="mt-2 truncate text-xs font-medium text-amber-300/70">{src.url}</p>
            </motion.a>
          ))}
        </div>

        {/* Peringatan gambar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-10 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-5"
          role="note"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
          <p className="text-sm leading-relaxed text-amber-100/90">{IMAGE_DISCLAIMER}</p>
        </motion.div>

        {/* Bacaan akademik */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="mt-14"
        >
          <h3 className="inline-flex items-center gap-2 text-xl font-bold text-zinc-100 sm:text-2xl">
            <BookOpen className="h-5 w-5 text-amber-400" aria-hidden />
            Bacaan Akademik Awal
          </h3>
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {ACADEMIC_BOOKS.map((b) => (
              <li
                key={b.title}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-amber-500/30"
              >
                <p className="text-sm text-zinc-200">
                  {b.author}, <span className="font-semibold text-amber-200/90 italic">{b.title}</span>
                </p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">{b.note}</p>
              </li>
            ))}
          </ul>
          <p className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-xs leading-relaxed text-zinc-500">
            {BIBLIO_NOTE}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
