'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import type { Era } from '@/data/museum';
import { TiltCard } from './tilt-card';
import { cn } from '@/lib/utils';

/**
 * EraShowcase — paparan kronologis sejarah panjang Indonesia.
 * Setiap era tampil bergantian dengan panel foto ber-proyeksi 3D.
 */
export function EraShowcase({ eras }: { eras: Era[] }) {
  return (
    <div className="mx-auto max-w-6xl space-y-20 md:space-y-28">
      {eras.map((era, i) => {
        const reversed = i % 2 === 1;
        return (
          <motion.article
            key={era.id}
            id={`era-${era.id}`}
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75 }}
            className="grid items-center gap-8 md:grid-cols-2 md:gap-12"
          >
            {/* Panel foto 3D */}
            <div className={cn('relative', reversed && 'md:order-2')}>
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-amber-500/15 via-transparent to-red-500/10 blur-2xl" aria-hidden />
              <TiltCard maxTilt={7} className="rounded-2xl">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-700/70 shadow-2xl shadow-black/60">
                  <Image
                    src={era.image}
                    alt={era.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 rounded-md bg-zinc-950/75 px-2.5 py-1 text-[11px] font-bold tracking-widest text-amber-300 uppercase backdrop-blur">
                    Narasi {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="absolute right-3 bottom-3 rounded-md bg-zinc-950/75 px-3 py-1 text-xs font-semibold text-zinc-200 backdrop-blur">
                    {era.period}
                  </div>
                </div>
              </TiltCard>
            </div>

            {/* Narasi era */}
            <div className={cn(reversed && 'md:order-1')}>
              <p className="text-xs font-bold tracking-[0.3em] text-amber-400 uppercase">
                {era.period}
              </p>
              <h3 className="mt-2 text-2xl font-bold text-zinc-50 sm:text-3xl">{era.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
                {era.description}
              </p>
              <ul className="mt-5 space-y-2">
                {era.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
