import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function CartBody() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Cart basket */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.4, 0.8, 0.9]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.4} metalness={0.6} transparent opacity={0.5} />
      </mesh>
      {/* Cart handle */}
      <mesh position={[-0.9, 0.5, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Wheels */}
      <mesh position={[-0.5, -0.55, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
        <meshStandardMaterial color="#78716c" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0.5, -0.55, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
        <meshStandardMaterial color="#78716c" roughness={0.5} metalness={0.3} />
      </mesh>
    </group>
  )
}

function FloatingItem({ position, color, delay }: {
  position: [number, number, number]
  color: string
  delay: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime + delay
      meshRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.5 + 0.5
      meshRef.current.rotation.x = t * 0.5
      meshRef.current.rotation.z = t * 0.3
      meshRef.current.scale.setScalar(0.8 + Math.sin(t * 0.6) * 0.15)
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.25, 0.25, 0.25]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} transparent opacity={0.6} />
    </mesh>
  )
}

export function EmptyCartScene() {
  const items = useMemo(() => {
    const colors = ['#f97316', '#ea580c', '#1e3a8a', '#fb923c', '#2563eb']
    return Array.from({ length: 5 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 2,
        0.5 + Math.random() * 0.5,
        (Math.random() - 0.5) * 1,
      ] as [number, number, number],
      color: colors[i],
      delay: i * 1.2,
    }))
  }, [])

  return (
    <div className="w-full h-48 rounded-xl overflow-hidden">
      <Canvas camera={{ position: [0, 1, 4], fov: 40 }} style={{ background: 'transparent' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 5, 3]} intensity={0.7} />
        <pointLight position={[-2, 2, 1]} intensity={0.3} color="#f97316" />
        <CartBody />
        {items.map((item, i) => (
          <FloatingItem key={i} {...item} />
        ))}
      </Canvas>
    </div>
  )
}
