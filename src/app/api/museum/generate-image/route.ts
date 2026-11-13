import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import ZAI from 'z-ai-web-dev-sdk';
import { requireCurator } from '@/lib/curator-auth';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const GEN_SCHEMA = z.object({
  prompt: z.string().trim().min(3, 'Prompt minimal 3 karakter').max(600),
  orientation: z.enum(['square', 'landscape', 'portrait']).default('square'),
});

const SIZE_MAP = {
  square: '1024x1024',
  landscape: '1344x768',
  portrait: '768x1344',
} as const satisfies Record<'square' | 'landscape' | 'portrait', '1024x1024' | '1344x768' | '768x1344'>;

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'museum', 'generated');

/**
 * POST /api/museum/generate-image
 * Membuat gambar artefak baru dengan AI dan menyimpannya ke /public/museum/generated.
 */
export async function POST(req: NextRequest) {
  const denied = requireCurator(req);
  if (denied) return denied;

  try {
    const body = await req.json();
    const { prompt, orientation } = GEN_SCHEMA.parse(body);

    const zai = await ZAI.create();
    let lastError = '';
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await zai.images.generations.create({
          prompt: `${prompt}, museum artifact exhibit quality, detailed`,
          size: SIZE_MAP[orientation],
        });
        const base64 = res?.data?.[0]?.base64;
        if (!base64) throw new Error('Respons gambar kosong');

        if (!fs.existsSync(OUTPUT_DIR)) {
          fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }
        const fileName = `ai-${Date.now()}.png`;
        fs.writeFileSync(path.join(OUTPUT_DIR, fileName), Buffer.from(base64, 'base64'));

        return NextResponse.json({ url: `/museum/generated/${fileName}` }, { status: 201 });
      } catch (e) {
        lastError = e instanceof Error ? e.message : String(e);
        console.error(`generate-image attempt ${attempt} failed:`, lastError);
        await new Promise((r) => setTimeout(r, 1200 * attempt));
      }
    }

    return NextResponse.json(
      { error: 'Gagal membuat gambar. Coba lagi dengan prompt berbeda.' },
      { status: 502 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Permintaan tidak valid.', details: error.issues.map((i) => i.message) },
        { status: 400 },
      );
    }
    console.error('POST /api/museum/generate-image error:', error);
    return NextResponse.json({ error: 'Gagal membuat gambar.' }, { status: 500 });
  }
}
