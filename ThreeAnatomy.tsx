"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/useIsMobile";

function PlaceholderMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[10, 3, 100, 16]} />
      <meshStandardMaterial 
        color="#333333" 
        wireframe={true} 
        emissive="#000000"
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

export default function ThreeAnatomy() {
  const isMobile = useIsMobile();

  return (
    <section id="anatomy" className="h-screen w-full bg-stone-50 relative flex flex-col justify-center items-center overflow-hidden border-b border-stone-200">
      <div className="absolute top-24 left-6 md:left-12 z-10 pointer-events-none">
        <h2 className="text-5xl md:text-7xl font-bold text-stone-900 mb-4">해부학적 구조.</h2>
        <p className="text-xl text-stone-500 max-w-md break-keep">
          직접 회전시키고 확대하여 자세한 구조를 살펴보세요. (현재 3D 플레이스홀더 표시 중)
        </p>
      </div>

      {isMobile ? (
        <div className="text-stone-500 text-center p-6 border border-stone-200 rounded-3xl bg-white shadow-sm">
          <p>성능 유지를 위해 모바일 기기에서는 인터랙티브 3D 시각화가 비활성화됩니다.</p>
        </div>
      ) : (
        <div className="w-full h-full cursor-grab active:cursor-grabbing">
          <Canvas camera={{ position: [0, 0, 40], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Suspense fallback={null}>
              <PlaceholderMesh />
              <Environment preset="city" />
            </Suspense>
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
        </div>
      )}
    </section>
  );
}
