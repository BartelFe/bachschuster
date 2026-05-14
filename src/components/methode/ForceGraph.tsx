import { useEffect, useRef, type MutableRefObject } from 'react';
import { forceSimulation, forceManyBody, forceCenter, type Simulation } from 'd3-force';
import {
  buildNodes,
  buildEdges,
  STAKEHOLDER_COLOR,
  type GraphNode,
  type GraphEdge,
  type StakeholderId,
} from './graph-data';
import { modeAtProgress } from './graph-modes';

interface ForceGraphProps {
  /** 0..1 scroll progress driving the mode interpolation (Chaos → Mediation → Struktur). */
  progressRef: MutableRefObject<number>;
  /** Currently-highlighted stakeholder, pulses matching nodes. */
  highlightRef: MutableRefObject<StakeholderId | null>;
}

/**
 * Cluster centroid offsets in normalized [-1, 1] space — multiplied by the
 * canvas's half-extent for the actual pull-target position.
 *
 * Pentagonal arrangement around centre. Mediator sits at the centre so it
 * naturally becomes the bridging node when it fades in.
 */
const CLUSTER_CENTROIDS: Record<StakeholderId, [number, number]> = {
  city: [0, -0.75], // top
  business: [0.78, -0.32], // upper-right
  citizens: [0.55, 0.72], // lower-right
  environment: [-0.55, 0.72], // lower-left
  institutional: [-0.78, -0.32], // upper-left
  mediator: [0, 0], // centre
};

const TARGET_LINK_DISTANCE = 120;

/**
 * Custom d3-force that pulls every node toward its stakeholder cluster
 * centroid. Strength is read from `progressRef.current` each tick so mode
 * transitions are continuous.
 */
function makeClusterForce(
  width: () => number,
  height: () => number,
  progressRef: MutableRefObject<number>,
) {
  let nodes: GraphNode[] = [];
  function force(alpha: number) {
    const k = modeAtProgress(progressRef.current).forces.clusterStrength;
    const w = width();
    const h = height();
    for (const node of nodes) {
      const c = CLUSTER_CENTROIDS[node.stakeholder];
      const targetX = w * 0.5 + c[0] * w * 0.32;
      const targetY = h * 0.5 + c[1] * h * 0.34;
      node.vx! += (targetX - (node.x ?? 0)) * k * alpha;
      node.vy! += (targetY - (node.y ?? 0)) * k * alpha;
    }
  }
  (force as unknown as { initialize: (n: GraphNode[]) => void }).initialize = (n) => {
    nodes = n;
  };
  return force as unknown as Parameters<Simulation<GraphNode, undefined>['force']>[1];
}

/**
 * Custom edge force that supports per-edge strength by kind. Reads the
 * current mode from `progressRef` so the strength lerps as the user scrolls.
 *
 * Spring-style: each edge pulls/pushes its endpoints toward `TARGET_LINK_DISTANCE`.
 */
function makeLinkForce(edges: GraphEdge[], progressRef: MutableRefObject<number>) {
  let map = new Map<string, GraphNode>();
  function force(alpha: number) {
    const forces = modeAtProgress(progressRef.current).forces;
    for (const edge of edges) {
      const src = typeof edge.source === 'string' ? map.get(edge.source) : edge.source;
      const tgt = typeof edge.target === 'string' ? map.get(edge.target) : edge.target;
      if (!src || !tgt) continue;

      const strength =
        edge.kind === 'conflict'
          ? forces.conflictLink
          : edge.kind === 'synergy'
            ? forces.synergyLink
            : forces.mediationLink;
      if (Math.abs(strength) < 0.001) continue;

      const dx = (tgt.x ?? 0) - (src.x ?? 0);
      const dy = (tgt.y ?? 0) - (src.y ?? 0);
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const delta = (dist - TARGET_LINK_DISTANCE) * strength * alpha * 0.25;
      const ux = dx / dist;
      const uy = dy / dist;
      src.vx! += ux * delta;
      src.vy! += uy * delta;
      tgt.vx! -= ux * delta;
      tgt.vy! -= uy * delta;
    }
  }
  (force as unknown as { initialize: (n: GraphNode[]) => void }).initialize = (n) => {
    map = new Map();
    for (const node of n) map.set(node.id, node);
  };
  return force as unknown as Parameters<Simulation<GraphNode, undefined>['force']>[1];
}

