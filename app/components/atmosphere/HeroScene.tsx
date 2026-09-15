"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ---------------------------------------------------------------------------
   Particles
   Drift, wrap and twinkle all happen in the vertex shader. The CPU never
   touches a position, so the whole field costs one draw call and no
   main-thread work per frame. This is now the entire 3D scene.
--------------------------------------------------------------------------- */
const PARTICLE_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;

  attribute float aScale;
  attribute float aSpeed;
  attribute float aPhase;

  varying float vAlpha;
  varying float vMix;

  void main() {
    vec3 p = position;

    // Rise and wrap within a fixed band so the field never empties out.
    float span = 16.0;
    p.y = mod(p.y + uTime * aSpeed + span * 0.5, span) - span * 0.5;
    p.x += sin(uTime * 0.22 + aPhase * 6.2831) * 0.4;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float depth = -mv.z;
    gl_PointSize = aScale * uPixelRatio * (70.0 / max(depth, 0.001));

    float twinkle = 0.5 + 0.5 * sin(uTime * 1.5 + aPhase * 6.2831);
    // Fade in from the near plane and out into the distance.
    vAlpha = twinkle * smoothstep(1.0, 4.0, depth) * (1.0 - smoothstep(12.0, 22.0, depth));
    vMix = aPhase;
  }
`;

const PARTICLE_FRAG = /* glsl */ `
  precision highp float;

  uniform vec3 uWarm;
  uniform vec3 uCool;

  varying float vAlpha;
  varying float vMix;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;

    float falloff = pow(1.0 - d * 2.0, 2.2);
    vec3 col = mix(uWarm, uCool, vMix);

    gl_FragColor = vec4(col, falloff * vAlpha * 0.5);
  }
`;

function Embers({ count = 850 }: { count?: number }) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uWarm: { value: new THREE.Color("#ff7a2f") },
      uCool: { value: new THREE.Color("#22e0ff") },
    }),
    []
  );

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = -Math.random() * 16;

      scales[i] = 0.35 + Math.random() * 1.15;
      speeds[i] = 0.12 + Math.random() * 0.5;
      phases[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    return geo;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: PARTICLE_VERT,
        fragmentShader: PARTICLE_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [uniforms]
  );

  const dpr = useThree((s) => s.viewport.dpr);
  useEffect(() => {
    uniforms.uPixelRatio.value = Math.min(dpr, 2);
  }, [dpr, uniforms]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

/** Eases the camera toward the pointer. Lerped, so it never feels twitchy. */
function PointerCamera() {
  useFrame((state, delta) => {
    const { camera, pointer } = state;
    const k = 1 - Math.pow(0.001, delta); // frame-rate independent lerp
    camera.position.x += (pointer.x * 0.9 - camera.position.x) * k;
    camera.position.y += (pointer.y * 0.55 - camera.position.y) * k;
    camera.lookAt(0, 0, -6);
  });
  return null;
}

export default function HeroScene({ active = true }: { active?: boolean }) {
  // rAF is throttled in background tabs but not reliably stopped, and a
  // running scene in a tab nobody is looking at is pure waste.
  const [hidden, setHidden] = useState(
    typeof document !== "undefined" ? document.hidden : false
  );

  useEffect(() => {
    const onChange = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  return (
    <Canvas
      // Never render off-screen, and never in a hidden tab.
      frameloop={active && !hidden ? "always" : "never"}
      // Zoom fires a burst of resize events; without this the drawing buffer
      // is reallocated for every intermediate step.
      resize={{ debounce: 200, scroll: false }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 58, near: 0.1, far: 40 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ pointerEvents: "none" }}
    >
      <PointerCamera />
      <Embers />
    </Canvas>
  );
}
