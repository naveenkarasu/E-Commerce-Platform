import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface TimelineNodeProps {
  position: [number, number, number]
  isCompleted: boolean
  isCurrent: boolean
  label: string
}

function TimelineNode({ position, isCompleted, isCurrent, label }: TimelineNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current && isCurrent) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1)
    }
    if (glowRef.current && (isCompleted || isCurrent)) {
      glowRef.current.scale.setScalar(1.4 + Math.sin(state.clock.elapsedTime * 1.5) * 0.2)
    }
  })

  const color = isCompleted ? '#059669' : isCurrent ? '#f97316' : '#94a3b8'

  return (
    <group position={position}>
      {(isCompleted || isCurrent) && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color={color} transparent opacity={0.2} />
        </mesh>
      )}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.6}
          emissive={isCurrent ? '#f97316' : isCompleted ? '#059669' : '#000000'}
          emissiveIntensity={isCurrent ? 0.4 : isCompleted ? 0.2 : 0}
        />
      </mesh>
      <Text
        position={[0, -0.4, 0]}
        fontSize={0.14}
        color="#172554"
        anchorX="center"
        anchorY="top"
        font={undefined}
      >
        {label}
      </Text>
    </group>
  )
}

function Connector({ from, to, isCompleted }: {
  from: [number, number, number]
  to: [number, number, number]
  isCompleted: boolean
}) {
  const midX = (from[0] + to[0]) / 2
  return (
    <mesh position={[midX, from[1], from[2]]}>
      <boxGeometry args={[Math.abs(to[0] - from[0]) - 0.3, 0.04, 0.04]} />
      <meshStandardMaterial
        color={isCompleted ? '#059669' : '#cbd5e1'}
        roughness={0.4}
        metalness={0.3}
      />
    </mesh>
  )
}

const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'] as const
const statusLabels = ['Pending', 'Processing', 'Shipped', 'Delivered']

interface OrderTimeline3DProps {
  currentStatus: string
}

export function OrderTimeline3D({ currentStatus }: OrderTimeline3DProps) {
  const currentIdx = statuses.indexOf(currentStatus as typeof statuses[number])
  const spacing = 1.5
  const startX = -((statuses.length - 1) * spacing) / 2

  return (
    <div className="w-full h-32 rounded-xl overflow-hidden bg-gradient-to-r from-navy-50 to-primary-50 border border-navy-100">
      <Canvas camera={{ position: [0, 1.5, 4], fov: 35 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 5]} intensity={0.6} />
        <pointLight position={[0, 2, 2]} intensity={0.3} color="#f97316" />

        {statuses.map((status, i) => {
          const x = startX + i * spacing
          return (
            <TimelineNode
              key={status}
              position={[x, 0, 0]}
              isCompleted={i < currentIdx}
              isCurrent={i === currentIdx}
              label={statusLabels[i]}
            />
          )
        })}

        {statuses.slice(0, -1).map((_, i) => (
          <Connector
            key={i}
            from={[startX + i * spacing, 0, 0]}
            to={[startX + (i + 1) * spacing, 0, 0]}
            isCompleted={i < currentIdx}
          />
        ))}
      </Canvas>
    </div>
  )
}
