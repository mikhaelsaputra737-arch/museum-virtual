import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireCurator } from '@/lib/curator-auth';

export const dynamic = 'force-dynamic';

const GALLERY_VALUES = ['pd1', 'pd2', 'kolonial'] as const;

const ARTIFACT_UPDATE = z.object({
  gallery: z.enum(GALLERY_VALUES).optional(),
  title: z.string().trim().min(1).optional(),
  year: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  image: z.string().trim().min(1).optional(),
  tag: z.string().trim().min(1).optional(),
  location: z.string().trim().max(200).nullable().optional(),
  source: z.string().trim().max(200).nullable().optional(),
});

const EVENT_UPDATE = z.object({
  gallery: z.enum(GALLERY_VALUES).optional(),
  year: z.string().trim().min(1).optional(),
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  side: z.enum(['left', 'right']).optional(),
});

const ERA_UPDATE = z.object({
  period: z.string().trim().min(1).optional(),
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  image: z.string().trim().min(1).optional(),
  highlights: z.array(z.string().trim().min(1)).optional(),
});

/** Skema permintaan pindah urutan. */
const MOVE = z.object({
  action: z.literal('move'),
  direction: z.enum(['up', 'down']),
});

type Collection = 'artifacts' | 'events' | 'eras';

function isCollection(v: string): v is Collection {
  return v === 'artifacts' || v === 'events' || v === 'eras';
}

/** PATCH /api/museum/[collection]/[id] — ubah item atau pindahkan urutan. */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> },
) {
  const denied = requireCurator(req);
  if (denied) return denied;

  const { collection, id } = await params;
  if (!isCollection(collection)) {
    return NextResponse.json({ error: 'Koleksi tidak dikenal.' }, { status: 404 });
  }

  try {
    const body = await req.json();

    // ---- Pindah urutan ----
    const move = MOVE.safeParse(body);
    if (move.success) {
      const dir = move.data.direction;
      if (collection === 'artifacts') {
        const current = await db.artifact.findUnique({ where: { id } });
        if (!current) return NextResponse.json({ error: 'Item tidak ditemukan.' }, { status: 404 });
        const neighbour = await db.artifact.findFirst({
          where: { gallery: current.gallery, order: dir === 'up' ? { lt: current.order } : { gt: current.order } },
          orderBy: { order: dir === 'up' ? 'desc' : 'asc' },
        });
        if (!neighbour) return NextResponse.json(current);
        const [a] = await db.$transaction([
          db.artifact.update({ where: { id: neighbour.id }, data: { order: current.order } }),
          db.artifact.update({ where: { id: current.id }, data: { order: neighbour.order } }),
        ]);
        return NextResponse.json(a);
      }
      if (collection === 'events') {
        const current = await db.timelineEvent.findUnique({ where: { id } });
        if (!current) return NextResponse.json({ error: 'Item tidak ditemukan.' }, { status: 404 });
        const neighbour = await db.timelineEvent.findFirst({
          where: { gallery: current.gallery, order: dir === 'up' ? { lt: current.order } : { gt: current.order } },
          orderBy: { order: dir === 'up' ? 'desc' : 'asc' },
        });
        if (!neighbour) return NextResponse.json(current);
        const [a] = await db.$transaction([
          db.timelineEvent.update({ where: { id: neighbour.id }, data: { order: current.order } }),
          db.timelineEvent.update({ where: { id: current.id }, data: { order: neighbour.order } }),
        ]);
        return NextResponse.json(a);
      }
      const current = await db.era.findUnique({ where: { id } });
      if (!current) return NextResponse.json({ error: 'Item tidak ditemukan.' }, { status: 404 });
      const neighbour = await db.era.findFirst({
        where: { order: dir === 'up' ? { lt: current.order } : { gt: current.order } },
        orderBy: { order: dir === 'up' ? 'desc' : 'asc' },
      });
      if (!neighbour) return NextResponse.json(current);
      const [a] = await db.$transaction([
        db.era.update({ where: { id: neighbour.id }, data: { order: current.order } }),
        db.era.update({ where: { id: current.id }, data: { order: neighbour.order } }),
      ]);
      return NextResponse.json(a);
    }

    // ---- Ubah isi ----
    if (collection === 'artifacts') {
      const data = ARTIFACT_UPDATE.parse(body);
      const updated = await db.artifact.update({ where: { id }, data });
      return NextResponse.json(updated);
    }
    if (collection === 'events') {
      const data = EVENT_UPDATE.parse(body);
      const updated = await db.timelineEvent.update({ where: { id }, data });
      return NextResponse.json(updated);
    }
    const data = ERA_UPDATE.parse(body);
    const updated = await db.era.update({
      where: { id },
      data: {
        period: data.period,
        title: data.title,
        description: data.description,
        image: data.image,
        ...(data.highlights !== undefined ? { highlights: JSON.stringify(data.highlights) } : {}),
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Data tidak valid.', details: error.issues.map((i) => i.message) },
        { status: 400 },
      );
    }
    console.error(`PATCH /api/museum/${collection}/${id} error:`, error);
    return NextResponse.json({ error: 'Gagal mengubah item.' }, { status: 500 });
  }
}

/** DELETE /api/museum/[collection]/[id] — hapus item. */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> },
) {
  const denied = requireCurator(req);
  if (denied) return denied;

  const { collection, id } = await params;
  if (!isCollection(collection)) {
    return NextResponse.json({ error: 'Koleksi tidak dikenal.' }, { status: 404 });
  }

  try {
    if (collection === 'artifacts') {
      await db.artifact.delete({ where: { id } });
    } else if (collection === 'events') {
      await db.timelineEvent.delete({ where: { id } });
    } else {
      await db.era.delete({ where: { id } });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`DELETE /api/museum/${collection}/${id} error:`, error);
    return NextResponse.json({ error: 'Gagal menghapus item.' }, { status: 500 });
  }
}
