import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireCurator } from '@/lib/curator-auth';

export const dynamic = 'force-dynamic';

export const GALLERY_VALUES = ['pd1', 'pd2', 'kolonial'] as const;

export const ARTIFACT_CREATE = z.object({
  gallery: z.enum(GALLERY_VALUES),
  title: z.string().trim().min(1, 'Judul wajib diisi'),
  year: z.string().trim().min(1, 'Periode wajib diisi'),
  description: z.string().trim().min(1, 'Deskripsi wajib diisi'),
  image: z.string().trim().min(1, 'Gambar wajib dipilih'),
  tag: z.string().trim().min(1, 'Kategori wajib diisi'),
  location: z.string().trim().max(200).optional(),
  source: z.string().trim().max(200).optional(),
});

export const EVENT_CREATE = z.object({
  gallery: z.enum(GALLERY_VALUES),
  year: z.string().trim().min(1, 'Tahun/waktu wajib diisi'),
  title: z.string().trim().min(1, 'Judul wajib diisi'),
  description: z.string().trim().min(1, 'Deskripsi wajib diisi'),
  side: z.enum(['left', 'right']).default('left'),
});

export const ERA_CREATE = z.object({
  period: z.string().trim().min(1, 'Periode wajib diisi'),
  title: z.string().trim().min(1, 'Judul wajib diisi'),
  description: z.string().trim().min(1, 'Deskripsi wajib diisi'),
  image: z.string().trim().min(1, 'Gambar wajib dipilih'),
  highlights: z.array(z.string().trim().min(1)).default([]),
});

type Collection = 'artifacts' | 'events' | 'eras';

function isCollection(v: string): v is Collection {
  return v === 'artifacts' || v === 'events' || v === 'eras';
}

/** POST /api/museum/[collection] — tambah item baru. */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ collection: string }> },
) {
  const denied = requireCurator(req);
  if (denied) return denied;

  const { collection } = await params;
  if (!isCollection(collection)) {
    return NextResponse.json({ error: 'Koleksi tidak dikenal.' }, { status: 404 });
  }

  try {
    const body = await req.json();

    if (collection === 'artifacts') {
      const data = ARTIFACT_CREATE.parse(body);
      const last = await db.artifact.findFirst({
        where: { gallery: data.gallery },
        orderBy: { order: 'desc' },
      });
      const created = await db.artifact.create({ data: { ...data, order: (last?.order ?? -1) + 1 } });
      return NextResponse.json(created, { status: 201 });
    }

    if (collection === 'events') {
      const data = EVENT_CREATE.parse(body);
      const last = await db.timelineEvent.findFirst({
        where: { gallery: data.gallery },
        orderBy: { order: 'desc' },
      });
      const created = await db.timelineEvent.create({
        data: { ...data, order: (last?.order ?? -1) + 1 },
      });
      return NextResponse.json(created, { status: 201 });
    }

    // eras
    const data = ERA_CREATE.parse(body);
    const last = await db.era.findFirst({ orderBy: { order: 'desc' } });
    const created = await db.era.create({
      data: {
        period: data.period,
        title: data.title,
        description: data.description,
        image: data.image,
        highlights: JSON.stringify(data.highlights),
        order: (last?.order ?? -1) + 1,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Data tidak valid.', details: error.issues.map((i) => i.message) },
        { status: 400 },
      );
    }
    console.error(`POST /api/museum/${collection} error:`, error);
    return NextResponse.json({ error: 'Gagal menambahkan item.' }, { status: 500 });
  }
}
