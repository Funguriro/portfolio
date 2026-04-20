"use client";

import { useEffect, useRef } from "react";

interface Star         { x: number; y: number; r: number; alpha: number; phase: number; speed: number; }
interface Blob         { x: number; y: number; r: number; vx: number; vy: number; hue: number; phase: number; }
interface DataCol      { x: number; y: number; chars: string[]; speed: number; alpha: number; }
interface ShootingStar { x: number; y: number; vx: number; vy: number; len: number; alpha: number; life: number; maxLife: number; }
interface Pulse        { x: number; y: number; r: number; maxR: number; alpha: number; }

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cv = canvas, cx = ctx;
    let raf: number;

    let stars:    Star[]         = [];
    let blobs:    Blob[]         = [];
    let cols:     DataCol[]      = [];
    let shoots:   ShootingStar[] = [];
    let pulses:   Pulse[]        = [];

    const rnd  = (n: number) => Math.random() * n;
    const isDark = () => document.documentElement.classList.contains("dark");

    /* ── build scene ─────────────────────────────────────── */
    function build() {
      stars = Array.from({ length: 180 }, () => ({
        x:     rnd(cv.width),
        y:     rnd(cv.height),
        r:     rnd(1.4) + 0.3,
        alpha: rnd(0.6) + 0.15,
        phase: rnd(Math.PI * 2),
        speed: rnd(0.016) + 0.005,
      }));

      blobs = [
        { x: cv.width * 0.15, y: cv.height * 0.25, r: cv.height * 0.60, vx:  0.22, vy:  0.14, hue: 220, phase: 0.0 },
        { x: cv.width * 0.85, y: cv.height * 0.65, r: cv.height * 0.55, vx: -0.18, vy:  0.20, hue: 265, phase: 1.5 },
        { x: cv.width * 0.50, y: cv.height * 0.85, r: cv.height * 0.48, vx:  0.16, vy: -0.24, hue: 190, phase: 3.0 },
        { x: cv.width * 0.70, y: cv.height * 0.20, r: cv.height * 0.44, vx: -0.20, vy:  0.16, hue: 245, phase: 4.5 },
        { x: cv.width * 0.35, y: cv.height * 0.70, r: cv.height * 0.38, vx:  0.14, vy: -0.18, hue: 200, phase: 2.2 },
      ];

      const COL = 18;
      cols = Array.from({ length: COL }, (_, i) => ({
        x:     (cv.width / COL) * i + rnd(cv.width / COL * 0.7),
        y:     rnd(cv.height),
        chars: Array.from({ length: 26 }, () =>
          Math.random() < 0.6
            ? String(Math.floor(rnd(2)))
            : String(Math.floor(rnd(10)))
        ),
        speed: rnd(0.5) + 0.15,
        alpha: rnd(0.10) + 0.04,
      }));
    }

    function resize() {
      cv.width  = cv.offsetWidth;
      cv.height = cv.offsetHeight;
      build();
    }

    /* ── spawn helpers ───────────────────────────────────── */
    function spawnShoot() {
      if (shoots.length > 6) return;
      const fromRight = Math.random() < 0.5;
      shoots.push({
        x:       fromRight ? cv.width + 20 : -20,
        y:       rnd(cv.height * 0.6),
        vx:      fromRight ? -(rnd(4) + 3) : (rnd(4) + 3),
        vy:      rnd(2) + 1,
        len:     rnd(120) + 60,
        alpha:   rnd(0.5) + 0.4,
        life:    0,
        maxLife: rnd(60) + 50,
      });
    }

    function spawnPulse() {
      if (pulses.length > 4) return;
      pulses.push({
        x:    rnd(cv.width),
        y:    rnd(cv.height),
        r:    0,
        maxR: rnd(180) + 80,
        alpha: isDark() ? 0.22 : 0.12,
      });
    }

    /* ── main draw loop ──────────────────────────────────── */
    function draw(t: number) {
      const dark = isDark();
      cx.clearRect(0, 0, cv.width, cv.height);

      /* aurora blobs */
      blobs.forEach(b => {
        b.x += b.vx; b.y += b.vy; b.phase += 0.004;
        if (b.x < -b.r) b.x = cv.width  + b.r;
        if (b.x > cv.width  + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = cv.height + b.r;
        if (b.y > cv.height + b.r) b.y = -b.r;

        const pulse  = 0.5 + 0.5 * Math.sin(b.phase);
        const base   = dark ? 0.10 : 0.055;
        const alpha  = base + pulse * 0.05;
        const hShift = Math.sin(t * 0.00022 + b.phase) * 18;

        const g = cx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0,   `hsla(${b.hue + hShift},90%,68%,${alpha})`);
        g.addColorStop(0.45,`hsla(${b.hue + hShift},80%,58%,${alpha * 0.4})`);
        g.addColorStop(1,   `hsla(${b.hue + hShift},70%,48%,0)`);
        cx.beginPath();
        cx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        cx.fillStyle = g;
        cx.fill();
      });

      /* grid */
      const gs = 64;
      cx.strokeStyle = dark ? "rgba(255,255,255,0.055)" : "rgba(0,0,0,0.06)";
      cx.lineWidth   = 0.5;
      for (let x = 0; x <= cv.width;  x += gs) {
        cx.beginPath(); cx.moveTo(x, 0);        cx.lineTo(x, cv.height); cx.stroke();
      }
      for (let y = 0; y <= cv.height; y += gs) {
        cx.beginPath(); cx.moveTo(0, y);        cx.lineTo(cv.width, y);  cx.stroke();
      }

      /* stars */
      stars.forEach(s => {
        s.phase += s.speed;
        const tw = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(s.phase));
        const a  = s.alpha * tw * (dark ? 1 : 0.35);
        cx.beginPath();
        cx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        cx.fillStyle = dark ? `rgba(255,255,255,${a})` : `rgba(70,90,140,${a})`;
        cx.fill();
      });

      /* shooting stars */
      if (Math.random() < 0.008) spawnShoot();
      shoots = shoots.filter(s => s.life < s.maxLife);
      shoots.forEach(s => {
        s.life++;
        s.x += s.vx; s.y += s.vy;
        const progress = s.life / s.maxLife;
        const a = s.alpha * Math.sin(progress * Math.PI);
        const ex = s.x - (s.vx / Math.abs(s.vx)) * s.len;
        const ey = s.y - s.vy * (s.len / Math.abs(s.vx));
        const grad = cx.createLinearGradient(s.x, s.y, ex, ey);
        grad.addColorStop(0, dark ? `rgba(255,255,255,${a})` : `rgba(100,130,200,${a})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        cx.beginPath();
        cx.moveTo(s.x, s.y);
        cx.lineTo(ex, ey);
        cx.strokeStyle = grad;
        cx.lineWidth   = dark ? 1.5 : 1;
        cx.stroke();
      });

      /* pulse rings */
      if (Math.random() < 0.004) spawnPulse();
      pulses = pulses.filter(p => p.r < p.maxR);
      pulses.forEach(p => {
        p.r += 1.2;
        const a = p.alpha * (1 - p.r / p.maxR);
        cx.beginPath();
        cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cx.strokeStyle = dark ? `rgba(120,200,255,${a})` : `rgba(60,80,160,${a})`;
        cx.lineWidth   = 1;
        cx.stroke();
      });

      /* falling data columns */
      if (dark) {
        cx.font = "10px monospace";
        cols.forEach(col => {
          col.y += col.speed;
          if (col.y > cv.height + 400) col.y = -400;
          col.chars.forEach((ch, i) => {
            const cy   = col.y + i * 14;
            if (cy < -14 || cy > cv.height + 14) return;
            const fade = Math.max(0, 1 - Math.abs(cy - cv.height * 0.5) / (cv.height * 0.52));
            cx.fillStyle = `rgba(80,220,180,${col.alpha * fade})`;
            cx.fillText(ch, col.x, cy);
          });
        });
      }

      /* vignette — stronger at centre to protect text readability */
      const vg = cx.createRadialGradient(
        cv.width / 2, cv.height / 2, cv.height * 0.08,
        cv.width / 2, cv.height / 2, cv.height * 0.88
      );
      vg.addColorStop(0,   dark ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.45)");
      vg.addColorStop(0.5, "rgba(0,0,0,0)");
      vg.addColorStop(1,   dark ? "rgba(0,0,0,0.6)"  : "rgba(255,255,255,0.5)");
      cx.fillStyle = vg;
      cx.fillRect(0, 0, cv.width, cv.height);

      raf = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    resize();
    raf = requestAnimationFrame(draw);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