export function ForceGraph({ progressRef, highlightRef }: ForceGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctxRaw = canvasEl.getContext('2d');
    if (!ctxRaw) return;
    // Locals for closures — TS can't narrow refs inside requestAnimationFrame callbacks.
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = ctxRaw;

    const nodes = buildNodes();
    const edges = buildEdges(nodes);
    const nodeById = new Map<string, GraphNode>();
    for (const n of nodes) nodeById.set(n.id, n);

    // ── Size + DPR handling ─────────────────────────────────────────────
    const dprMax = 2;
    const dimsRef = { w: canvas.clientWidth || 600, h: canvas.clientHeight || 600 };
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, dprMax);
      dimsRef.w = canvas.clientWidth || dimsRef.w;
      dimsRef.h = canvas.clientHeight || dimsRef.h;
      canvas.width = Math.floor(dimsRef.w * dpr);
      canvas.height = Math.floor(dimsRef.h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    // ── Initial positioning around stakeholder centroids ────────────────
    for (const node of nodes) {
      const c = CLUSTER_CENTROIDS[node.stakeholder];
      node.x = dimsRef.w * 0.5 + c[0] * dimsRef.w * 0.32 + (Math.random() - 0.5) * 60;
      node.y = dimsRef.h * 0.5 + c[1] * dimsRef.h * 0.34 + (Math.random() - 0.5) * 60;
    }

    // ── Forces ──────────────────────────────────────────────────────────
    const cluster = makeClusterForce(
      () => dimsRef.w,
      () => dimsRef.h,
      progressRef,
    );
    const link = makeLinkForce(edges, progressRef);

    const sim: Simulation<GraphNode, undefined> = forceSimulation(nodes)
      .force('charge', forceManyBody<GraphNode>().strength(-300).distanceMax(420))
      .force('center', forceCenter(dimsRef.w / 2, dimsRef.h / 2).strength(0.04))
      .force('cluster', cluster)
      .force('link', link)
      .alphaDecay(0.012)
      .alphaMin(0.001)
      .velocityDecay(0.42);

    // ── Render loop ─────────────────────────────────────────────────────
    let raf = 0;
    let lastProgress = -1;
    let lastHighlight: StakeholderId | null | undefined;
    function draw() {
      raf = requestAnimationFrame(draw);

      const progress = progressRef.current;
      const highlight = highlightRef.current;
      const alpha = sim.alpha();
      const isIdle =
        alpha <= 0.0015 && !dragged && progress === lastProgress && highlight === lastHighlight;
      if (isIdle) return;
      lastProgress = progress;
      lastHighlight = highlight;

      const { forces, visuals } = modeAtProgress(progress);

      // Update strength-only forces that don't require re-init.
      const charge = sim.force('charge') as ReturnType<typeof forceManyBody<GraphNode>>;
      if (charge) charge.strength(forces.manyBody);
      const center = sim.force('center') as ReturnType<typeof forceCenter>;
      if (center) center.strength(forces.centerStrength);

      ctx.clearRect(0, 0, dimsRef.w, dimsRef.h);

      // Subtle background shade (paper-ish during Struktur, near-zero in Chaos).
      if (visuals.backgroundShade > 0.005) {
        ctx.fillStyle = `rgba(123, 166, 89, ${visuals.backgroundShade})`;
        ctx.fillRect(0, 0, dimsRef.w, dimsRef.h);
      }

      // ── Edges ─────────────────────────────────────────────────────────
      ctx.lineCap = 'round';
      for (const edge of edges) {
        const src = typeof edge.source === 'string' ? nodeById.get(edge.source) : edge.source;
        const tgt = typeof edge.target === 'string' ? nodeById.get(edge.target) : edge.target;
        if (!src || !tgt || src.x == null || tgt.x == null) continue;

        let opacity = 0;
        let color = '#ffffff';
        let lineWidth = 1.2;
        if (edge.kind === 'conflict') {
          opacity = visuals.conflictOpacity;
          color = '#DC2626';
          lineWidth = 1.4;
        } else if (edge.kind === 'synergy') {
          opacity = visuals.synergyOpacity;
          color = '#D6B547';
          lineWidth = 1.6;
        } else if (edge.kind === 'mediation') {
          opacity = visuals.mediationOpacity;
          color = '#F2EDE2';
          lineWidth = 1.1;
        }

        if (opacity < 0.02) continue;

        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = lineWidth;
        if (edge.kind === 'conflict') {
          ctx.setLineDash([6, 4]);
          ctx.lineDashOffset = -performance.now() / 60;
        } else {
          ctx.setLineDash([]);
        }

        ctx.beginPath();
        ctx.moveTo(src.x, src.y!);
        ctx.lineTo(tgt.x, tgt.y!);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      // ── Nodes ─────────────────────────────────────────────────────────
      const hi = highlight;
      for (const node of nodes) {
        if (node.x == null || node.y == null) continue;

        const isMediator = node.stakeholder === 'mediator';
        const alpha = isMediator ? visuals.mediatorOpacity : 1;
        if (alpha < 0.02) continue;
        ctx.globalAlpha = alpha;

        const highlighted = hi != null && node.stakeholder === hi;
        const scale = highlighted ? 1.32 : 1;
        const r = node.radius * scale;
        const color = STAKEHOLDER_COLOR[node.stakeholder];

        // Soft glow halo via shadow.
        ctx.shadowColor = color;
        ctx.shadowBlur = highlighted ? 22 : isMediator ? 18 : 10;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Inner highlight for mediator + highlighted nodes.
        if (isMediator || highlighted) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.beginPath();
          ctx.arc(node.x - r * 0.25, node.y - r * 0.25, r * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }
    raf = requestAnimationFrame(draw);

    // ── Drag interaction ────────────────────────────────────────────────
    let dragged: GraphNode | null = null;
    function hitTest(x: number, y: number): GraphNode | null {
      // Iterate back-to-front so visually-on-top nodes win.
      for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i]!;
        if (node.x == null || node.y == null) continue;
        const dx = x - node.x;
        const dy = y - node.y;
        const rr = node.radius * 1.2;
        if (dx * dx + dy * dy <= rr * rr) return node;
      }
      return null;
    }
    function pointerXY(e: PointerEvent): [number, number] {
      const rect = canvas.getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top];
    }
    function onDown(e: PointerEvent) {
      const [x, y] = pointerXY(e);
      const node = hitTest(x, y);
      if (!node) return;
      dragged = node;
      node.fx = node.x;
      node.fy = node.y;
      canvas.setPointerCapture(e.pointerId);
      sim.alphaTarget(0.45).restart();
    }
    function onMove(e: PointerEvent) {
      if (!dragged) return;
      const [x, y] = pointerXY(e);
      dragged.fx = x;
      dragged.fy = y;
    }
    function onUp(e: PointerEvent) {
      if (!dragged) return;
      dragged.fx = null;
      dragged.fy = null;
      dragged = null;
      sim.alphaTarget(0);
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    }

    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    // ── Resize observer ─────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      resize();
      const c = sim.force('center') as ReturnType<typeof forceCenter>;
      if (c) c.x(dimsRef.w / 2).y(dimsRef.h / 2);
      sim.alpha(0.3).restart();
    });
    ro.observe(canvas);

    // Hover cursor over nodes — feels like they're interactive.
    function onHover(e: PointerEvent) {
      if (dragged) return;
      const [x, y] = pointerXY(e);
      canvas.style.cursor = hitTest(x, y) ? 'grab' : 'default';
    }
    canvas.addEventListener('pointermove', onHover);

    return () => {
      cancelAnimationFrame(raf);
      sim.stop();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onHover);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      ro.disconnect();
    };
  }, [progressRef, highlightRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ touchAction: 'none' }}
      aria-label="Strukturplanung — Stakeholder-Force-Graph"
    />
  );
}
