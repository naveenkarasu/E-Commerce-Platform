import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function CategoryItem({ position, color, label, shape }: {
  position: [number, number, number]
  color: string
  label: string
  shape: 'box' | 'cylinder' | 'book'
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} position={position}>
        <mesh castShadow>
          {shape === 'box' && <boxGeometry args={[0.8, 0.8, 0.8]} />}
          {shape === 'cylinder' && <cylinderGeometry args={[0.4, 0.4, 1, 16]} />}
          {shape === 'book' && <boxGeometry args={[0.7, 0.9, 0.15]} />}
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} />
        </mesh>
        <Text
          position={[0, -1, 0]}
          fontSize={0.25}
          color="#1c1917"
          anchorX="center"
          anchorY="top"
          font={undefined}
        >
          {label}
        </Text>
      </group>
    </Float>
  )
}

export function CategoryShowcase() {
  return (
    <div className="w-full h-48">
      <Canvas camera={{ position: [0, 0.5, 5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <pointLight position={[-3, 2, 2]} intensity={0.3} color="#f97316" />
        <CategoryItem position={[-2.5, 0, 0]} color="#3b82f6" label="Electronics" shape="box" />
        <CategoryItem position={[0, 0, 0]} color="#e11d48" label="Clothing" shape="cylinder" />
        <CategoryItem position={[2.5, 0, 0]} color="#ea580c" label="Books" shape="book" />
        <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      </Canvas>
    </div>
  )
}
