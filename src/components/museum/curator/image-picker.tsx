'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { HardDriveUpload, ImageIcon, Loader2, Sparkles, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
}

/** Galeri mini untuk memilih gambar artefak: unggahan PC, galeri bawaan, dan generator AI. */
export function ImagePicker({ value, onChange }: ImagePickerProps) {
  const [images, setImages] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [orientation, setOrientation] = useState('square');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        const res = await fetch('/api/museum/images', { cache: 'no-store' });
        const data = await res.json();
        if (!active) return;
        setImages(Array.isArray(data.images) ? data.images : []);
      } catch {
        if (active) setImages([]);
      }
    };

    void run();
    return () => {
      active = false;
    };
  }, []);

  const handleGenerate = async () => {
    if (prompt.trim().length < 3) {
      setError('Tulis deskripsi gambar terlebih dahulu (minimal 3 karakter).');
      return;
    }
    setError('');
    setGenerating(true);
    try {
      const res = await fetch('/api/museum/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), orientation }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal membuat gambar.');
      setImages((prev) => [data.url, ...prev]);
      onChange(data.url);
      setPrompt('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal membuat gambar.');
    } finally {
      setGenerating(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran berkas terlalu besar. Maksimal 5 MB.');
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/museum/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengunggah gambar.');
      setImages((prev) => [data.url, ...prev]);
      onChange(data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Gagal mengunggah gambar.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {/* Pratinjau gambar terpilih */}
      {value && (
        <div className="relative h-28 w-full overflow-hidden rounded-lg border border-zinc-700">
          <Image src={value} alt="Gambar terpilih" fill sizes="400px" className="object-cover" />
        </div>
      )}

      {/* Grid pilihan gambar */}
      <div className="grid max-h-52 grid-cols-4 gap-2 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900/50 p-2 sm:grid-cols-5">
        {images.map((url) => (
          <button
            key={url}
            type="button"
            onClick={() => onChange(url)}
            aria-label={`Pilih gambar ${url}`}
            className={cn(
              'relative aspect-[4/3] overflow-hidden rounded-md border-2 transition-all',
              value === url
                ? 'border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                : 'border-transparent opacity-70 hover:opacity-100',
            )}
          >
            <Image src={url} alt="" fill sizes="120px" className="object-cover" />
          </button>
        ))}
        {images.length === 0 && (
          <p className="col-span-full py-6 text-center text-xs text-zinc-500">
            <ImageIcon className="mx-auto mb-1 h-5 w-5" aria-hidden />
            Memuat galeri gambar...
          </p>
        )}
      </div>

      {/* Unggah gambar dari komputer kurator */}
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
          <Upload className="h-3.5 w-3.5" aria-hidden />
          Unggah gambar dari komputer
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
          aria-label="Pilih berkas gambar dari komputer"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="h-9 w-full border-emerald-500/40 bg-transparent text-xs font-semibold text-emerald-200 hover:bg-emerald-500/10 hover:text-emerald-100"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden />
              Mengunggah...
            </>
          ) : (
            <>
              <HardDriveUpload className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Pilih File dari PC
            </>
          )}
        </Button>
        <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
          PNG, JPG, WEBP, atau GIF · maksimal 5 MB. Gambar tersimpan di galeri museum dan bisa langsung dipakai.
        </p>
        {uploadError && <p className="mt-1 text-xs text-red-400">{uploadError}</p>}
      </div>

      {/* Generator AI */}
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-amber-300">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Buat gambar baru dengan AI
        </p>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Contoh: kapal perang era penjajahan berlayar di laut lepas saat matahari terbenam..."
          rows={2}
          className="border-zinc-700 bg-zinc-900 text-sm text-zinc-100 placeholder:text-zinc-600"
        />
        <div className="mt-2 flex items-center gap-2">
          <Select value={orientation} onValueChange={setOrientation}>
            <SelectTrigger className="h-9 w-36 border-zinc-700 bg-zinc-900 text-xs text-zinc-100" aria-label="Orientasi gambar">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="square">Kotak (1:1)</SelectItem>
              <SelectItem value="landscape">Lanskap (16:9)</SelectItem>
              <SelectItem value="portrait">Potret (9:16)</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="button"
            size="sm"
            onClick={handleGenerate}
            disabled={generating}
            className="h-9 flex-1 bg-amber-500 text-xs font-semibold text-zinc-950 hover:bg-amber-400"
          >
            {generating ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden />
                Membuat gambar... (± 20 dtk)
              </>
            ) : (
              <>
                <Sparkles className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                Generate Gambar
              </>
            )}
          </Button>
        </div>
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </div>
    </div>
  );
}
