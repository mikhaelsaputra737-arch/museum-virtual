'use client';

import { useState } from 'react';
import {
  REFLECTION_QUESTIONS,
  REFLEKSI_INTRO,
  WW1_CAUSES,
  WW1_INTRO,
  WW2_CAUSES,
  WW2_INTRO,
  WW2_PANELS,
} from '@/data/museum';
import { useMuseumContent } from '@/hooks/use-museum-content';
import { MuseumNavbar } from '@/components/museum/museum-navbar';
import { MuseumHero, type TourRoom } from '@/components/museum/museum-hero';
import { CuratorPanel } from '@/components/museum/curator/curator-panel';

export default function Page() {
  const { models, usingDb, refresh } = useMuseumContent();
  const [curatorOpen, setCuratorOpen] = useState(false);
  const rooms: TourRoom[] = [
    {
      id: 'ruang-pd1',
      title: 'Perang Dunia I',
      subtitle: '1914–1918 · The Great War',
      intro: WW1_INTRO,
      image: '/museum/ww1-trench.png',
      highlights: WW1_CAUSES.map((cause) => `${cause.term}: ${cause.description}`),
      artifacts: models.artifacts.pd1,
      events: models.events.pd1,
      theme: {
        accent: '#67e8f9',
        soft: 'rgba(34, 211, 238, 0.18)',
        glow: 'rgba(34, 211, 238, 0.26)',
        panel: 'linear-gradient(120deg, rgba(34, 211, 238, 0.18), rgba(15, 23, 42, 0.06), rgba(59, 130, 246, 0.12))',
      },
    },
    {
      id: 'ruang-pd2',
      title: 'Perang Dunia II',
      subtitle: '1939–1945 · Eropa dan Asia-Pasifik',
      intro: WW2_INTRO,
      image: '/museum/ww2-europe.png',
      highlights: [
        ...WW2_CAUSES.map((cause) => `${cause.term}: ${cause.description}`),
        ...WW2_PANELS.map((panel) => `${panel.title}: ${panel.text}`),
      ],
      artifacts: models.artifacts.pd2,
      events: models.events.pd2,
      theme: {
        accent: '#fca5a5',
        soft: 'rgba(248, 113, 113, 0.18)',
        glow: 'rgba(248, 113, 113, 0.28)',
        panel: 'linear-gradient(120deg, rgba(248, 113, 113, 0.18), rgba(69, 10, 10, 0.08), rgba(239, 68, 68, 0.14))',
      },
    },
    {
      id: 'ruang-indonesia',
      title: 'Kolonialisme dan Perjuangan Indonesia',
      subtitle: 'Perjalanan panjang menuju kemerdekaan',
      intro:
        'Jelajahi perubahan kekuasaan, kehidupan masyarakat, perlawanan, dan perjuangan menuju kemerdekaan Indonesia.',
      image: '/museum/id-proklamasi.png',
      highlights: models.topics.map(
        (topic) => `${topic.period} — ${topic.title}: ${topic.description}`,
      ),
      artifacts: models.artifacts.kolonial,
      events: models.events.kolonial,
      theme: {
        accent: '#86efac',
        soft: 'rgba(34, 197, 94, 0.16)',
        glow: 'rgba(34, 197, 94, 0.22)',
        panel: 'linear-gradient(120deg, rgba(34, 197, 94, 0.16), rgba(20, 83, 45, 0.08), rgba(16, 185, 129, 0.12))',
      },
    },
    {
      id: 'refleksi',
      title: 'Refleksi',
      subtitle: 'Sejarah, ingatan, dan perdamaian',
      intro: REFLEKSI_INTRO,
      image: '/museum/refleksi-damai.png',
      highlights: REFLECTION_QUESTIONS,
      artifacts: [],
      events: [],
      theme: {
        accent: '#c4b5fd',
        soft: 'rgba(168, 85, 247, 0.14)',
        glow: 'rgba(168, 85, 247, 0.2)',
        panel: 'linear-gradient(120deg, rgba(168, 85, 247, 0.16), rgba(39, 39, 42, 0.08), rgba(139, 92, 246, 0.12))',
      },
    },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden bg-zinc-950">
      <MuseumNavbar onOpenCurator={() => setCuratorOpen(true)} />
      <MuseumHero rooms={rooms} />

      {/* Mode Kurator — kelola seluruh konten museum */}
      <CuratorPanel
        open={curatorOpen}
        onOpenChange={setCuratorOpen}
        models={models}
        usingDb={usingDb}
        onDataChanged={() => void refresh()}
      />
    </div>
  );
}
