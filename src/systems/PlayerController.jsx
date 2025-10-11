import { useRef } from 'react'
import { RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useKeyboardControls } from '@react-three/drei'

const Character = () => {
  return (<mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="blue" />
  </mesh>)
}

export function Player() {

  const rigidBody = useRef()
  const container = useRef()
  const character = useRef()
  const cameraTarget = useRef()
  const cameraPosition = useRef()

  const velocity = new THREE.Vector3()
  const speed = 12
  const jumpPower = 1
  const canJump = useRef(false)

  const [, getInput] = useKeyboardControls();
  
  useFrame(({ camera }) => {

    const body = rigidBody.current
    if (!body) return

    const targetVelocity = new THREE.Vector3()

    if (getInput().forward) targetVelocity.z -= speed
    if (getInput().backward) targetVelocity.z += speed
    if (getInput().left) targetVelocity.x -= speed
    if (getInput().right) targetVelocity.x += speed

    const currentVelocity = body.linvel()

    const accel = 0.2
    const newVelX = THREE.MathUtils.lerp(currentVelocity.x, targetVelocity.x, accel)
    const newVelZ = THREE.MathUtils.lerp(currentVelocity.z, targetVelocity.z, accel)

    body.setLinvel({ x: newVelX, y: currentVelocity.y, z: newVelZ })

    // jump
    const pos = body.translation()
    if (getInput().jump && canJump.current) {
      body.applyImpulse({ x: 0, y: jumpPower, z: 0 })
      canJump.current = false
    }

    // ground check
    if (pos.y <= 5) canJump.current = true
    
    pos.y += 10;
    camera.position.lerp(pos, 1);

  })

  return (
    <RigidBody ref={rigidBody} type="dynamic" colliders="cuboid" mass={1} restitution={0} friction={0} position={[0, 5, 0]}>
      <group ref={container}>
        <group ref={cameraTarget} position-z={1.5} />
        <group ref={cameraPosition} position-y={4} position-z={-4} />
        <group ref={character}>
          <Character/>
        </group>
      </group>
    </RigidBody>
  )
}
