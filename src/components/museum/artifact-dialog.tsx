'use client';

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MapPin } from 'lucide-react';
import { IMAGE_DISCLAIMER, type Artifact } from '@/data/museum';

interface ArtifactDialogProps {
  artifact: Artifact | null;
  onClose: () => void;
}

/** Jendela detail artefak — mengikuti standar objek pamer (judul, tanggal, lokasi, sumber). */
export function ArtifactDialog({ artifact, onClose }: ArtifactDialogProps) {
  return (
    <Dialog open={!!artifact} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-zinc-700 bg-zinc-950 p-0 text-zinc-100 sm:max-w-2xl">
        {artifact && (
          <>
            <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
              <Image
                src={artifact.image}
                alt={artifact.title}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 to-transparent" />
              <span className="absolute bottom-3 left-4 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold tracking-widest text-amber-300 uppercase backdrop-blur">
                {artifact.tag}
              </span>
            </div>
            <div className="p-6 pt-4">
              <DialogHeader className="text-left">
                <DialogTitle className="text-xl font-bold text-white sm:text-2xl">
                  {artifact.title}
                </DialogTitle>
                <DialogDescription className="text-sm font-semibold text-amber-300">
                  Periode: {artifact.year}
                </DialogDescription>
              </DialogHeader>

              {artifact.location && (
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-zinc-400">
                  <MapPin className="h-4 w-4 shrink-0 text-amber-400/80" aria-hidden />
                  Lokasi: {artifact.location}
                </p>
              )}

              <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
                {artifact.description}
              </p>

              <div className="mt-5 space-y-2 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-xs leading-relaxed text-zinc-400">
                {artifact.source && (
                  <p>
                    <span className="font-semibold text-zinc-300">Rujukan konten:</span>{' '}
                    {artifact.source}
                  </p>
                )}
                <p className="text-zinc-500">{IMAGE_DISCLAIMER}</p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
