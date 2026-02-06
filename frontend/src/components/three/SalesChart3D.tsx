import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'

interface BarProps {
  position: [number, number, number]
  height: number
  color: string
  label: string
  value: number
}

function Bar({ position, height, color, label, value }: BarProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const targetScale = height
      meshRef.current.scale.y += (targetScale - meshRef.current.scale.y) * 0.05
    }
  })

  return (
    <group position={position}>
      <mesh ref={meshRef} position={[0, height / 2, 0]} scale={[1, 0.01, 1]}>
        <boxGeometry args={[0.6, 1, 0.6]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} />
      </mesh>
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.18}
        color="#172554"
        anchorX="center"
        anchorY="top"
        font={undefined}
      >
        {label}
      </Text>
      <Text
        position={[0, height + 0.2, 0]}
        fontSize={0.2}
        color="#172554"
        anchorX="center"
        anchorY="bottom"
        font={undefined}
      >
        {String(value)}
      </Text>
    </group>
  )
}

interface SalesChart3DProps {
  data?: { pending: number; processing: number; shipped: number; delivered: number }
}

export function SalesChart3D({ data }: SalesChart3DProps) {
  const chartData = data || { pending: 3, processing: 2, shipped: 4, delivered: 6 }
  const maxVal = Math.max(chartData.pending, chartData.processing, chartData.shipped, chartData.delivered, 1)

  const bars = [
    { label: 'Pending', value: chartData.pending, color: '#d97706' },
    { label: 'Processing', value: chartData.processing, color: '#f97316' },
    { label: 'Shipped', value: chartData.shipped, color: '#ea580c' },
    { label: 'Delivered', value: chartData.delivered, color: '#059669' },
  ]

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden bg-gradient-to-b from-navy-50 to-white border border-navy-100">
      <Canvas camera={{ position: [3, 3, 5], fov: 40 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={0.8} />
        <pointLight position={[-3, 2, 2]} intensity={0.3} color="#f97316" />

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[6, 4]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>

        {bars.map((bar, i) => (
          <Bar
            key={bar.label}
            position={[(i - 1.5) * 1.2, 0, 0]}
            height={(bar.value / maxVal) * 2.5}
            color={bar.color}
            label={bar.label}
            value={bar.value}
          />
        ))}

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={1.5}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
        />
      </Canvas>
    </div>
  )
}
