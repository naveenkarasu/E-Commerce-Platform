import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

function ProductShape({ position, color, shape, speed }: {
  position: [number, number, number];
  color: string;
  shape: 'box' | 'cylinder' | 'cone' | 'torus';
  speed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005 * speed
      meshRef.current.rotation.y += 0.008 * speed
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.3 + position[0] * 2) * 0.3
    }
  })

  return (
    <Float speed={speed * 1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        {shape === 'box' && <boxGeometry args={[0.5, 0.5, 0.5]} />}
        {shape === 'cylinder' && <cylinderGeometry args={[0.25, 0.25, 0.6, 16]} />}
        {shape === 'cone' && <coneGeometry args={[0.3, 0.6, 16]} />}
        {shape === 'torus' && <torusGeometry args={[0.25, 0.1, 12, 24]} />}
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.4}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  )
}

function Scene() {
  const items = useMemo(() => {
    const colors = ['#f97316', '#ea580c', '#c2410c', '#fb923c', '#fdba74', '#1e40af', '#2563eb', '#3b82f6']
    const shapes: Array<'box' | 'cylinder' | 'cone' | 'torus'> = ['box', 'cylinder', 'cone', 'torus']
    return Array.from({ length: 18 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4 - 2,
      ] as [number, number, number],
      color: colors[i % colors.length],
      shape: shapes[i % shapes.length],
      speed: 0.4 + Math.random() * 0.6,
    }))
  }, [])

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} />
      <pointLight position={[-5, 3, 2]} intensity={0.3} color="#f97316" />
      <pointLight position={[5, -3, 2]} intensity={0.2} color="#1e40af" />
      {items.map((item, i) => (
        <ProductShape key={i} {...item} />
      ))}
    </>
  )
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} style={{ background: 'transparent' }}>
        <fog attach="fog" args={['#ea580c', 6, 14]} />
        <Scene />
      </Canvas>
    </div>
  )
}
