'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, BookOpen, DoorOpen } from 'lucide-react';
import type { Artifact, TimelineEvent } from '@/data/museum';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SceneShell } from './scene/scene-shell';
import { SceneGallery, SceneVitrines, SceneWallPanels } from './scene/scene-walls';
import { SceneCharacter } from './scene/scene-character';
import { Joystick } from './scene/joystick';
import { MuseumMinimap } from './scene/museum-minimap';

/** Ukuran kanvas desain adegan (px). Semua koordinat adegan memakai ruang ini. */
const W = 1536;
const H = 1024;

const START_X = 462;
const MIN_X = 170;
const MAX_X = 1380;
const SPEED_X = 560; // px kanvas per detik
const SPEED_DEPTH = 0.75; // kedalaman (0–1) per detik

export interface RoomTheme {
  accent: string;
  soft: string;
  glow: string;
  panel: string;
}

export interface TourRoom {
  id: string;
  title: string;
  subtitle: string;
  intro: string;
  image: string;
  highlights: string[];
  artifacts: Artifact[];
  events: TimelineEvent[];
  theme: RoomTheme;
}

type Zone = number | 'lobby' | 'finish' | null;

const TIPS = [
  'Selamat datang! Gunakan joystick atau W, A, S, D untuk berjalan. Dekati pintu dan tekan E untuk masuk.',
  'Seret area aula untuk melihat sekeliling. Setiap pintu membawa Anda ke ruang sejarah berikutnya.',
  'Saat berada di dalam ruang, dekati pintu di sisi kanan untuk melanjutkan tur.',
];

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function nearestZone(x: number, roomIndex: number, roomCount: number): Zone {
  if (roomIndex < 0) {
    if (x < 300 || x > 1130) return 0;
    return null;
  }
  if (x < 300) return roomIndex === 0 ? 'lobby' : roomIndex - 1;
  if (x > 1130) return roomIndex === roomCount - 1 ? 'finish' : roomIndex + 1;
  return null;
}

/**
 * MuseumHero — tur museum satu layar. Pengunjung berjalan ke pintu untuk
 * memasuki ruang, membaca keterangannya, lalu berjalan ke pintu berikutnya.
 */
