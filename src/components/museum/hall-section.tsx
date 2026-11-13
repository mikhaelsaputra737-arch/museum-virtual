'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  BookMarked,
  Flag,
  Globe,
  Handshake,
  Landmark,
  Lightbulb,
  MapPin,
  Scale,
  ShieldAlert,
  Swords,
  Users,
} from 'lucide-react';
import type { Artifact, CauseItem, CasualtyNote, ExhibitPanel, TimelineEvent } from '@/data/museum';
import { Carousel3D } from './carousel-3d';
import { Timeline3D } from './timeline-3d';
import { ArtifactDialog } from './artifact-dialog';
import { cn } from '@/lib/utils';

const CAUSE_ICONS = [Flag, Globe, Swords, Handshake, AlertTriangle];

const IMPACT_ICONS = [Landmark, MapPin, Scale, Users, BookMarked, ShieldAlert];

interface HallSectionProps {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  intro: string;
  artifacts: Artifact[];
  events: TimelineEvent[];
  image: string;
  tint?: string;
  /** Judul blok sebab/latar (mis. "Mengapa perang terjadi?"). */
  causesTitle?: string;
  causes?: CauseItem[];
  /** Paragraf "perang dan kehidupan manusia". */
  lifeText?: string;
  casualty?: CasualtyNote;
  impacts?: string[];
  /** Panel khusus (mis. Holocaust) — disajikan hormat tanpa gambar grafis. */
  panels?: ExhibitPanel[];
  /** Ide infografis untuk layar museum. */
  ideas?: string[];
}

/**
 * HallSection — satu ruang pameran utuh sesuai naskah: pengantar, sebab/latar,
 * panel korban, panggung proyeksi 3D artefak, panel khusus, lini masa, dampak.
 */
export function HallSection({
  id,
  index,
  title,
  subtitle,
  intro,
  artifacts,
  events,
  image,
  tint,
  causesTitle,
  causes,
  lifeText,
  casualty,
  impacts,
  panels,
  ideas,
}: HallSectionProps) {
  const [selected, setSelected] = useState<Artifact | null>(null);

  return (
    <section id={id} className={cn('relative scroll-mt-20 overflow-hidden bg-zinc-950 py-20 sm:py-28', tint)}>
      {/* Citra ruangan samar sebagai latar */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950" />
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
            Ruang Pamer {index}
          </p>
          <h2 className="mt-3 text-3xl font-black text-zinc-50 sm:text-5xl">{title}</h2>
          <p className="mt-2 text-sm font-semibold text-amber-200/90 sm:text-base">{subtitle}</p>
          <p className="mt-5 leading-relaxed text-zinc-400 sm:text-lg">{intro}</p>
        </motion.div>

        {/* Sebab / latar belakang + panel korban */}
        {(causes || casualty) && (
          <div className="mt-14 grid gap-6 lg:grid-cols-5">
            {causes && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7 }}
                className="lg:col-span-3"
              >
                <h3 className="text-xl font-bold text-zinc-100 sm:text-2xl">{causesTitle}</h3>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {causes.map((c, i) => {
                    const Icon = CAUSE_ICONS[i % CAUSE_ICONS.length];
                    return (
                      <li
                        key={c.term}
                        className="flex items-start gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4 transition-colors hover:border-amber-500/30"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-300">
                          <Icon className="h-4.5 w-4.5" aria-hidden />
                        </span>
                        <div>
                          <p className="text-sm font-bold text-zinc-100">{c.term}</p>
                          <p className="mt-0.5 text-sm leading-relaxed text-zinc-400">{c.description}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {lifeText && (
                  <div className="mt-4 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5">
                    <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">{lifeText}</p>
                  </div>
                )}
              </motion.div>
            )}

            {casualty && (
              <motion.aside
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="lg:col-span-2"
                aria-label={`Perkiraan korban ${title}`}
              >
                <div className="sticky top-24 rounded-2xl border border-red-500/25 bg-gradient-to-b from-red-950/40 to-zinc-900/60 p-6 sm:p-8">
                  <Users className="h-7 w-7 text-red-300" aria-hidden />
                  <p className="mt-4 text-4xl font-black text-red-200 sm:text-5xl">{casualty.value}</p>
                  <p className="mt-1 text-sm font-semibold tracking-wide text-red-300/90 uppercase">
                    {casualty.label}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-400">{casualty.note}</p>
                  <p className="mt-4 border-t border-zinc-800 pt-3 text-xs text-zinc-500">
                    Catatan metodologis: angka merupakan perkiraan umum, bukan hitungan final.
                  </p>
                </div>
              </motion.aside>
            )}
          </div>
        )}

        {/* Panggung proyeksi 3D */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8 }}
          className="mt-16 rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-4 shadow-2xl shadow-black/50 backdrop-blur sm:p-8"
        >
          <Carousel3D artifacts={artifacts} accentLabel={title} onSelect={setSelected} />
        </motion.div>

        {/* Panel khusus (Holocaust, Indonesia di bawah pendudukan) */}
        {panels && panels.length > 0 && (
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {panels.map((panel, i) => (
              <motion.article
                key={panel.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50"
              >
                <div className="relative h-44 sm:h-52">
                  <Image
                    src={panel.image}
                    alt={`Panel: ${panel.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                  <h3 className="absolute bottom-4 left-5 right-5 text-lg font-bold text-zinc-50 sm:text-xl">
                    {panel.title}
                  </h3>
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">{panel.text}</p>
                  <p className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-amber-300/90">
                    <BookMarked className="h-3.5 w-3.5" aria-hidden />
                    Sumber: {panel.source}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Lini masa */}
        <div className="mt-20 sm:mt-28">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center text-2xl font-bold text-zinc-100 sm:text-3xl"
          >
            Lini Masa <span className="text-amber-400">{title.replace('Perang ', '')}</span>
          </motion.h3>
          <Timeline3D events={events} />
        </div>

        {/* Dampak */}
        {impacts && impacts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="mt-20"
          >
            <h3 className="text-xl font-bold text-zinc-100 sm:text-2xl">
              {title.includes('Dunia') ? 'Dampak utama' : 'Dampak dan warisan'}
            </h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {impacts.map((impact, i) => {
                const Icon = IMPACT_ICONS[i % IMPACT_ICONS.length];
                return (
                  <li
                    key={impact}
                    className="flex items-start gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4 transition-colors hover:border-amber-500/30"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300">
                      <Icon className="h-4.5 w-4.5" aria-hidden />
                    </span>
                    <p className="text-sm leading-relaxed text-zinc-300">{impact}</p>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}

        {/* Ide infografis untuk layar museum */}
        {ideas && ideas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="mt-10 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-6 sm:p-8"
          >
            <h3 className="inline-flex items-center gap-2 text-base font-bold text-amber-200 sm:text-lg">
              <Lightbulb className="h-5 w-5 text-amber-400" aria-hidden />
              Ide infografis untuk layar museum
            </h3>
            <ul className="mt-4 grid gap-2.5 text-sm text-zinc-300 sm:grid-cols-2">
              {ideas.map((idea) => (
                <li key={idea} className="flex items-start gap-2.5 leading-relaxed">
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400/80" />
                  {idea}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>

      <ArtifactDialog artifact={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
