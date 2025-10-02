import * as THREE from 'three'
import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Sky, Environment, Clouds, Cloud } from '@react-three/drei'
import { Physics, RigidBody } from '@react-three/rapier'
import { useControls } from 'leva'

import { EffectComposer, DepthOfField, Bloom, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

import { Player } from './systems/PlayerSystem.jsx'
import * as Shape from './components/SimpleShapes.jsx'

const Workspace = () => (
  <group position={[2, 3, 0]}>
    <Shape.Baseplate />
    <Shape.Sphere position={[-12, 13, 0]} />
    <Shape.Sphere position={[-9, 13, 0]} />
    <Shape.Sphere position={[-6, 13, 0]} />

    <Shape.Rect position={[0, 5, 10]} size={[16, 9, 1]} />
  </group>
)

const Overlay = () => (
  <div className="overlay">
    <h2>test</h2>
  </div>
)

export default function App() {
  const { debug } = useControls({ debug: false })
  const playerRef = useRef()

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas shadows camera={{ position: [0, 10, 10], fov: 50 }}>
        <fogExp2 attach="fog" args={['#b3bdb4', 0.01]} />

        <Suspense fallback={null}>
          <hemisphereLight intensity={0.45 * Math.PI} />
          <spotLight decay={0} angle={0.4} penumbra={1} position={[20, 30, 2.5]} castShadow shadow-bias={-0.00001} />
          <directionalLight decay={0} color="red" position={[-10, -10, 0]} intensity={1.5} />
          <Clouds material={THREE.MeshBasicMaterial}>
            <Cloud seed={10} bounds={50} volume={80} position={[40, 60, -80]} />
            <Cloud seed={10} bounds={50} volume={80} position={[-40, 70, -80]} />
          </Clouds>
          <Environment preset="city" />
          <Sky />
          <Physics debug={debug} colliders={false}>
            <Workspace />
            <Player />
          </Physics>
          <OrbitControls />
        </Suspense>
      </Canvas>

      <Overlay />
    </div>
  )
}
