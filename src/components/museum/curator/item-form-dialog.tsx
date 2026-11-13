'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { ImagePicker } from './image-picker';

export type Gallery = 'pd1' | 'pd2' | 'kolonial';

export interface CuratorRow {
  id: string;
  title: string;
  year?: string;
  period?: string;
  description: string;
  image?: string;
  tag?: string;
  side?: 'left' | 'right';
  highlights?: string[];
  location?: string | null;
  source?: string | null;
  gallery?: Gallery;
}

export type EditorKind = 'artifact' | 'event' | 'era';

const KIND_LABEL: Record<EditorKind, string> = {
  artifact: 'Artefak',
  event: 'Peristiwa Lini Masa',
  era: 'Narasi Ruang 3',
};

const GALLERY_LABEL: Record<Gallery, string> = {
  pd1: 'Ruang 1 — Perang Dunia I',
  pd2: 'Ruang 2 — Perang Dunia II',
  kolonial: 'Ruang 3 — Kolonialisme dan Perjuangan Indonesia',
};

const COLLECTION: Record<EditorKind, string> = {
  artifact: 'artifacts',
  event: 'events',
  era: 'eras',
};

interface ItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: EditorKind;
  gallery?: Gallery;
  /** Item yang sedang diedit; null berarti tambah baru. */
  editing: CuratorRow | null;
  onSaved: () => void;
}

