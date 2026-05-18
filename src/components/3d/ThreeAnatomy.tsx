"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import React, { useRef, Suspense, useState, Component, ReactNode } from "react";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/useIsMobile";

// WebGL 지원 여부 체크 유틸리티
const checkWebGL = () => {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
};

// 3D 캔버스 크래시를 방지하는 에러 바운더리
class WebGLErrorBoundary extends Component<{children: ReactNode, fallback: ReactNode}, {hasError: boolean}> {
  constructor(props: {children: ReactNode, fallback: ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.warn("WebGL Error caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <>{this.props.fallback}</>;
    }
    return <>{this.props.children}</>;
  }
}

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
  const [hasWebGL] = useState(checkWebGL);

  const fallbackUI = (
    <div className="text-stone-500 text-center p-8 border border-stone-200 rounded-3xl bg-white shadow-sm z-10 flex flex-col items-center justify-center max-w-sm mx-auto">
      <svg className="w-12 h-12 mb-4 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      <p className="font-medium text-stone-600">
        {!hasWebGL 
          ? "WebGL이 비활성화되어 3D 뷰어를 렌더링할 수 없습니다." 
          : "성능 유지를 위해 모바일 기기에서는 3D 뷰어가 비활성화됩니다."}
      </p>
    </div>
  );

  return (
    <section id="anatomy" className="h-screen w-full bg-stone-50 relative flex flex-col justify-center items-center overflow-hidden border-b border-stone-200">
      <div className="absolute top-24 left-6 md:left-12 z-10 pointer-events-none">
        <h2 className="text-5xl md:text-7xl font-bold text-stone-900 mb-4">해부학적 구조.</h2>
        <p className="text-xl text-stone-500 max-w-md break-keep">
          직접 회전시키고 확대하여 자세한 구조를 살펴보세요. (현재 3D 플레이스홀더 표시 중)
        </p>
      </div>

      {isMobile || !hasWebGL ? (
        fallbackUI
      ) : (
        <div className="w-full h-full cursor-grab active:cursor-grabbing">
          <WebGLErrorBoundary fallback={<div className="w-full h-full flex items-center justify-center">{fallbackUI}</div>}>
            <Canvas camera={{ position: [0, 0, 40], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <Suspense fallback={null}>
                <PlaceholderMesh />
                <Environment preset="city" />
              </Suspense>
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
          </WebGLErrorBoundary>
        </div>
      )}
    </section>
  );
}
