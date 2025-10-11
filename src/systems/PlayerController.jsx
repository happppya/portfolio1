import { useRef } from 'react'
import { RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useKeyboardControls } from '@react-three/drei'
import { getByteBoundaryFromType } from 'three/src/nodes/core/NodeUtils.js'
import { useEffect } from 'react'

const Character = () => {
  return (
  <mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="blue" />
  </mesh>
  )
}

export function Player({orbitRef}) {

  const rigidBody = useRef();
  const container = useRef();
  const character = useRef();

  const rotationTarget = useRef(0);
  const offset = new THREE.Vector3(-5,10,0);

  const speed = 12;
  const acceleration = 0.2;
  const jumpPower = 1;
  const canJump = useRef(false);

  const [, getInput] = useKeyboardControls();

  let ticks = 0;
  
  useFrame(({ camera }) => {

    ticks += 1;

    const orbitControls = orbitRef.current;
    const body = rigidBody.current;
    if (!body) return;

    const position = body.translation();

    const targetVelocity = new THREE.Vector3()

    if (getInput().forward) targetVelocity.z -= speed
    if (getInput().backward) targetVelocity.z += speed
    if (getInput().left) targetVelocity.x -= speed
    if (getInput().right) targetVelocity.x += speed

    const currentVelocity = body.linvel()

    const newVelocityX = THREE.MathUtils.lerp(currentVelocity.x, targetVelocity.x, acceleration)
    const newVelocityZ = THREE.MathUtils.lerp(currentVelocity.z, targetVelocity.z, acceleration)

    body.setLinvel({ x: newVelocityX, y: currentVelocity.y, z: newVelocityZ }, true)

    // jump
    if (getInput().jump && canJump.current) {
      body.applyImpulse({ x: 0, y: jumpPower, z: 0 })
      canJump.current = false
    }

    // ground check
    if (position.y <= 5) canJump.current = true
    
    // CAMERA
    
    orbitControls.target.lerp(position, 0.4);
    
    //orbitRef.current.position0.lerp(position, 0.4);

    if (ticks%30 == 0) {
      console.log(orbitControls);
    }

    const newRotation = new THREE.Quaternion();
    newRotation.setFromAxisAngle(new THREE.Vector3(0,1,0), rotationTarget.current);

    body.setRotation(newRotation);

    body.rotation().y = THREE.MathUtils.lerp(
      container.current.rotation.y,
      rotationTarget.current,
      0.1
    );

    camera.position.copy(orbitControls.target).add(offset);

    orbitControls.update();

    offset.subVectors(camera.position, orbitControls.target);
      

  })

  

  return (
    <RigidBody 
    ref={rigidBody} 
    type="dynamic" 
    colliders="cuboid" mass={1} restitution={0} friction={0} position={[0, 5, 0]}>
      <group ref={container}>
        <group ref={character}>
          <Character/>
        </group>
      </group>
    </RigidBody>
  )
}