/** Formulir tambah/ubah item museum sesuai jenisnya. */
export function ItemFormDialog({
  open,
  onOpenChange,
  kind,
  gallery,
  editing,
  onSaved,
}: ItemFormDialogProps) {
  const isEdit = !!editing;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Artefak
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [tag, setTag] = useState('');
  const [location, setLocation] = useState('');
  const [source, setSource] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  // Event
  const [side, setSide] = useState<'left' | 'right'>('left');
  // Era
  const [period, setPeriod] = useState('');
  const [highlightsText, setHighlightsText] = useState('');

  const resetForm = () => {
    setError('');
    setTitle(editing?.title ?? '');
    setYear(editing?.year ?? '');
    setTag(editing?.tag ?? '');
    setLocation(editing?.location ?? '');
    setSource(editing?.source ?? '');
    setDescription(editing?.description ?? '');
    setImage(editing?.image ?? '');
    setSide(editing?.side ?? 'left');
    setPeriod(editing?.period ?? '');
    setHighlightsText((editing?.highlights ?? []).join('\n'));
  };

  const endpoint = useMemo(() => `/api/museum/${COLLECTION[kind]}`, [kind]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      resetForm();
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const body: Record<string, unknown> =
      kind === 'artifact'
        ? {
            gallery: gallery ?? editing?.gallery ?? 'pd1',
            title: title.trim(),
            year: year.trim(),
            tag: tag.trim(),
            description: description.trim(),
            image,
            location: location.trim() || undefined,
            source: source.trim() || undefined,
          }
        : kind === 'event'
          ? { gallery: gallery ?? editing?.gallery ?? 'pd1', year: year.trim(), title: title.trim(), description: description.trim(), side }
          : {
              period: period.trim(),
              title: title.trim(),
              description: description.trim(),
              image,
              highlights: highlightsText
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean),
            };

    // Validasi ringan di sisi klien
    const missing: string[] = [];
    if (!title.trim()) missing.push('judul');
    if (!description.trim()) missing.push('deskripsi');
    if (kind === 'artifact' && !year.trim()) missing.push('periode artefak');
    if (kind === 'artifact' && !image) missing.push('gambar');
    if (kind === 'event' && !year.trim()) missing.push('tahun/waktu');
    if (kind === 'era' && (!period.trim() || !image)) missing.push('periode/gambar');
    if (missing.length) {
      setError(`Lengkapi: ${missing.join(', ')}.`);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(isEdit ? `${endpoint}/${editing!.id}` : endpoint, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Gagal menyimpan perubahan.');
      }
      onSaved();
      handleOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan perubahan.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto border-zinc-700 bg-zinc-950 text-zinc-100 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Ubah' : 'Tambah'} {KIND_LABEL[kind]}
          </DialogTitle>
          <DialogDescription>
            {kind === 'era'
              ? 'Perubahan langsung tampil di Ruang 3 — Kolonialisme dan Perjuangan Indonesia.'
              : `Perubahan langsung tampil di ${GALLERY_LABEL[gallery ?? editing?.gallery ?? 'pd1']}.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(kind === 'artifact' || kind === 'event') && (
            <div className="space-y-1.5">
              <Label htmlFor="f-year" className="text-zinc-300">
                {kind === 'artifact' ? 'Periode artefak *' : 'Tahun / waktu *'}
              </Label>
              <Input
                id="f-year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder={kind === 'artifact' ? 'cth: September 1916' : 'cth: 6 Juni 1944'}
                className="border-zinc-700 bg-zinc-900 text-zinc-100"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="f-title" className="text-zinc-300">
              {kind === 'era' ? 'Nama narasi *' : 'Judul *'}
            </Label>
            <Input
              id="f-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="cth: Proklamasi Kemerdekaan"
              className="border-zinc-700 bg-zinc-900 text-zinc-100"
            />
          </div>

          {kind === 'artifact' && (
            <div className="space-y-1.5">
              <Label htmlFor="f-tag" className="text-zinc-300">
                Kategori *
              </Label>
              <Input
                id="f-tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="cth: Teknologi Perang"
                className="border-zinc-700 bg-zinc-900 text-zinc-100"
              />
            </div>
          )}

          {kind === 'artifact' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="f-location" className="text-zinc-300">
                  Lokasi
                </Label>
                <Input
                  id="f-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="cth: Front Barat, Prancis (tulis 'perkiraan' bila tidak pasti)"
                  className="border-zinc-700 bg-zinc-900 text-zinc-100"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="f-source" className="text-zinc-300">
                  Rujukan sumber
                </Label>
                <Input
                  id="f-source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="cth: Imperial War Museums (IWM)"
                  className="border-zinc-700 bg-zinc-900 text-zinc-100"
                />
              </div>
            </div>
          )}

          {kind === 'event' && (
            <div className="space-y-1.5">
              <Label className="text-zinc-300">Posisi kartu di lini masa</Label>
              <Select value={side} onValueChange={(v) => setSide(v === 'right' ? 'right' : 'left')}>
                <SelectTrigger className="border-zinc-700 bg-zinc-900 text-zinc-100" aria-label="Posisi kartu">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Kiri</SelectItem>
                  <SelectItem value="right">Kanan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {kind === 'era' && (
            <div className="space-y-1.5">
              <Label htmlFor="f-period" className="text-zinc-300">
                Rentang waktu narasi *
              </Label>
              <Input
                id="f-period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="cth: 1945 – 1949"
                className="border-zinc-700 bg-zinc-900 text-zinc-100"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="f-desc" className="text-zinc-300">
              Deskripsi *
            </Label>
            <Textarea
              id="f-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Ceritakan peristiwa atau artefak ini..."
              className="border-zinc-700 bg-zinc-900 text-zinc-100"
            />
          </div>

          {kind === 'era' && (
            <div className="space-y-1.5">
              <Label htmlFor="f-highlights" className="text-zinc-300">
                Poin penting (satu per baris)
              </Label>
              <Textarea
                id="f-highlights"
                value={highlightsText}
                onChange={(e) => setHighlightsText(e.target.value)}
                rows={3}
                placeholder={'Proklamasi 17 Agustus 1945\nPeristiwa Rengasdengklok'}
                className="border-zinc-700 bg-zinc-900 text-zinc-100"
              />
            </div>
          )}

          {(kind === 'artifact' || kind === 'era') && (
            <div className="space-y-1.5">
              <Label className="text-zinc-300">Gambar *</Label>
              <ImagePicker value={image} onChange={setImage} />
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800"
            >
              Batal
            </Button>
            <Button type="submit" disabled={saving} className="bg-amber-500 text-zinc-950 hover:bg-amber-400">
              {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" aria-hidden />}
              {isEdit ? 'Simpan Perubahan' : 'Tambahkan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
