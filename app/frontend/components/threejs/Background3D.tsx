import * as THREE from 'three';
import { Environment, Float, Sphere } from '@react-three/drei';
import Bitcoin3D from './Bitcoin3D'
import CurrencySymbol3D from './CurrencySymbol3D';

export default function Background3D() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />

      <Bitcoin3D position={[0, 1, -2]} scale={1.5} />
      <CurrencySymbol3D symbol="€" position={[-3, 0.5, -3]} color="#0066cc" />
      <CurrencySymbol3D symbol="$" position={[3, -0.5, -3]} color="#00cc66" />
      <CurrencySymbol3D symbol="R$" position={[0, -1.5, -4]} color="#ffcc00" />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Float key={i} speed={0.5 + Math.random()} rotationIntensity={0.2} floatIntensity={0.2}>
          <Sphere
            position={[(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10 - 5]}
            args={[0.02]}
          >
            <meshStandardMaterial color="#00ffff" transparent opacity={0.6} />
          </Sphere>
        </Float>
      ))}

      <Environment preset="night" />
    </>
  )
}