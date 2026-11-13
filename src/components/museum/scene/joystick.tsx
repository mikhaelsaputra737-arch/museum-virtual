'use client';

import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

interface JoystickProps {
  /** Dipanggil dengan vektor -1..1 (x kanan positif, y bawah positif). */
  onChange: (x: number, y: number) => void;
}

const RADIUS = 38;

/** Joystick virtual — seret untuk berjalan di dalam aula (mouse maupun sentuh). */
export function Joystick({ onChange }: JoystickProps) {
  const baseRef = useRef<HTMLDivElement>(null);
  const pointerId = useRef<number | null>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const update = (e: PointerEvent<HTMLDivElement>) => {
    const el = baseRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let dx = e.clientX - (r.left + r.width / 2);
    let dy = e.clientY - (r.top + r.height / 2);
    const dist = Math.hypot(dx, dy);
    if (dist > RADIUS) {
      dx = (dx / dist) * RADIUS;
      dy = (dy / dist) * RADIUS;
    }
    setKnob({ x: dx, y: dy });
    onChange(dx / RADIUS, dy / RADIUS);
  };

  const release = () => {
    pointerId.current = null;
    setActive(false);
    setKnob({ x: 0, y: 0 });
    onChange(0, 0);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    pointerId.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    setActive(true);
    update(e);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (pointerId.current === e.pointerId) update(e);
  };

  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    if (pointerId.current === e.pointerId) release();
  };

  // Alternatif keyboard saat joystick difokuskan: tombol panah menggeser sebentar.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const v: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const dir = v[e.key];
    if (!dir) return;
    e.preventDefault();
    onChange(dir[0], dir[1]);
  };
  const onKeyUp = () => onChange(0, 0);

  const arrow = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 15l6-6 6 6" />
    </svg>
  );

  return (
    <div
      ref={baseRef}
      className={`ms-joystick${active ? ' is-active' : ''}`}
      role="application"
      aria-label="Joystick: seret untuk berjalan di dalam aula museum"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onBlur={release}
    >
      <span className="ms-joystick-arrow up">{arrow}</span>
      <span className="ms-joystick-arrow down">{arrow}</span>
      <span className="ms-joystick-arrow left">{arrow}</span>
      <span className="ms-joystick-arrow right">{arrow}</span>
      <span className="ms-joystick-knob" style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }} />
    </div>
  );
}
