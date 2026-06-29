'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Stars, Torus } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import type { Mesh } from 'three';

function AnimatedSphere() {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.15;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
      <Sphere ref={ref} args={[1.4, 64, 64]}>
        <MeshDistortMaterial
          color="#3b82f6"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

function OrbitRing({
  radius = 2.2,
  tilt = 0.3,
  color = '#06b6d4',
}: {
  radius?: number;
  tilt?: number;
  color?: string;
}) {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.1;
  });
  return (
    <Torus
      ref={ref}
      args={[radius, 0.015, 16, 100]}
      rotation={[Math.PI / 2 + tilt, 0, 0]}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        roughness={0.3}
        metalness={0.5}
      />
    </Torus>
  );
}

function SmallOrb({
  position,
  color,
  scale = 0.3,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3;
  });
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.7}
          emissive={color}
          emissiveIntensity={0.4}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.6} color="#06b6d4" />
      <pointLight position={[5, -5, 5]} intensity={0.6} color="#8b5cf6" />
      <pointLight position={[0, 5, -5]} intensity={0.4} color="#22d3ee" />
      <AnimatedSphere />
      <OrbitRing radius={2.2} tilt={0.3} color="#06b6d4" />
      <OrbitRing radius={2.6} tilt={-0.4} color="#8b5cf6" />
      <SmallOrb position={[-2.5, 1, -1]} color="#06b6d4" scale={0.25} />
      <SmallOrb position={[2.5, -0.5, -1]} color="#8b5cf6" scale={0.2} />
      <SmallOrb position={[2, 1.5, -2]} color="#22d3ee" scale={0.15} />
      <SmallOrb position={[-2, -1.5, -2]} color="#a78bfa" scale={0.18} />
      <Stars radius={50} depth={50} count={2000} factor={4} fade speed={1} />
    </>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
