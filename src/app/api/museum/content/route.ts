import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

/** GET /api/museum/content — seluruh konten museum terkelompok. */
export async function GET() {
  try {
    const [artifacts, events, eras] = await Promise.all([
      db.artifact.findMany({ orderBy: [{ gallery: 'asc' }, { order: 'asc' }] }),
      db.timelineEvent.findMany({ orderBy: [{ gallery: 'asc' }, { order: 'asc' }] }),
      db.era.findMany({ orderBy: { order: 'asc' } }),
    ]);

    return NextResponse.json({
      artifacts: {
        pd1: artifacts.filter((a) => a.gallery === 'pd1'),
        pd2: artifacts.filter((a) => a.gallery === 'pd2'),
        kolonial: artifacts.filter((a) => a.gallery === 'kolonial'),
      },
      events: {
        pd1: events.filter((e) => e.gallery === 'pd1'),
        pd2: events.filter((e) => e.gallery === 'pd2'),
        kolonial: events.filter((e) => e.gallery === 'kolonial'),
      },
      eras,
    });
  } catch (error) {
    console.error('GET /api/museum/content error:', error);
    return NextResponse.json(
      { error: 'Gagal memuat konten museum.' },
      { status: 500 },
    );
  }
}
