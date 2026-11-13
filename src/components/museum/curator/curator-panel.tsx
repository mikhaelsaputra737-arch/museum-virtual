'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ImageOff,
  KeyRound,
  LogOut,
  Pencil,
  Plus,
  RotateCw,
  Trash2,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import type { MuseumModels } from '@/hooks/use-museum-content';
import {
  ItemFormDialog,
  type CuratorRow,
  type EditorKind,
  type Gallery,
} from './item-form-dialog';
import { cn } from '@/lib/utils';

interface CuratorPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  models: MuseumModels;
  usingDb: boolean;
  onDataChanged: () => void;
}

type TabKey = 'pd1' | 'pd2' | 'kolonial' | 'era';
type AuthState = 'checking' | 'unconfigured' | 'signedOut' | 'signedIn' | 'error';

/** Mode Kurator — kelola seluruh isi museum: tambah, ubah, hapus, dan urutkan. */
export function CuratorPanel({ open, onOpenChange, models, usingDb, onDataChanged }: CuratorPanelProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabKey>('pd1');
  const [authState, setAuthState] = useState<AuthState>('checking');
  const [authError, setAuthError] = useState('');
  const [password, setPassword] = useState('');
  const [authBusy, setAuthBusy] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editorKind, setEditorKind] = useState<EditorKind>('artifact');
  const [editorGallery, setEditorGallery] = useState<Gallery>('pd1');
  const [editing, setEditing] = useState<CuratorRow | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ kind: EditorKind; id: string; label: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();
    fetch('/api/museum/auth', { cache: 'no-store', signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error('Status akses kurator tidak dapat dimuat.');
        return (await res.json()) as { enabled: boolean; authenticated: boolean };
      })
      .then((status) => {
        setAuthState(
          !status.enabled ? 'unconfigured' : status.authenticated ? 'signedIn' : 'signedOut',
        );
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === 'AbortError') return;
        setAuthError(error instanceof Error ? error.message : 'Gagal memeriksa akses kurator.');
        setAuthState('error');
      });

    return () => controller.abort();
  }, [open]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthBusy(true);
    setAuthError('');
    try {
      const res = await fetch('/api/museum/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal masuk sebagai kurator.');
      setPassword('');
      setAuthState('signedIn');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Gagal masuk sebagai kurator.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogout = async () => {
    setAuthBusy(true);
    try {
      const res = await fetch('/api/museum/auth', { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal keluar dari Mode Kurator.');
      setAuthState('signedOut');
      setFormOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      toast({
        title: 'Terjadi kesalahan',
        description: error instanceof Error ? error.message : 'Coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setAuthBusy(false);
    }
  };

  const openCreate = (kind: EditorKind, gallery: Gallery) => {
    setEditorKind(kind);
    setEditorGallery(gallery);
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (kind: EditorKind, gallery: Gallery, row: CuratorRow) => {
    setEditorKind(kind);
    setEditorGallery(gallery);
    setEditing(row);
    setFormOpen(true);
  };

  const mutate = useCallback(
    async (fn: () => Promise<Response>, successMsg: string) => {
      setBusy(true);
      try {
        const res = await fn();
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Operasi gagal.');
        }
        toast({ title: successMsg });
        onDataChanged();
        return true;
      } catch (e) {
        toast({
          title: 'Terjadi kesalahan',
          description: e instanceof Error ? e.message : 'Coba lagi.',
          variant: 'destructive',
        });
        return false;
      } finally {
        setBusy(false);
      }
    },
    [onDataChanged, toast],
  );

  const handleDelete = () => {
    if (!deleteTarget) return;
    const collection = deleteTarget.kind === 'artifact' ? 'artifacts' : deleteTarget.kind === 'event' ? 'events' : 'eras';
    void mutate(
      () => fetch(`/api/museum/${collection}/${deleteTarget.id}`, { method: 'DELETE' }),
      `"${deleteTarget.label}" dihapus dari museum.`,
    ).then((ok) => ok && setDeleteTarget(null));
  };

  const handleMove = (kind: EditorKind, id: string, direction: 'up' | 'down') => {
    const collection = kind === 'artifact' ? 'artifacts' : kind === 'event' ? 'events' : 'eras';
    void mutate(
      () =>
        fetch(`/api/museum/${collection}/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'move', direction }),
        }),
      'Urutan diperbarui.',
    );
  };

  const dbBadge = usingDb ? (
    <Badge className="border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20" variant="outline">
      <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" aria-hidden />
      Tersambung database
    </Badge>
  ) : (
    <Badge className="border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20" variant="outline">
      Mode statis (database tidak terjangkau)
    </Badge>
  );

  const actionButtons = (kind: EditorKind, id: string, label: string, first: boolean, last: boolean) => (
    <div className="flex shrink-0 items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Pindah ke atas: ${label}`}
        disabled={busy || first}
        onClick={() => handleMove(kind, id, 'up')}
        className="h-8 w-8 text-zinc-400 hover:bg-zinc-800 hover:text-amber-300"
      >
        <ArrowUp className="h-4 w-4" aria-hidden />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Pindah ke bawah: ${label}`}
        disabled={busy || last}
        onClick={() => handleMove(kind, id, 'down')}
        className="h-8 w-8 text-zinc-400 hover:bg-zinc-800 hover:text-amber-300"
      >
        <ArrowDown className="h-4 w-4" aria-hidden />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Ubah: ${label}`}
        onClick={() => openEdit(kind, activeTab === 'era' ? 'pd1' : activeTab, itemsById[kind][id])}
        className="h-8 w-8 text-zinc-400 hover:bg-zinc-800 hover:text-amber-300"
      >
        <Pencil className="h-4 w-4" aria-hidden />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Hapus: ${label}`}
        disabled={busy}
        onClick={() => setDeleteTarget({ kind, id, label })}
        className="h-8 w-8 text-zinc-400 hover:bg-red-950 hover:text-red-400"
      >
        <Trash2 className="h-4 w-4" aria-hidden />
      </Button>
    </div>
  );

  // Peta item berdasarkan id, untuk membuka form edit
  const itemsById: Record<'artifact' | 'event' | 'era', Record<string, CuratorRow>> = {
    artifact: Object.fromEntries(
      [...models.artifacts.pd1, ...models.artifacts.pd2, ...models.artifacts.kolonial].map(
        (a) => [a.id, a as unknown as CuratorRow],
      ),
    ),
    event: Object.fromEntries(
      [...models.events.pd1, ...models.events.pd2, ...models.events.kolonial].map(
        (e) => [e.id, e as unknown as CuratorRow],
      ),
    ),
    era: Object.fromEntries(models.topics.map((e) => [e.id, e as unknown as CuratorRow])),
  };

  const renderArtifactList = (gallery: Gallery) => {
    const list =
      gallery === 'pd1'
        ? models.artifacts.pd1
        : gallery === 'pd2'
          ? models.artifacts.pd2
          : models.artifacts.kolonial;
    return (
      <div className="space-y-2">
        <Button
          onClick={() => openCreate('artifact', gallery)}
          className="w-full bg-amber-500 font-semibold text-zinc-950 hover:bg-amber-400"
        >
          <Plus className="mr-1.5 h-4 w-4" aria-hidden /> Tambah Artefak Baru
        </Button>
        {list.length === 0 && (
          <p className="rounded-lg border border-dashed border-zinc-700 p-6 text-center text-sm text-zinc-500">
            Belum ada artefak di galeri ini.
          </p>
        )}
        {list.map((a, i) => (
          <div
            key={a.id}
            className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2.5"
          >
            <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md border border-zinc-700">
              {a.image ? (
                <Image src={a.image} alt="" fill sizes="64px" className="object-cover" />
              ) : (
                <ImageOff className="absolute inset-0 m-auto h-5 w-5 text-zinc-600" aria-hidden />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-100">{a.title}</p>
              <p className="truncate text-xs text-zinc-500">
                {a.year} · {a.tag}
              </p>
            </div>
            {actionButtons('artifact', a.id, a.title, i === 0, i === list.length - 1)}
          </div>
        ))}
      </div>
    );
  };

  const renderEventList = (gallery: Gallery) => {
    const list =
      gallery === 'pd1'
        ? models.events.pd1
        : gallery === 'pd2'
          ? models.events.pd2
          : models.events.kolonial;
    return (
      <div className="space-y-2">
        <Button
          onClick={() => openCreate('event', gallery)}
          className="w-full bg-amber-500 font-semibold text-zinc-950 hover:bg-amber-400"
        >
          <Plus className="mr-1.5 h-4 w-4" aria-hidden /> Tambah Peristiwa Baru
        </Button>
        {list.map((e, i) => (
          <div
            key={e.id}
            className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2.5"
          >
            <Badge variant="outline" className="shrink-0 border-amber-500/40 text-amber-300">
              {e.year}
            </Badge>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-100">{e.title}</p>
              <p className="truncate text-xs text-zinc-500">posisi: {e.side === 'right' ? 'kanan' : 'kiri'}</p>
            </div>
            {actionButtons('event', e.id ?? `${e.title}-${i}`, e.title, i === 0, i === list.length - 1)}
          </div>
        ))}
      </div>
    );
  };

  const renderEraList = () => {
    const list = models.topics;
    return (
      <div className="space-y-2">
        <Button
          onClick={() => openCreate('era', 'pd1')}
          className="w-full bg-amber-500 font-semibold text-zinc-950 hover:bg-amber-400"
        >
          <Plus className="mr-1.5 h-4 w-4" aria-hidden /> Tambah Era Baru
        </Button>
        {list.map((e, i) => (
          <div
            key={e.id}
            className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2.5"
          >
            <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md border border-zinc-700">
              {e.image ? (
                <Image src={e.image} alt="" fill sizes="64px" className="object-cover" />
              ) : (
                <ImageOff className="absolute inset-0 m-auto h-5 w-5 text-zinc-600" aria-hidden />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-100">{e.title}</p>
              <p className="truncate text-xs text-zinc-500">{e.period}</p>
            </div>
            {actionButtons('era', e.id, e.title, i === 0, i === list.length - 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setAuthState('checking');
            setAuthError('');
          }
          onOpenChange(nextOpen);
        }}
      >
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 overflow-y-auto border-zinc-800 bg-zinc-950 p-0 text-zinc-100 sm:max-w-md"
        >
          <SheetHeader className="border-b border-zinc-800 bg-zinc-950/95 px-5 pb-4 pt-5">
            <SheetTitle className="flex items-center gap-2 text-lg font-bold">
              Mode Kurator
              {authState === 'signedIn' && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Muat ulang data"
                    onClick={onDataChanged}
                    className="ml-auto h-8 w-8 text-zinc-400 hover:text-amber-300"
                  >
                    <RotateCw className="h-4 w-4" aria-hidden />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Keluar dari Mode Kurator"
                    title="Keluar"
                    disabled={authBusy}
                    onClick={() => void handleLogout()}
                    className="h-8 w-8 text-zinc-400 hover:text-amber-300"
                  >
                    <LogOut className="h-4 w-4" aria-hidden />
                  </Button>
                </>
              )}
            </SheetTitle>
            <SheetDescription className="text-sm text-zinc-400">
              {authState === 'signedIn'
                ? 'Tambah, ubah, hapus, dan atur urutan isi museum. Perubahan tersimpan di database dan langsung tampil.'
                : 'Masuk sebagai kurator untuk mengelola konten museum.'}
            </SheetDescription>
            {authState === 'signedIn' && <div className="mt-2">{dbBadge}</div>}
          </SheetHeader>

          {authState === 'signedIn' ? (
            <div className="flex-1 px-5 py-4">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabKey)}>
              <TabsList className="mb-4 grid h-auto w-full grid-cols-2 gap-1 bg-zinc-900 lg:grid-cols-4">
                <TabsTrigger value="pd1" className="text-xs data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-950">
                  Ruang 1 · PD I
                </TabsTrigger>
                <TabsTrigger value="pd2" className="text-xs data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-950">
                  Ruang 2 · PD II
                </TabsTrigger>
                <TabsTrigger value="kolonial" className="text-xs data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-950">
                  Ruang 3 · Kolonial
                </TabsTrigger>
                <TabsTrigger value="era" className="text-xs data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-950">
                  Narasi Indonesia
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pd1" className="space-y-6">
                <section>
                  <h3 className={cn('mb-2 text-xs font-bold tracking-widest text-amber-400 uppercase')}>Vitrin Artefak</h3>
                  {renderArtifactList('pd1')}
                </section>
                <section>
                  <h3 className="mb-2 text-xs font-bold tracking-widest text-amber-400 uppercase">Lini Masa</h3>
                  {renderEventList('pd1')}
                </section>
              </TabsContent>

              <TabsContent value="pd2" className="space-y-6">
                <section>
                  <h3 className="mb-2 text-xs font-bold tracking-widest text-amber-400 uppercase">Vitrin Artefak</h3>
                  {renderArtifactList('pd2')}
                </section>
                <section>
                  <h3 className="mb-2 text-xs font-bold tracking-widest text-amber-400 uppercase">Lini Masa</h3>
                  {renderEventList('pd2')}
                </section>
              </TabsContent>

              <TabsContent value="kolonial" className="space-y-6">
                <section>
                  <h3 className={cn('mb-2 text-xs font-bold tracking-widest text-amber-400 uppercase')}>Vitrin Artefak</h3>
                  {renderArtifactList('kolonial')}
                </section>
                <section>
                  <h3 className="mb-2 text-xs font-bold tracking-widest text-amber-400 uppercase">Garis Waktu Kolonialisme</h3>
                  {renderEventList('kolonial')}
                </section>
              </TabsContent>

              <TabsContent value="era">
                <h3 className="mb-2 text-xs font-bold tracking-widest text-amber-400 uppercase">Narasi Utama Ruang 3</h3>
                {renderEraList()}
              </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="flex-1 px-5 py-6">
              {authState === 'checking' && (
                <p className="text-sm text-zinc-400">Memeriksa akses kurator…</p>
              )}
              {authState === 'unconfigured' && (
                <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
                  Akses kurator belum dikonfigurasi. Admin server perlu mengatur
                  {' '}CURATOR_PASSWORD dan CURATOR_SESSION_SECRET.
                </p>
              )}
              {authState === 'error' && (
                <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                  {authError}
                </p>
              )}
              {authState === 'signedOut' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="curator-password" className="text-zinc-300">
                      Kata sandi kurator
                    </Label>
                    <Input
                      id="curator-password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      className="border-zinc-700 bg-zinc-900 text-zinc-100"
                    />
                  </div>
                  {authError && (
                    <p role="alert" className="text-sm text-red-400">
                      {authError}
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={authBusy}
                    className="w-full bg-amber-500 font-semibold text-zinc-950 hover:bg-amber-400"
                  >
                    <KeyRound className="mr-2 h-4 w-4" aria-hidden />
                    {authBusy ? 'Memeriksa…' : 'Masuk'}
                  </Button>
                </form>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      <ItemFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        kind={editorKind}
        gallery={editorGallery}
        editing={editing}
        onSaved={() => {
          toast({ title: 'Konten museum diperbarui.' });
          onDataChanged();
        }}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="border-zinc-700 bg-zinc-950 text-zinc-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus item ini?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              &ldquo;{deleteTarget?.label}&rdquo; akan dihapus permanen dari museum. Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-500">
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