export function MuseumHero({ rooms }: { rooms: TourRoom[] }) {
  const heroRef = useRef<HTMLElement>(null);
  const [scale, setScale] = useState(1);
  const [ready, setReady] = useState(false);
  const [walking, setWalking] = useState(false);
  const [zone, setZone] = useState<Zone>(null);
  const [tip, setTip] = useState(0);
  const [roomIndex, setRoomIndex] = useState(-1);
  const [roomOpen, setRoomOpen] = useState(false);
  const [tourComplete, setTourComplete] = useState(false);

  const posX = useMotionValue(START_X);
  const depth = useMotionValue(0);
  const panMax = useMotionValue(0);
  const lookX = useMotionValue(0);

  const joystick = useRef({ x: 0, y: 0 });
  const lookDrag = useRef<{ pointerId: number; x: number } | null>(null);
  const keys = useRef({ left: false, right: false, up: false, down: false });
  const inView = useRef(true);
  const zoneRef = useRef<Zone>(null);
  const roomIndexRef = useRef(roomIndex);

  useEffect(() => {
    roomIndexRef.current = roomIndex;
  }, [roomIndex]);

  // Kamera mengikuti avatar sampai tepi kanvas; lapisan jauh bergeser sedikit lebih pelan.
  const camera = useTransform(
    [posX, panMax, lookX],
    ([x, m, look]: number[]) => clamp(x - W / 2, -m, m) + look,
  );
  const nearX = useTransform(camera, (v) => -v);
  const farX = useTransform(camera, (v) => -v * 0.96);
  const avatarY = useTransform(depth, (d) => -d * 250);
  const avatarScale = useTransform(depth, (d) => 1 - d * 0.42);

  function enterZone(destination: Exclude<Zone, null>) {
    keys.current = { left: false, right: false, up: false, down: false };
    joystick.current = { x: 0, y: 0 };
    zoneRef.current = null;
    setZone(null);
    setWalking(false);

    if (destination === 'finish') {
      setTourComplete(true);
      return;
    }
    if (destination === 'lobby') {
      setRoomIndex(-1);
      setTourComplete(false);
    } else {
      setRoomIndex(destination);
      setRoomOpen(true);
    }

    posX.set(START_X);
    depth.set(0);
    lookX.set(0);
  }

  // Skala "cover": kanvas memenuhi hero, tetapi tidak memotong terlalu banyak tinggi.
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      const s = Math.min(Math.max(width / W, height / H), height / 800);
      setScale(s);
      panMax.set(Math.max(0, (W - width / s) / 2));
      setReady(true);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [panMax]);

  // Gerakan hanya aktif selama hero terlihat di layar.
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        if (!entry.isIntersecting) {
          keys.current = { left: false, right: false, up: false, down: false };
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Loop gerak: percepatan halus + batas lantai.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let vx = 0;
    let vy = 0;
    let isWalking = false;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (inView.current && !roomOpen && !tourComplete) {
        const k = keys.current;
        const tx = clamp(joystick.current.x + (k.right ? 1 : 0) - (k.left ? 1 : 0), -1, 1);
        const ty = clamp(joystick.current.y + (k.down ? 1 : 0) - (k.up ? 1 : 0), -1, 1);
        const ease = Math.min(1, dt * 12);
        vx += (tx - vx) * ease;
        vy += (ty - vy) * ease;
        if (Math.abs(vx) < 0.01) vx = 0;
        if (Math.abs(vy) < 0.01) vy = 0;

        if (vx !== 0 || vy !== 0) {
          posX.set(clamp(posX.get() + vx * SPEED_X * dt, MIN_X, MAX_X));
          depth.set(clamp(depth.get() - vy * SPEED_DEPTH * dt, 0, 1));
        }

        const moving = Math.hypot(vx, vy) > 0.08;
        if (moving !== isWalking) {
          isWalking = moving;
          setWalking(moving);
        }

        const z = nearestZone(posX.get(), roomIndexRef.current, rooms.length);
        if (z !== zoneRef.current) {
          zoneRef.current = z;
          setZone(z);
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [posX, depth, rooms.length, roomOpen, tourComplete]);

  // Keyboard: A/D/←/→ berjalan, W/S maju-mundur, E masuk ruang. Panah atas/bawah tetap menggulir halaman.
  useEffect(() => {
    const dirs: Record<string, 'left' | 'right' | 'up' | 'down'> = {
      a: 'left',
      arrowleft: 'left',
      d: 'right',
      arrowright: 'right',
      w: 'up',
      s: 'down',
    };
    const isTyping = (t: EventTarget | null) =>
      t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

    const onDown = (e: KeyboardEvent) => {
      if (
        !inView.current ||
        roomOpen ||
        tourComplete ||
        isTyping(e.target) ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      ) return;
      const key = e.key.toLowerCase();
      const dir = dirs[key];
      if (dir) {
        keys.current[dir] = true;
        e.preventDefault();
        return;
      }
      if (key === 'e' && zoneRef.current !== null) {
        enterZone(zoneRef.current);
      }
    };
    const onUp = (e: KeyboardEvent) => {
      const dir = dirs[e.key.toLowerCase()];
      if (dir) keys.current[dir] = false;
    };
    const onBlur = () => {
      keys.current = { left: false, right: false, up: false, down: false };
    };

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [roomOpen, tourComplete]);

  const onJoystick = useCallback((x: number, y: number) => {
    joystick.current = { x, y };
  }, []);

  const room = roomIndex >= 0 ? rooms[roomIndex] : null;
  const roomStyle = room
    ? ({
        ['--room-accent' as any]: room.theme.accent,
        ['--room-soft' as any]: room.theme.soft,
        ['--room-glow' as any]: room.theme.glow,
        ['--room-panel' as any]: room.theme.panel,
      } as CSSProperties)
    : undefined;
  const zoneLabel =
    typeof zone === 'number'
      ? `Masuk ke ${rooms[zone]?.title ?? 'ruang berikutnya'}`
      : zone === 'lobby'
        ? 'Kembali ke lobi'
        : zone === 'finish'
          ? 'Selesaikan tur'
          : '';

  const onLookPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (e.target instanceof Element && e.target.closest('.ms-hud, .ms-top, a, button')) return;
    if (e.pointerType === 'touch' && e.clientX < window.innerWidth * 0.45) return;

    lookDrag.current = { pointerId: e.pointerId, x: e.clientX };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onLookPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (lookDrag.current?.pointerId !== e.pointerId) return;

    const dx = e.clientX - lookDrag.current.x;
    lookDrag.current.x = e.clientX;
    lookX.set(clamp(lookX.get() - dx / Math.max(scale, 0.1), -360, 360));
  };

  const onLookPointerEnd = (e: PointerEvent<HTMLElement>) => {
    if (lookDrag.current?.pointerId === e.pointerId) lookDrag.current = null;
  };

  const stageStyle = { '--ms-scale': scale } as CSSProperties;

  return (
    <header
      id="beranda"
      ref={heroRef}
      className="ms-hero"
      onPointerDown={onLookPointerDown}
      onPointerMove={onLookPointerMove}
      onPointerUp={onLookPointerEnd}
      onPointerCancel={onLookPointerEnd}
    >
      <h1 className="sr-only">
        Museum Virtual Sejarah — Perang Dunia I, Perang Dunia II, dan Kolonialisme serta Perjuangan Indonesia
      </h1>

      <div className="ms-viewport">
        <div
          className={`ms-stage${ready ? ' is-ready' : ''}`}
          style={stageStyle}
          role="group"
          aria-label={room ? `Tur museum: ${room.title}` : 'Lobi museum virtual'}
        >
          <motion.div className="ms-layer" style={{ x: farX }}>
            <SceneShell />
            {room && (
              <div
                className="ms-room-atmosphere"
                style={{
                  backgroundImage: `linear-gradient(rgba(7, 10, 25, 0.62), rgba(7, 10, 25, 0.62)), url("${room.image}")`,
                }}
                aria-hidden="true"
              />
            )}
          </motion.div>

          <motion.div className="ms-layer" style={{ x: nearX }}>
            <SceneVitrines />
            <SceneWallPanels />
            <SceneGallery />
            <motion.div
              className="ms-avatar-wrap"
              style={{ x: posX, y: avatarY, scale: avatarScale, top: H - 4 - 452 }}
            >
              <SceneCharacter walking={walking} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* HUD */}
      <div className="ms-hud">
        <Joystick onChange={onJoystick} />

        <div className="ms-chat" role="status" aria-live="polite">
          <span className="ms-chat-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-5 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
              <path d="M8.5 11h.01M12 11h.01M15.5 11h.01" />
            </svg>
          </span>
          <p>{TIPS[tip]}</p>
          <button type="button" onClick={() => setTip((t) => (t + 1) % TIPS.length)} aria-label="Tampilkan petunjuk berikutnya">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
              <path d="M21.5 3.2 2.9 10.4c-.8.3-.8 1.4 0 1.7l4.6 1.7 1.8 5.5c.2.7 1.1.9 1.6.4l2.5-2.4 4.6 3.4c.6.4 1.4.1 1.6-.6L22.9 4.6c.2-.8-.6-1.7-1.4-1.4zM9 13.5l9-6.3-6.5 7.4-.4 3z" />
            </svg>
          </button>
        </div>

        <MuseumMinimap x={posX} depth={depth} />

        {room && (
          <div className="ms-tour-label" aria-live="polite">
            <span>RUANG {roomIndex + 1} DARI {rooms.length}</span>
            <strong>{room.title}</strong>
          </div>
        )}

        {zone !== null && (
          <div className="ms-hint" role="status">
            <span>
              Anda di depan <strong>{zoneLabel}</strong>
            </span>
            <button type="button" onClick={() => enterZone(zone)}>
              {zone === 'finish' ? 'Selesai' : zone === 'lobby' ? 'Kembali' : 'Masuk'}
              <kbd>E</kbd>
            </button>
          </div>
        )}
      </div>

      <Dialog open={roomOpen && !!room} onOpenChange={setRoomOpen}>
        <DialogContent
          className="max-h-[88svh] max-w-5xl overflow-y-auto border-zinc-700 bg-zinc-950 p-0 text-zinc-100"
          style={roomStyle}
        >
          {room && (
            <>
              <div
                className="ms-room-shell border-b border-zinc-800 p-4 sm:p-6"
                style={{
                  background: `radial-gradient(circle at top, ${room.theme.soft} 0%, rgba(9,9,11,0.82) 48%, rgba(9,9,11,1) 100%)`,
                }}
              >
                <div className="grid gap-5 md:grid-cols-[1.15fr_0.85fr]">
                  <div
                    className="ms-room-hologram relative overflow-hidden rounded-[28px] border bg-zinc-900/70"
                    style={{
                      borderColor: room.theme.accent,
                      boxShadow: `0 0 35px ${room.theme.glow}`,
                    }}
                  >
                    <div
                      className="absolute inset-3 rounded-[22px] border"
                      aria-hidden="true"
                      style={{ borderColor: room.theme.accent }}
                    />
                    <div
                      className="absolute inset-0"
                      aria-hidden="true"
                      style={{ background: `radial-gradient(circle at center, ${room.theme.glow}, transparent 58%)` }}
                    />
                    <div className="ms-room-sheen absolute inset-0" aria-hidden="true" style={{ background: room.theme.panel }} />
                    <div className="relative h-[300px] w-full sm:h-[360px]">
                      <Image
                        src={room.image}
                        alt={room.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 700px"
                        className="object-cover grayscale-[0.12] contrast-125"
                        priority
                      />
                    </div>
                    <div
                      className="absolute inset-x-5 bottom-4 flex items-center justify-between gap-3 rounded-2xl border bg-slate-950/60 px-3 py-2 backdrop-blur-sm"
                      style={{ borderColor: `${room.theme.accent}70`, boxShadow: `0 0 24px ${room.theme.glow}` }}
                    >
                      <div>
                        <p className="text-[10px] font-bold tracking-[0.28em] uppercase" style={{ color: room.theme.accent }}>
                          Hologram
                        </p>
                        <p className="text-sm font-semibold text-white">{room.title}</p>
                      </div>
                      <span
                        className="rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.22em]"
                        style={{ borderColor: `${room.theme.accent}80`, background: `${room.theme.accent}1a`, color: room.theme.accent }}
                      >
                        Live
                      </span>
                    </div>
                  </div>

                  <div
                    className="flex flex-col justify-between rounded-[28px] border p-5 shadow-inner"
                    style={{ borderColor: `${room.theme.accent}25`, background: 'rgba(9,9,11,0.76)', boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04), 0 0 20px ${room.theme.glow}` }}
                  >
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.32em] uppercase" style={{ color: room.theme.accent }}>
                        Ruang {roomIndex + 1} · {room.subtitle}
                      </p>
                      <DialogTitle className="mt-3 text-3xl font-black text-white sm:text-4xl">
                        {room.title}
                      </DialogTitle>
                    </div>

                    <DialogHeader className="mt-4 text-left">
                      <DialogDescription className="text-sm leading-relaxed text-zinc-300 sm:text-base">
                        {room.intro}
                      </DialogDescription>
                    </DialogHeader>

                    <div
                      className="mt-5 flex items-start gap-3 rounded-2xl border p-3"
                      style={{ borderColor: `${room.theme.accent}25`, background: `${room.theme.accent}0d` }}
                    >
                      <BookOpen className="mt-0.5 h-5 w-5 shrink-0" aria-hidden style={{ color: room.theme.accent }} />
                      <p className="text-xs leading-relaxed text-zinc-200 sm:text-sm">
                        Simulasi ruang ini memadukan visual hologram, artefak, dan peristiwa penting untuk membangun pemahaman sejarah secara interaktif.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 px-5 pb-6 sm:px-8 sm:pb-8">
                {room.highlights.length > 0 && (
                  <section>
                    <h3 className="mb-3 text-sm font-bold tracking-[0.22em] uppercase" style={{ color: room.theme.accent }}>
                      Fokus cerita
                    </h3>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {room.highlights.slice(0, 6).map((highlight) => (
                        <li
                          key={highlight}
                          className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-3 text-sm leading-relaxed text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                        >
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                  {room.artifacts.length > 0 && (
                    <section>
                      <h3 className="mb-3 text-sm font-bold tracking-[0.22em] uppercase" style={{ color: room.theme.accent }}>
                        Koleksi pilihan
                      </h3>
                      <div className="space-y-3">
                        {room.artifacts.slice(0, 3).map((artifact) => (
                          <article key={artifact.id} className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70">
                            <div className="relative h-28">
                              <Image src={artifact.image} alt={artifact.title} fill sizes="240px" className="object-cover" />
                            </div>
                            <div className="p-3">
                              <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: room.theme.accent }}>{artifact.year}</p>
                              <h4 className="mt-1 text-sm font-semibold text-white">{artifact.title}</h4>
                              <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-zinc-400">
                                {artifact.description}
                              </p>
                            </div>
                          </article>
                        ))}
                      </div>
                    </section>
                  )}

                  {room.events.length > 0 && (
                    <section>
                      <h3 className="mb-3 text-sm font-bold tracking-[0.22em] uppercase" style={{ color: room.theme.accent }}>
                        Peristiwa penting
                      </h3>
                      <ol className="space-y-3 border-l pl-4" style={{ borderColor: `${room.theme.accent}35` }}>
                        {room.events.slice(0, 4).map((event) => (
                          <li key={`${event.year}-${event.title}`} className="relative rounded-2xl border border-zinc-800 bg-zinc-900/70 p-3">
                            <span className="absolute -left-[21px] top-4 h-2.5 w-2.5 rounded-full shadow-[0_0_10px_rgba(103,232,249,0.8)]" style={{ background: room.theme.accent, boxShadow: `0 0 12px ${room.theme.glow}` }} />
                            <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: room.theme.accent }}>{event.year}</p>
                            <p className="mt-1 text-sm font-semibold text-white">{event.title}</p>
                            <p className="mt-1 text-xs leading-relaxed text-zinc-400">{event.description}</p>
                          </li>
                        ))}
                      </ol>
                    </section>
                  )}
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-zinc-800 pt-5 sm:flex-row sm:justify-between">
                  {roomIndex > 0 ? (
                    <button
                      type="button"
                      onClick={() => enterZone(roomIndex - 1)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-200 hover:bg-zinc-800"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden />
                      Ruang sebelumnya
                    </button>
                  ) : <span />}
                  <button
                    type="button"
                    onClick={() => setRoomOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-zinc-950 hover:opacity-90"
                    style={{ background: room.theme.accent }}
                  >
                    <DoorOpen className="h-4 w-4" aria-hidden />
                    Lanjut berjalan
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={tourComplete} onOpenChange={setTourComplete}>
        <DialogContent className="max-w-md border-zinc-700 bg-zinc-950 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Tur museum selesai</DialogTitle>
            <DialogDescription className="text-zinc-300">
              Anda telah menjelajahi semua ruang. Kembali ke lobi untuk memulai tur lagi.
            </DialogDescription>
          </DialogHeader>
          <button
            type="button"
            onClick={() => enterZone('lobby')}
            className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-zinc-950 hover:bg-amber-300"
          >
            Kembali ke lobi
          </button>
        </DialogContent>
      </Dialog>
    </header>
  );
}
