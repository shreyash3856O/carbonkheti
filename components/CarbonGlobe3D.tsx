"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface NodePin {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  practice: string;
  factor: string;
  zone: string;
  protocol: string;
}

const INDIAN_NODES: NodePin[] = [
  {
    id: "pb",
    name: "Indo-Gangetic Basin",
    state: "Punjab",
    lat: 31.1471,
    lng: 75.3412,
    practice: "Residue Retention (Zero-Burn)",
    factor: "1.20 tCO₂e/ac/yr",
    zone: "Trans-Gangetic Plains",
    protocol: "Happy Seeder / SMS In-situ Mulching",
  },
  {
    id: "mh",
    name: "Vidarbha Agroforestry",
    state: "Maharashtra",
    lat: 20.3888,
    lng: 78.1204,
    practice: "Field Boundary Trees",
    factor: "1.00 tCO₂e/ac/yr",
    zone: "Western Plateau & Hills",
    protocol: "Perennial Bund Silvo-Arable",
  },
  {
    id: "ap",
    name: "Godavari Rice Delta",
    state: "Andhra Pradesh",
    lat: 16.9891,
    lng: 81.784,
    practice: "AWD Methane Abatement",
    factor: "1.50 tCO₂e/ac/yr",
    zone: "East Coast Plains",
    protocol: "Intermittent Controlled Drainage",
  },
  {
    id: "tn",
    name: "Cauvery Irrigation Belt",
    state: "Tamil Nadu",
    lat: 10.787,
    lng: 79.1378,
    practice: "Alternate Wetting & Drying",
    factor: "1.50 tCO₂e/ac/yr",
    zone: "Southern Plateau & Hills",
    protocol: "Field Tube Water-Table Monitored",
  },
  {
    id: "hr",
    name: "Karnal Conservation Belt",
    state: "Haryana",
    lat: 29.6857,
    lng: 76.9905,
    practice: "Zero-Till Direct Seeding",
    factor: "0.80 tCO₂e/ac/yr",
    zone: "Trans-Gangetic Plains",
    protocol: "Direct Seeded Rice / Zero-Till Wheat",
  },
  {
    id: "mp",
    name: "Malwa Plateau Soil Bank",
    state: "Madhya Pradesh",
    lat: 22.7196,
    lng: 75.8577,
    practice: "Multi-Species Cover Cropping",
    factor: "0.70 tCO₂e/ac/yr",
    zone: "Central Plateau & Hills",
    protocol: "Dhaincha / Sunn Hemp Green Manuring",
  },
];

