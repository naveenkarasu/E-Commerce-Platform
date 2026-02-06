import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function ShoppingBag({ position, color, speed, rotSpeed }: {
  position: [number, number, number]
  color: string
  speed: number
  rotSpeed: number
}) {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotSpeed * 0.003
      meshRef.current.rotation.y += rotSpeed * 0.005
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.4 + position[0]) * 0.4
    }
  })

  return (
    <group ref={meshRef} position={position}>
      <mesh>
        <boxGeometry args={[0.5, 0.6, 0.35]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <torusGeometry args={[0.15, 0.02, 8, 16, Math.PI]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

function GiftBox({ position, color, speed, rotSpeed }: {
  position: [number, number, number]
  color: string
  speed: number
  rotSpeed: number
}) {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotSpeed * 0.004
      meshRef.current.rotation.z += rotSpeed * 0.002
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.35 + position[2]) * 0.35
    }
  })

  return (
    <group ref={meshRef} position={position}>
      <mesh>
        <boxGeometry args={[0.45, 0.45, 0.45]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} transparent opacity={0.65} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.5, 0.06, 0.5]} />
        <meshStandardMaterial color="#f97316" roughness={0.3} metalness={0.5} transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

function Scene() {
  const items = useMemo(() => {
    const colors = ['#f97316', '#ea580c', '#1e3a8a', '#2563eb', '#fb923c', '#1d4ed8', '#fdba74', '#3b82f6']
    return Array.from({ length: 15 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4 - 2,
      ] as [number, number, number],
      color: colors[i % colors.length],
      speed: 0.4 + Math.random() * 0.6,
      rotSpeed: 0.5 + Math.random() * 1,
      type: i % 2 === 0 ? 'bag' : 'gift',
    }))
  }, [])

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} />
      <pointLight position={[-5, 3, 2]} intensity={0.3} color="#f97316" />
      <pointLight position={[5, -3, 2]} intensity={0.2} color="#1e3a8a" />
      {items.map((item, i) =>
        item.type === 'bag' ? (
          <ShoppingBag key={i} position={item.position} color={item.color} speed={item.speed} rotSpeed={item.rotSpeed} />
        ) : (
          <GiftBox key={i} position={item.position} color={item.color} speed={item.speed} rotSpeed={item.rotSpeed} />
        )
      )}
    </>
  )
}

export function FloatingProducts3D() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} style={{ background: 'transparent' }}>
        <fog attach="fog" args={['#172554', 7, 16]} />
        <Scene />
      </Canvas>
    </div>
  )
}
