"use client";

import { useEffect, useRef } from "react";

/* ─── Types ───────────────────────────────────────────────── */
interface Neuron {
  x: number; y: number;
  layer: number; indexInLayer: number;
  pulsePhase: number; pulseSpeed: number;
  activationLevel: number; targetActivation: number;
  activationTimer: number;
}

interface Synapse {
  from: Neuron; to: Neuron;
  progress: number; speed: number;
  alpha: number; width: number;
  tail: Array<{ x: number; y: number; a: number }>;
}

interface Orb {
  x: number; y: number; r: number;
  vx: number; vy: number; phase: number;
}

interface Particle {
  x: number; y: number;
  vy: number; alpha: number; r: number;
}

/* ─── Component ───────────────────────────────────────────── */
export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // non-null aliases visible to all closures
    const cv: HTMLCanvasElement = canvas;
    const cx: CanvasRenderingContext2D = ctx;

    let raf: number;
    let neurons: Neuron[] = [];
    let synapses: Synapse[] = [];
    let orbs: Orb[] = [];
    let particles: Particle[] = [];
    let scanY = 0;

    /* ── theme ─────────────────────────────────────────────── */
    const dark = () => document.documentElement.classList.contains("dark");

    function fg(a = 1) {
      return dark() ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`;
    }
    function glow(a = 1) {
      return dark() ? `rgba(200,220,255,${a})` : `rgba(80,80,120,${a})`;
    }
    function accent(a = 1) {
      return dark() ? `rgba(160,200,255,${a})` : `rgba(60,60,100,${a})`;
    }

    /* ── resize ────────────────────────────────────────────── */
    function resize() {
      cv.width  = cv.offsetWidth;
      cv.height = cv.offsetHeight;
    }

    /* ── build structured NN layers ────────────────────────── */
    function buildNetwork() {
      const { width, height } = cv;
      const LAYERS = [4, 7, 9, 9, 7, 4];
      const marginX = width * 0.1;
      const usableW = width - marginX * 2;
      const layerSpacing = usableW / (LAYERS.length - 1);

      neurons = [];
      LAYERS.forEach((count, li) => {
        const x = marginX + li * layerSpacing;
        const totalH = (count - 1) * 90;
        const startY = height / 2 - totalH / 2;
        for (let i = 0; i < count; i++) {
          neurons.push({
            x: x + (Math.random() - 0.5) * 18,
            y: startY + i * 90 + (Math.random() - 0.5) * 14,
            layer: li, indexInLayer: i,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.018 + 0.006,
            activationLevel: Math.random() * 0.4,
            targetActivation: Math.random(),
            activationTimer: Math.floor(Math.random() * 120),
          });
        }
      });

      /* build orbs */
      orbs = Array.from({ length: 5 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 180 + 100,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        phase: Math.random() * Math.PI * 2,
      }));

      /* build particles */
      particles = Array.from({ length: 60 }, () => makeParticle(cv.width, cv.height));
    }

    function makeParticle(w: number, h: number): Particle {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vy: Math.random() * 0.4 + 0.1,
        alpha: Math.random() * 0.25 + 0.05,
        r: Math.random() * 1.2 + 0.3,
      };
    }

    /* ── spawn a synapse signal ────────────────────────────── */
    function spawnSynapse() {
      if (synapses.length > 45) return;
      const layerCount = Math.max(...neurons.map(n => n.layer)) + 1;
      const li = Math.floor(Math.random() * (layerCount - 1));
      const fromPool = neurons.filter(n => n.layer === li);
      const toPool   = neurons.filter(n => n.layer === li + 1);
      if (!fromPool.length || !toPool.length) return;
      const from = fromPool[Math.floor(Math.random() * fromPool.length)];
      const to   = toPool[Math.floor(Math.random() * toPool.length)];
      from.targetActivation = Math.min(1, from.activationLevel + 0.5);
      synapses.push({
        from, to,
        progress: 0,
        speed: Math.random() * 0.008 + 0.004,
        alpha: Math.random() * 0.55 + 0.35,
        width: Math.random() * 1.0 + 0.4,
        tail: [],
      });
    }

    /* ── hex grid ──────────────────────────────────────────── */
    function drawHexGrid(t: number) {
      const size = 38;
      const cols = Math.ceil(cv.width  / (size * 1.732)) + 2;
      const rows = Math.ceil(cv.height / (size * 1.5))   + 2;
      // global breathing: slow sine that pulses the whole grid in and out
      const breath = 0.55 + 0.45 * Math.sin(t * 0.00055);
      cx.save();
      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const hx = col * size * 1.732 + (row % 2 === 0 ? 0 : size * 0.866);
          const hy = row * size * 1.5;
          const dist = Math.hypot(hx - cv.width * 0.5, hy - cv.height * 0.5);
          const maxDist = Math.hypot(cv.width * 0.5, cv.height * 0.5);
          const proximity = 1 - dist / maxDist;
          // per-cell ripple offset so the breathing rolls outward from centre
          const ripple = 0.5 + 0.5 * Math.sin(t * 0.0006 - dist * 0.012);
          const a = proximity * ripple * breath * 0.75;
          if (a < 0.003) continue;
          // hue cycles globally + spatial wave across cols/rows
          const hue = (t * 0.04 + col * 18 + row * 12) % 360;
          cx.beginPath();
          for (let k = 0; k < 6; k++) {
            const angle = (Math.PI / 3) * k - Math.PI / 6;
            const px = hx + size * Math.cos(angle);
            const py = hy + size * Math.sin(angle);
            k === 0 ? cx.moveTo(px, py) : cx.lineTo(px, py);
          }
          cx.closePath();
          cx.strokeStyle = `hsla(${hue},100%,62%,${a})`;
          cx.lineWidth = 0.6;
          cx.stroke();
        }
      }
      cx.restore();
    }

    /* ── atmospheric orbs ──────────────────────────────────── */
    function drawOrbs(t: number) {
      orbs.forEach(o => {
        o.x += o.vx; o.y += o.vy; o.phase += 0.003;
        if (o.x < -o.r) o.x = cv.width  + o.r;
        if (o.x > cv.width  + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = cv.height + o.r;
        if (o.y > cv.height + o.r) o.y = -o.r;
        const pulse = 0.5 + 0.5 * Math.sin(o.phase + t * 0.0005);
        const r = o.r * (0.85 + pulse * 0.15);
        const a = pulse * (dark() ? 0.06 : 0.04);
        const g = cx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r);
        g.addColorStop(0, glow(a));
        g.addColorStop(1, glow(0));
        cx.beginPath();
        cx.arc(o.x, o.y, r, 0, Math.PI * 2);
        cx.fillStyle = g;
        cx.fill();
      });
    }

    /* ── static synapse web ─────────────────────────────────── */
    function drawWeb() {
      const MAX_DIST = 260;
      for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
          const n = neurons[i];
          const m = neurons[j];
          const dist = Math.hypot(n.x - m.x, n.y - m.y);
          if (dist > MAX_DIST) continue;
          // fade with distance; adjacent layers slightly brighter
          const layerAdj = Math.abs(n.layer - m.layer) === 1 ? 1.6 : 1;
          const a = Math.max(0, (1 - dist / MAX_DIST)) * layerAdj * (dark() ? 0.13 : 0.08);
          if (a < 0.005) continue;
          cx.beginPath();
          cx.moveTo(n.x, n.y);
          cx.lineTo(m.x, m.y);
          cx.strokeStyle = fg(a);
          cx.lineWidth = 0.5;
          cx.stroke();
        }
      }
    }

    /* ── travelling signals ─────────────────────────────────── */
    function drawSynapses() {
      synapses = synapses.filter(s => s.progress <= 1.05);
      synapses.forEach(s => {
        s.progress += s.speed;
        const { from, to } = s;
        const px = from.x + (to.x - from.x) * s.progress;
        const py = from.y + (to.y - from.y) * s.progress;
        const fade = s.progress > 0.75 ? (1 - s.progress) / 0.25 : 1;
        const a = s.alpha * fade;

        // push tail point
        s.tail.push({ x: px, y: py, a });
        if (s.tail.length > 22) s.tail.shift();

        // draw tail
        s.tail.forEach((pt, i) => {
          const tr = (i / s.tail.length);
          const ta = a * tr * 0.7;
          const tw = s.width * tr * 1.4;
          cx.beginPath();
          cx.arc(pt.x, pt.y, tw, 0, Math.PI * 2);
          cx.fillStyle = accent(ta);
          cx.fill();
        });

        // outer glow
        const g = cx.createRadialGradient(px, py, 0, px, py, 10);
        g.addColorStop(0, glow(a * 0.8));
        g.addColorStop(1, glow(0));
        cx.beginPath();
        cx.arc(px, py, 10, 0, Math.PI * 2);
        cx.fillStyle = g;
        cx.fill();

        // bright core
        cx.beginPath();
        cx.arc(px, py, s.width + 0.8, 0, Math.PI * 2);
        cx.fillStyle = fg(a);
        cx.fill();

        // activate destination neuron
        if (s.progress > 0.95) to.targetActivation = Math.min(1, to.activationLevel + 0.6);
      });
    }

    /* ── neurons ────────────────────────────────────────────── */
    function drawNeurons(t: number) {
      neurons.forEach(n => {
        // smooth activation
        n.activationTimer--;
        if (n.activationTimer <= 0) {
          n.targetActivation = Math.random();
          n.activationTimer = Math.floor(Math.random() * 180 + 60);
        }
        n.activationLevel += (n.targetActivation - n.activationLevel) * 0.02;
        n.pulsePhase += n.pulseSpeed;

        const pulse = 0.5 + 0.5 * Math.sin(n.pulsePhase + t * 0.0008);
        const act   = n.activationLevel;
        const r     = 3 + act * 3 + pulse * 1.2;

        // depth ring
        const maxLayer = Math.max(...neurons.map(x => x.layer));
        const depthAlpha = 0.5 + (n.layer / maxLayer) * 0.5;

        // large ambient glow
        const g1 = cx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 7);
        g1.addColorStop(0, glow(act * depthAlpha * (dark() ? 0.18 : 0.1)));
        g1.addColorStop(1, glow(0));
        cx.beginPath();
        cx.arc(n.x, n.y, r * 7, 0, Math.PI * 2);
        cx.fillStyle = g1;
        cx.fill();

        // mid ring
        const g2 = cx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 2.5);
        g2.addColorStop(0, accent(act * depthAlpha * 0.5));
        g2.addColorStop(1, accent(0));
        cx.beginPath();
        cx.arc(n.x, n.y, r * 2.5, 0, Math.PI * 2);
        cx.fillStyle = g2;
        cx.fill();

        // outer ring stroke
        cx.beginPath();
        cx.arc(n.x, n.y, r + 2, 0, Math.PI * 2);
        cx.strokeStyle = fg(act * depthAlpha * 0.35);
        cx.lineWidth = 0.7;
        cx.stroke();

        // core
        cx.beginPath();
        cx.arc(n.x, n.y, r, 0, Math.PI * 2);
        cx.fillStyle = fg(0.25 + act * depthAlpha * 0.65);
        cx.fill();
      });
    }

    /* ── data particles ─────────────────────────────────────── */
    function drawParticles() {
      const { width, height } = cv;
      particles.forEach(p => {
        p.y += p.vy;
        if (p.y > height) { p.y = 0; p.x = Math.random() * width; }
        cx.beginPath();
        cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cx.fillStyle = fg(p.alpha);
        cx.fill();
      });
    }

    /* ── scan line ──────────────────────────────────────────── */
    function drawScan(t: number) {
      const { width, height } = cv;
      scanY = (t * 0.04) % height;
      const g = cx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      g.addColorStop(0,   glow(0));
      g.addColorStop(0.4, glow(dark() ? 0.04 : 0.025));
      g.addColorStop(0.5, glow(dark() ? 0.09 : 0.05));
      g.addColorStop(0.6, glow(dark() ? 0.04 : 0.025));
      g.addColorStop(1,   glow(0));
      cx.fillStyle = g;
      cx.fillRect(0, scanY - 40, width, 80);

      cx.beginPath();
      cx.moveTo(0, scanY);
      cx.lineTo(width, scanY);
      cx.strokeStyle = fg(dark() ? 0.06 : 0.035);
      cx.lineWidth = 1;
      cx.stroke();
    }

    /* ── edge vignette ──────────────────────────────────────── */
    function drawVignette() {
      const { width, height } = cv;
      const g = cx.createRadialGradient(
        width / 2, height / 2, height * 0.2,
        width / 2, height / 2, height * 0.85
      );
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, dark() ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.45)");
      cx.fillStyle = g;
      cx.fillRect(0, 0, width, height);
    }

    /* ── main loop ──────────────────────────────────────────── */
    function draw(t: number) {
      cx.clearRect(0, 0, cv.width, cv.height);

      drawOrbs(t);
      drawHexGrid(t);
      drawWeb();
      drawSynapses();
      drawNeurons(t);
      drawParticles();
      drawScan(t);
      drawVignette();

      if (Math.random() < 0.07) spawnSynapse();

      raf = requestAnimationFrame(draw);
    }

    /* ── init ───────────────────────────────────────────────── */
    const ro = new ResizeObserver(() => { resize(); buildNetwork(); });
    ro.observe(cv);
    resize();
    buildNetwork();
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