export default function CarbonGlobe3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodePin>(INDIAN_NODES[0]);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  // Rotation state with momentum
  const rotRef = useRef({ x: 0.32, y: -0.65 });
  const velRef = useRef({ x: 0, y: 0.0025 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  // Orient globe towards a selected node smoothly
  const focusOnNode = useCallback((node: NodePin) => {
    setSelectedNode(node);
    // Calculate target rotation Y such that node.lng faces forward
    const targetY = -((node.lng * Math.PI) / 180) - Math.PI / 2;
    const targetX = (node.lat * Math.PI) / 180 * 0.45;
    rotRef.current = { x: targetX, y: targetY };
    velRef.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    // Retina DPI scaling setup
    const updateSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = parent.clientWidth;
      const displayHeight = parent.clientHeight;

      canvas.width = Math.floor(displayWidth * dpr);
      canvas.height = Math.floor(displayHeight * dpr);
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      ctx.scale(dpr, dpr);
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    // Generate balanced Fibonacci sphere point grid (uncluttered density)
    const NUM_POINTS = 220;
    const spherePoints: { phi: number; theta: number; isIndia: boolean }[] = [];

    for (let i = 0; i < NUM_POINTS; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / NUM_POINTS);
      const theta = Math.PI * (1 + 5 ** 0.5) * i;

      const latDeg = 90 - (phi * 180) / Math.PI;
      const lngDeg = (((theta * 180) / Math.PI) % 360 + 360) % 360;
      const isIndia = latDeg >= 8 && latDeg <= 36 && lngDeg >= 68 && lngDeg <= 96;

      spherePoints.push({ phi, theta, isIndia });
    }

    let frame = 0;

    const render = () => {
      frame++;

      // Rotation physics with damping
      if (!isDraggingRef.current) {
        if (autoRotate) {
          rotRef.current.y += 0.002;
        } else {
          rotRef.current.x += velRef.current.x;
          rotRef.current.y += velRef.current.y;
          velRef.current.x *= 0.94;
          velRef.current.y *= 0.94;
        }
      }

      // Display dimensions
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.38;

      ctx.clearRect(0, 0, width, height);

      // 1. Sleek atmospheric outer aura (radial glow)
      const auraGrad = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius * 1.35);
      auraGrad.addColorStop(0, "rgba(16, 185, 129, 0.12)");
      auraGrad.addColorStop(0.5, "rgba(5, 150, 105, 0.05)");
      auraGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // 2. Clean sphere boundary rim
      ctx.strokeStyle = "rgba(52, 211, 153, 0.22)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Trigonometric values for rotation matrix
      const cosY = Math.cos(rotRef.current.y);
      const sinY = Math.sin(rotRef.current.y);
      const cosX = Math.cos(rotRef.current.x);
      const sinX = Math.sin(rotRef.current.x);

      // Project 3D vector onto 2D screen
      const project = (x3d: number, y3d: number, z3d: number) => {
        // Y-axis rotation
        const x1 = x3d * cosY + z3d * sinY;
        const z1 = -x3d * sinY + z3d * cosY;
        // X-axis rotation
        const y2 = y3d * cosX - z1 * sinX;
        const z2 = y3d * sinX + z1 * cosX;

        return {
          px: cx + x1 * radius,
          py: cy + y2 * radius,
          pz: z2,
        };
      };

      // 3. Elegant latitude rings (Equator, Tropics)
      const latAngles = [-30, 0, 30];
      latAngles.forEach((latDeg) => {
        const phi = ((90 - latDeg) * Math.PI) / 180;
        const ringR = Math.sin(phi);
        const ringY = Math.cos(phi);
        const steps = 48;

        ctx.beginPath();
        let first = true;
        for (let s = 0; s <= steps; s++) {
          const theta = (s / steps) * Math.PI * 2;
          const x3d = ringR * Math.cos(theta);
          const y3d = ringY;
          const z3d = ringR * Math.sin(theta);
          const p = project(x3d, y3d, z3d);

          if (p.pz > -0.2) {
            if (first) {
              ctx.moveTo(p.px, p.py);
              first = false;
            } else {
              ctx.lineTo(p.px, p.py);
            }
          } else {
            first = true;
          }
        }
        ctx.strokeStyle = latDeg === 0 ? "rgba(52, 211, 153, 0.25)" : "rgba(16, 185, 129, 0.10)";
        ctx.lineWidth = latDeg === 0 ? 1.2 : 0.8;
        ctx.setLineDash(latDeg === 0 ? [4, 4] : [2, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 4. Subtle Orbital Tracking Ring (Tilted Satellite Ring)
      ctx.save();
      ctx.beginPath();
      const orbitTilt = 0.42;
      const orbitCos = Math.cos(orbitTilt);
      const orbitSin = Math.sin(orbitTilt);
      const orbitRadius = radius * 1.18;
      let orbitFirst = true;

      for (let s = 0; s <= 60; s++) {
        const theta = (s / 60) * Math.PI * 2;
        const ox = Math.cos(theta);
        const oy = Math.sin(theta) * orbitSin;
        const oz = Math.sin(theta) * orbitCos;
        const p = project(ox * 1.18, oy * 1.18, oz * 1.18);

        if (p.pz > -0.3) {
          if (orbitFirst) {
            ctx.moveTo(p.px, p.py);
            orbitFirst = false;
          } else {
            ctx.lineTo(p.px, p.py);
          }
        } else {
          orbitFirst = true;
        }
      }
      ctx.strokeStyle = "rgba(16, 185, 129, 0.18)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Satellite bead revolving along orbit
      const satAngle = frame * 0.015;
      const satP = project(
        Math.cos(satAngle) * 1.18,
        Math.sin(satAngle) * orbitSin * 1.18,
        Math.sin(satAngle) * orbitCos * 1.18
      );
      if (satP.pz > 0) {
        ctx.fillStyle = "#34D399";
        ctx.beginPath();
        ctx.arc(satP.px, satP.py, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(52, 211, 153, 0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(satP.px, satP.py, 6, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // 5. Clean Depth-sorted holographic particle cloud
      const projectedPoints = spherePoints.map((sp) => {
        const x3d = Math.sin(sp.phi) * Math.cos(sp.theta);
        const y3d = Math.cos(sp.phi);
        const z3d = Math.sin(sp.phi) * Math.sin(sp.theta);
        const p = project(x3d, y3d, z3d);
        return { ...p, isIndia: sp.isIndia };
      });

      projectedPoints.sort((a, b) => a.pz - b.pz);

      projectedPoints.forEach((pt) => {
        if (pt.pz < -0.15) return; // Cull back half for clean clarity
        const alpha = Math.min(1, Math.max(0.08, (pt.pz + 0.8) / 1.6));

        ctx.beginPath();
        if (pt.isIndia) {
          const ptSize = pt.pz > 0.3 ? 2.8 : 1.8;
          ctx.arc(pt.px, pt.py, ptSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(52, 211, 153, ${alpha * 0.9})`;
        } else {
          const ptSize = pt.pz > 0.3 ? 1.5 : 1.0;
          ctx.arc(pt.px, pt.py, ptSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(148, 163, 184, ${alpha * 0.35})`;
        }
        ctx.fill();
      });

      // 6. Geographic cluster telemetry markers (Minimalist, Uncluttered)
      INDIAN_NODES.forEach((node) => {
        const isSelected = selectedNode.id === node.id;
        const phi = ((90 - node.lat) * Math.PI) / 180;
        const theta = ((node.lng + 180) * Math.PI) / 180;

        const nx = Math.sin(phi) * Math.cos(theta);
        const ny = Math.cos(phi);
        const nz = Math.sin(phi) * Math.sin(theta);

        const p = project(nx, ny, nz);

        // Render front-facing pins cleanly
        if (p.pz > 0) {
          const pulse = (Math.sin(frame * 0.08) + 1) * 2;

          if (isSelected) {
            // Selected node: High-visibility glowing beacon & radar ring
            ctx.beginPath();
            ctx.arc(p.px, p.py, 8 + pulse, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(52, 211, 153, 0.85)";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(p.px, p.py, 4, 0, Math.PI * 2);
            ctx.fillStyle = "#34D399";
            ctx.fill();

            // Minimalist crosshair reticle
            ctx.strokeStyle = "rgba(52, 211, 153, 0.7)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.px - 14, p.py);
            ctx.lineTo(p.px - 6, p.py);
            ctx.moveTo(p.px + 6, p.py);
            ctx.lineTo(p.px + 14, p.py);
            ctx.moveTo(p.px, p.py - 14);
            ctx.lineTo(p.px, p.py - 6);
            ctx.moveTo(p.px, p.py + 6);
            ctx.lineTo(p.px, p.py + 14);
            ctx.stroke();
          } else {
            // Non-selected nodes: subtle, clean, non-intrusive glowing dots
            ctx.beginPath();
            ctx.arc(p.px, p.py, 3, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(16, 185, 129, 0.75)";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(p.px, p.py, 6, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(16, 185, 129, 0.35)";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", updateSize);
    };
  }, [autoRotate, selectedNode]);

  // Touch and Mouse Drag interactions for 360-degree orbit
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };

    rotRef.current.y += dx * 0.007;
    rotRef.current.x = Math.max(-0.85, Math.min(0.85, rotRef.current.x + dy * 0.007));
    velRef.current = { x: dy * 0.0005, y: dx * 0.0005 };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      className="relative w-full h-[560px] lg:h-[620px] rounded-3xl bg-[#030d07] border border-emerald-950/80 overflow-hidden shadow-2xl flex flex-col justify-between select-none"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* HUD Top Bar: Status & Telemetry Controls */}
      <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between border-b border-emerald-950/60 bg-[#030d07]/75 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="w-4 h-4 rounded-full bg-emerald-400/40 animate-ping absolute" />
          </div>
          <div>
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
              Cadastral Spatial Network
            </div>
            <div className="font-mono text-[10px] text-stone-500">
              Geo-referenced CCTS methodology zones
            </div>
          </div>
        </div>

        {/* Orbit control toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all border ${
              autoRotate
                ? "bg-emerald-950/60 text-emerald-300 border-emerald-800"
                : "bg-white/5 text-stone-400 border-white/10 hover:text-white"
            }`}
          >
            {autoRotate ? "Auto-Orbit: ON" : "Auto-Orbit: OFF"}
          </button>
        </div>
      </div>

      {/* 3D Canvas with drag-to-orbit listener */}
      <div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Floating Glassmorphic Inspector for Selected Node */}
      <div className="relative z-10 mx-4 sm:mx-6 mb-2 pointer-events-none">
        <div className="pointer-events-auto max-w-sm rounded-2xl bg-black/60 border border-emerald-900/60 p-3.5 backdrop-blur-xl shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-mono font-bold text-xs text-white uppercase tracking-wider">
                {selectedNode.state} • {selectedNode.name}
              </span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
              {selectedNode.factor}
            </span>
          </div>

          <div className="text-[11px] text-stone-300 flex items-center justify-between font-mono pt-1 border-t border-emerald-950/60">
            <span className="text-stone-400">PRACTICE:</span>
            <span className="text-emerald-300 font-semibold">{selectedNode.practice}</span>
          </div>

          <div className="text-[10px] text-stone-400 flex items-center justify-between font-mono">
            <span>AGRO ZONE:</span>
            <span className="text-stone-300">{selectedNode.zone}</span>
          </div>

          <div className="text-[10px] text-stone-400 flex items-center justify-between font-mono">
            <span>AUDIT PROTOCOL:</span>
            <span className="text-stone-300">{selectedNode.protocol}</span>
          </div>
        </div>
      </div>

      {/* Bottom Region Quick Select Pills */}
      <div className="relative z-10 p-3 sm:p-4 border-t border-emerald-950/60 bg-[#030d07]/85 backdrop-blur-md">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-[10px] font-mono uppercase text-stone-500 whitespace-nowrap mr-1">
            Focus Zone:
          </span>
          {INDIAN_NODES.map((node) => {
            const isSelected = selectedNode.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => focusOnNode(node)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-emerald-500 text-stone-950 font-bold shadow-sm ring-1 ring-emerald-400"
                    : "bg-white/5 text-stone-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSelected ? "bg-stone-950" : "bg-emerald-400"
                  }`}
                />
                <span>{node.state}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
