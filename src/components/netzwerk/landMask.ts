import { geoEquirectangular, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import land50 from 'world-atlas/land-50m.json';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { FeatureCollection, Geometry } from 'geojson';
import { CanvasTexture, LinearFilter, RepeatWrapping, SRGBColorSpace } from 'three';

/**
 * Render the Natural Earth 1:50m land polygons to an equirectangular canvas
 * and wrap it as a Three.js texture. White = land, black = ocean.
 *
 * The texture is sampled inside the earth shader to:
 *   · brighten the dot-grid where land exists, and
 *   · derive coastline glow via a 4-tap gradient.
 *
 * Rendered once at module load — the canvas is then handed to GPU and the
 * 2D-context is GCable. 2048×1024 keeps the coastlines crisp at any
 * realistic zoom but stays well under a 1MB GPU upload (~8MB RGBA, 4MB
 * with compressed mips — Three.js does its own mipmap chain).
 */
const W = 2048;
const H = 1024;

let cached: CanvasTexture | null = null;

export function getLandMaskTexture(): CanvasTexture {
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);

  // Equirectangular projection mapped onto the canvas. `geoEquirectangular`
  // defaults to a 0..2π lon × -π/2..π/2 lat space; we scale so that the
  // canvas spans the full sphere with lon = 0 at the centre — which lines
  // up with how three.js's SphereGeometry maps its UVs (u=0 at -π, u=0.5
  // at 0, u=1 at +π lon).
  const projection = geoEquirectangular()
    .scale(W / (2 * Math.PI))
    .translate([W / 2, H / 2]);

  const path = geoPath(projection, ctx);

  const topo = land50 as unknown as Topology<{ land: GeometryCollection }>;
  const landFc = feature(topo, topo.objects.land) as unknown as FeatureCollection<Geometry>;

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  for (const f of landFc.features) {
    path(f);
  }
  ctx.fill();

  cached = new CanvasTexture(canvas);
  cached.wrapS = RepeatWrapping;
  cached.wrapT = RepeatWrapping;
  cached.minFilter = LinearFilter;
  cached.magFilter = LinearFilter;
  cached.colorSpace = SRGBColorSpace;
  cached.needsUpdate = true;
  return cached;
}
