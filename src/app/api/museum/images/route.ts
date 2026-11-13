import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const MUSEUM_DIR = path.join(process.cwd(), 'public', 'museum');

const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];

/** GET /api/museum/images — daftar semua gambar yang tersedia untuk dipilih kurator. */
export async function GET() {
  try {
    const files: string[] = [];

    const scan = (dir: string, prefix: string) => {
      if (!fs.existsSync(dir)) return;
      for (const f of fs.readdirSync(dir)) {
        const lower = f.toLowerCase();
        if (IMAGE_EXTS.some((e) => lower.endsWith(e))) {
          files.push(`${prefix}${f}`);
        }
      }
    };

    scan(MUSEUM_DIR, '/museum/');
    scan(path.join(MUSEUM_DIR, 'uploads'), '/museum/uploads/');
    scan(path.join(MUSEUM_DIR, 'generated'), '/museum/generated/');

    // Urutan: gambar bawaan (abjad) → unggahan kurator terbaru → hasil AI terbaru
    const uploadsPrefix = '/museum/uploads/';
    const builtin = files.filter((f) => !f.includes('/generated/') && !f.includes(uploadsPrefix)).sort();
    const uploads = files.filter((f) => f.includes(uploadsPrefix)).sort();
    const generated = files.filter((f) => f.includes('/generated/')).sort();
    return NextResponse.json({ images: [...builtin, ...uploads.reverse(), ...generated.reverse()] });
  } catch (error) {
    console.error('GET /api/museum/images error:', error);
    return NextResponse.json({ images: [] });
  }
}
