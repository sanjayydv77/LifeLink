import { useEffect, useRef } from 'react';

interface Node { x: number; y: number; vx: number; vy: number; r: number; pulse: number; }

const COLORS = { line: '45,212,191', node: '45,212,191', hot: '16,185,129' };
const NODE_COUNT = 72;
const MAX_DIST = 160;
const MOUSE_ATTRACT = 120;
const MOUSE_FORCE = 0.018;

export default function NeuronCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const nodes = useRef<Node[]>([]);
  const raf = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Init nodes
    nodes.current = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: 1.5 + Math.random() * 2,
      pulse: Math.random() * Math.PI * 2,
    }));

    const onMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 }; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const ns = nodes.current;
      const mx = mouse.current.x, my = mouse.current.y;

      // Update nodes
      for (const n of ns) {
        n.pulse += 0.02;
        // Mouse attraction
        const dx = mx - n.x, dy = my - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_ATTRACT && dist > 0) {
          n.vx += (dx / dist) * MOUSE_FORCE;
          n.vy += (dy / dist) * MOUSE_FORCE;
        }
        // Dampen
        n.vx *= 0.98; n.vy *= 0.98;
        // Max speed
        const spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (spd > 1.8) { n.vx = (n.vx / spd) * 1.8; n.vy = (n.vy / spd) * 1.8; }
        n.x += n.vx; n.y += n.vy;
        // Bounce
        if (n.x < 0) { n.x = 0; n.vx = Math.abs(n.vx); }
        if (n.x > canvas.width) { n.x = canvas.width; n.vx = -Math.abs(n.vx); }
        if (n.y < 0) { n.y = 0; n.vy = Math.abs(n.vy); }
        if (n.y > canvas.height) { n.y = canvas.height; n.vy = -Math.abs(n.vy); }
      }

      // Draw connections
      for (let i = 0; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          const dx = ns[i].x - ns[j].x, dy = ns[i].y - ns[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            const alpha = (1 - d / MAX_DIST) * 0.4;
            // Check if either node is near mouse
            const hotI = Math.hypot(mx - ns[i].x, my - ns[i].y) < MOUSE_ATTRACT;
            const hotJ = Math.hypot(mx - ns[j].x, my - ns[j].y) < MOUSE_ATTRACT;
            const color = (hotI || hotJ) ? COLORS.hot : COLORS.line;
            const lineAlpha = (hotI || hotJ) ? alpha * 2.2 : alpha;
            ctx.beginPath();
            ctx.moveTo(ns[i].x, ns[i].y);
            ctx.lineTo(ns[j].x, ns[j].y);
            ctx.strokeStyle = `rgba(${color},${Math.min(lineAlpha, 0.7)})`;
            ctx.lineWidth = (hotI || hotJ) ? 1.2 : 0.7;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of ns) {
        const nearMouse = Math.hypot(mx - n.x, my - n.y) < MOUSE_ATTRACT;
        const glow = Math.sin(n.pulse) * 0.3 + 0.7;
        const r = n.r * (nearMouse ? 1.8 : 1) * glow;
        const color = nearMouse ? COLORS.hot : COLORS.node;
        // Outer glow
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
        grad.addColorStop(0, `rgba(${color},${nearMouse ? 0.5 : 0.2})`);
        grad.addColorStop(1, `rgba(${color},0)`);
        ctx.beginPath(); ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill();
        // Core dot
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${nearMouse ? 0.95 : 0.75})`;
        ctx.fill();
      }

      raf.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  );
}
