import * as THREE from 'three';
import { useRef, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';

export default memo(function Bitcoin3D({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <cylinderGeometry args={[1, 1, 0.2, 8]} />
        <meshStandardMaterial color="#f7931a" metalness={0.8} roughness={0.2} />
        <Text
          position={[0, 0, 0.11]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          ₿
        </Text>
      </mesh>
    </Float>
  );
})