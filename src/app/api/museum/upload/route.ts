import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import { requireCurator } from '@/lib/curator-auth';

export const dynamic = 'force-dynamic';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'museum', 'uploads');
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const EXT_BY_MIME: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

/** Cek magic bytes sederhana agar berkas benar-benar gambar, bukan sekadar nama berekstensi gambar. */
function looksLikeImage(b: Buffer): boolean {
  if (b.length < 12) return false;
  const ascii4 = b.subarray(0, 4).toString('ascii');
  const ascii8to12 = b.subarray(8, 12).toString('ascii');
  return (
    (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) || // PNG
    (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) || // JPEG
    ascii4 === 'GIF8' || // GIF87a/GIF89a
    (ascii4 === 'RIFF' && ascii8to12 === 'WEBP') // WEBP
  );
}

/**
 * POST /api/museum/upload
 * Menerima berkas gambar dari komputer kurator (multipart/form-data, field "file"),
 * memvalidasinya, lalu menyimpannya ke /public/museum/uploads.
 * Mengembalikan { url } yang dapat langsung dipakai sebagai path gambar konten museum.
 */
export async function POST(req: NextRequest) {
  const denied = requireCurator(req);
  if (denied) return denied;

  try {
    const form = await req.formData();
    const file = form.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Berkas gambar tidak ditemukan.' }, { status: 400 });
    }

    const ext = EXT_BY_MIME[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: 'Format tidak didukung. Gunakan PNG, JPG, WEBP, atau GIF.' },
        { status: 415 },
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Ukuran berkas terlalu besar. Maksimal 5 MB.' },
        { status: 413 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!looksLikeImage(buffer)) {
      return NextResponse.json({ error: 'Berkas bukan gambar yang valid.' }, { status: 415 });
    }

    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const fileName = `upload-${Date.now()}-${randomBytes(3).toString('hex')}.${ext}`;
    fs.writeFileSync(path.join(OUTPUT_DIR, fileName), buffer);

    return NextResponse.json({ url: `/museum/uploads/${fileName}` }, { status: 201 });
  } catch (error) {
    console.error('POST /api/museum/upload error:', error);
    return NextResponse.json({ error: 'Gagal mengunggah gambar.' }, { status: 500 });
  }
}
