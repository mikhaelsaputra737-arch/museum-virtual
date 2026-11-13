'use client';

import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import type { TimelineEvent } from '@/data/museum';
import { cn } from '@/lib/utils';

interface Timeline3DProps {
  events: TimelineEvent[];
}

/**
 * Timeline3D — lini masa vertikal dengan kartu yang muncul dari kedalaman
 * (rotateY + translateZ) saat digulir, bergantian kiri-kanan pada layar lebar.
 */
export function Timeline3D({ events }: Timeline3DProps) {
  return (
    <div className="relative mx-auto max-w-5xl">
      {/* Garis tengah */}
      <div
        aria-hidden
        className="absolute top-0 bottom-0 left-4 w-px bg-gradient-to-b from-transparent via-amber-500/50 to-transparent md:left-1/2"
      />

      <ol className="space-y-10 md:space-y-14">
        {events.map((ev, i) => (
          <li key={`${ev.year}-${ev.title}`} className="relative">
            <motion.div
              initial={{ opacity: 0, y: 36, rotateY: ev.side === 'left' ? 10 : -10, transformPerspective: 900 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className={cn(
                'relative ml-12 md:ml-0 md:w-[calc(50%-2.5rem)]',
                ev.side === 'left' ? 'md:mr-auto' : 'md:ml-auto',
              )}
            >
              {/* Simpul tahun */}
              <span
                aria-hidden
                className={cn(
                  'absolute top-6 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-amber-400 bg-zinc-950 shadow-[0_0_16px_rgba(245,158,11,0.6)]',
                  'left-[-2.15rem] md:left-auto',
                  ev.side === 'left' ? 'md:-right-[2.65rem]' : 'md:-left-[2.65rem]',
                )}
              />
              <article
                className={cn(
                  'group rounded-xl border border-zinc-700/70 bg-zinc-900/70 p-5 shadow-xl shadow-black/40 backdrop-blur transition-all duration-300 sm:p-6',
                  'hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-[0_20px_60px_-15px_rgba(245,158,11,0.25)]',
                  '[transform-style:preserve-3d]',
                )}
              >
                <div className="flex items-center gap-2 [transform:translateZ(30px)]">
                  <History className="h-4 w-4 shrink-0 text-amber-400" aria-hidden />
                  <p className="text-xs font-bold tracking-widest text-amber-300 uppercase">{ev.year}</p>
                </div>
                <h4 className="mt-2 text-lg font-bold text-zinc-50">{ev.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{ev.description}</p>
              </article>
            </motion.div>
          </li>
        ))}
      </ol>
    </div>
  );
}
