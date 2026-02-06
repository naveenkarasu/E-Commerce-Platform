import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Product } from '@/types';

interface ProductViewer3DProps {
  product: Product;
}

const categoryColors: Record<string, string> = {
  Electronics: '#4f46e5',
  Clothing: '#e11d48',
  Books: '#ea580c',
};

const categoryShapes: Record<string, 'box' | 'cylinder' | 'book'> = {
  Electronics: 'box',
  Clothing: 'cylinder',
  Books: 'book',
};

function ProductModel({ product }: { product: Product }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = categoryColors[product.category] || '#6b7280';
  const shape = categoryShapes[product.category] || 'box';

  // Vary dimensions slightly based on product price (just for visual variety)
  const scale = useMemo(() => {
    const base = 0.8 + (product.price % 100) / 200;
    return base;
  }, [product.price]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  const geometry = useMemo(() => {
    switch (shape) {
      case 'cylinder':
        return <cylinderGeometry args={[0.6 * scale, 0.6 * scale, 1.2 * scale, 32]} />;
      case 'book':
        return <boxGeometry args={[1.0 * scale, 1.4 * scale, 0.15 * scale]} />;
      default:
        return <boxGeometry args={[1.0 * scale, 0.7 * scale, 1.0 * scale]} />;
    }
  }, [shape, scale]);

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow position={[0, 0.5, 0]}>
        {geometry}
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.4}
          envMapIntensity={0.8}
        />
      </mesh>
      <Text
        position={[0, 2, 0]}
        fontSize={0.18}
        color="#374151"
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
        textAlign="center"
        font={undefined}
      >
        {product.name}
      </Text>
    </Float>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#d1d5db" wireframe />
    </mesh>
  );
}

export function ProductViewer3D({ product }: ProductViewer3DProps) {
  return (
    <div className="w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-b from-stone-50 to-stone-100 border border-stone-200">
      <Canvas
        shadows
        camera={{ position: [3, 2, 3], fov: 45 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.3} />

        <Suspense fallback={<LoadingFallback />}>
          <ProductModel product={product} />
          <Environment preset="city" />
        </Suspense>

        <ContactShadows
          position={[0, -0.5, 0]}
          opacity={0.4}
          scale={5}
          blur={2}
          far={4}
        />

        {/* Floor grid */}
        <gridHelper args={[6, 12, '#e5e7eb', '#f3f4f6']} position={[0, -0.5, 0]} />

        <OrbitControls
          makeDefault
          autoRotate
          autoRotateSpeed={2}
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={2.5}
          maxDistance={7}
        />
      </Canvas>
    </div>
  );
}
