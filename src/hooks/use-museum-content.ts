'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ID_TOPICS,
  KOLONIAL_ARTIFACTS,
  KOLONIAL_EVENTS,
  WW1_ARTIFACTS,
  WW1_EVENTS,
  WW2_ARTIFACTS,
  WW2_EVENTS,
  type Artifact,
  type Era,
  type TimelineEvent,
} from '@/data/museum';

export interface MuseumModels {
  artifacts: { pd1: Artifact[]; pd2: Artifact[]; kolonial: Artifact[] };
  events: { pd1: TimelineEvent[]; pd2: TimelineEvent[]; kolonial: TimelineEvent[] };
  /** Narasi utama Ruang 3 (Kolonialisme dan Perjuangan Indonesia). */
  topics: Era[];
}

/** Data statis sebagai cadangan bila database/API tidak tersedia. */
export const FALLBACK_MODELS: MuseumModels = {
  artifacts: { pd1: WW1_ARTIFACTS, pd2: WW2_ARTIFACTS, kolonial: KOLONIAL_ARTIFACTS },
  events: { pd1: WW1_EVENTS, pd2: WW2_EVENTS, kolonial: KOLONIAL_EVENTS },
  topics: ID_TOPICS,
};

function parseHighlights(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((v): v is string => typeof v === 'string');
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
    } catch {
      return [];
    }
  }
  return [];
}

function groupByGallery<T extends { gallery?: string }>(
  rows: T[],
): { pd1: T[]; pd2: T[]; kolonial: T[] } {
  return {
    pd1: rows.filter((r) => r.gallery === 'pd1'),
    pd2: rows.filter((r) => r.gallery === 'pd2'),
    kolonial: rows.filter((r) => r.gallery === 'kolonial'),
  };
}

/** API mengembalikan grup {pd1, pd2, kolonial}; bila bentuknya lain, satukan lalu kelompokkan ulang. */
function extractGroups<T extends { gallery?: string }>(data: unknown): T[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    return Object.values(data as Record<string, T[]>).flat();
  }
  return [];
}

/**
 * useMuseumContent — memuat konten museum dari database via API,
 * dengan fallback ke data statis bila gagal.
 */
export function useMuseumContent() {
  const [models, setModels] = useState<MuseumModels>(FALLBACK_MODELS);
  const [loading, setLoading] = useState(true);
  const [usingDb, setUsingDb] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/museum/content', { cache: 'no-store' });
      if (!res.ok) throw new Error('bad status');
      const data = await res.json();

      const rawArtifacts = extractGroups<Artifact>(data.artifacts);
      const rawEvents = extractGroups<TimelineEvent & { side?: string }>(data.events);

      const artifacts = groupByGallery<Artifact>(rawArtifacts);
      const events = groupByGallery<TimelineEvent & { side?: string }>(rawEvents);

      setModels({
        artifacts: {
          pd1: artifacts.pd1.map((a) => ({ ...a, gallery: 'pd1' })),
          pd2: artifacts.pd2.map((a) => ({ ...a, gallery: 'pd2' })),
          kolonial: artifacts.kolonial.map((a) => ({ ...a, gallery: 'kolonial' })),
        },
        events: {
          pd1: events.pd1.map((e) => ({ ...e, side: e.side === 'right' ? 'right' : 'left' })),
          pd2: events.pd2.map((e) => ({ ...e, side: e.side === 'right' ? 'right' : 'left' })),
          kolonial: events.kolonial.map((e) => ({
            ...e,
            side: e.side === 'right' ? 'right' : 'left',
          })),
        },
        topics: (Array.isArray(data.eras) ? data.eras : []).map(
          (e: Era & { highlights: unknown }) => ({
            ...e,
            highlights: parseHighlights(e.highlights),
          }),
        ),
      });
      setUsingDb(true);
    } catch {
      setUsingDb(false);
      setModels(FALLBACK_MODELS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      await refresh();
      if (cancelled) {
        setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  return { models, loading, usingDb, refresh };
}
