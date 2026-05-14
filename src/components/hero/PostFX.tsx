import { Vector2 } from 'three';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

/**
 * Cinematic post-processing stack — "subtle Active Theory" preset approved
 * by Felix in the W2 concept review.
 *
 *  1. Bloom — only the brightest particle clumps glow (threshold 0.85).
 *     Additive blending in `ParticleField` already pushes overlapping
 *     particles past luminance 1.0, so dense edges + the conflict pentagon
 *     light up while sparse areas stay clean.
 *  2. ChromaticAberration — 0.0008 NDC offset (~1.5 px @ 1080p). Reads as
 *     "lens" texture, not "glitch".
 *  3. Vignette — gentle 0.6 darkness with offset 0.4 keeps the eye centered.
 *
 * `multisampling={4}` gets us MSAA inside the composer (Canvas's own
 * `antialias` is bypassed once we render through an offscreen target).
 */
export function PostFX() {
  return (
    <EffectComposer multisampling={4} enableNormalPass={false}>
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.85}
        luminanceSmoothing={0.2}
        mipmapBlur
        levels={6}
        radius={0.85}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new Vector2(0.0008, 0.0008)}
        radialModulation={false}
        modulationOffset={0.15}
      />
      <Vignette offset={0.4} darkness={0.6} />
    </EffectComposer>
  );
}
