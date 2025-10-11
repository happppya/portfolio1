import { useRef } from 'react'
import { RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useKeyboardControls } from '@react-three/drei'
import { getByteBoundaryFromType } from 'three/src/nodes/core/NodeUtils.js'
import { useEffect } from 'react'
import { clamp, lerp } from 'three/src/math/MathUtils.js'

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

  const offset = new THREE.Vector3(-5,10,0);
  const dampingSpeed = 20;

  const speed = 12;
  const acceleration = 0.2;
  const jumpPower = 1;
  const canJump = useRef(false);

  const [, getInput] = useKeyboardControls();

  let ticks = 0;
  let lastPosition = new THREE.Vector3(0,0,0);
  
  useFrame(({ camera }, delta) => {

    ticks += 1;

    const orbitControls = orbitRef.current;
    const body = rigidBody.current;

    if (!body) return;

    const dampedAlpha = 1 - Math.exp(-dampingSpeed * delta);

    const cameraWorldQuat = camera.getWorldQuaternion(new THREE.Quaternion());

    // extract yaw from quaternion
    const cameraEuler = new THREE.Euler().setFromQuaternion(cameraWorldQuat, 'YXZ'); // Y = up
    const cameraYaw = cameraEuler.y;

    const cameraFacing = new THREE.Quaternion();
    cameraFacing.setFromAxisAngle(new THREE.Vector3(0,1,0), cameraYaw);

    const position = body.translation();
    const positionDelta = new THREE.Vector3().subVectors(position, lastPosition);
    positionDelta.y = 0;

    lastPosition = position;

    // movement
    const inputMovementVector = new THREE.Vector3(
      (getInput().right ? 1 : 0) + (getInput().left ? -1 : 0),
      0,
      (getInput().backward ? 1 : 0) + (getInput().forward ? -1 : 0)
    );

    const currentCharacterVelocity = body.linvel()

    inputMovementVector.multiplyScalar(speed);
    inputMovementVector.applyQuaternion(cameraFacing);

    const newCharacterVelocity = {
      x: lerp(currentCharacterVelocity.x, inputMovementVector.x, acceleration),
      y: currentCharacterVelocity.y,
      z: lerp(currentCharacterVelocity.z, inputMovementVector.z, acceleration)
    }

    body.setLinvel(newCharacterVelocity, true)

    // jump
    if (getInput().jump && canJump.current) {
      body.applyImpulse({ x: 0, y: jumpPower, z: 0 })
      canJump.current = false
    }

    // ground check
    if (position.y <= 5) canJump.current = true

    // rotation

    if (positionDelta.lengthSq() > 0.01) {
      positionDelta.normalize();

      const targetRotation = new THREE.Quaternion();
      targetRotation.setFromUnitVectors(
          new THREE.Vector3(0, 0, 1), // character forward in local space
          positionDelta
      );

      const currentRotation = body.rotation();
      const newCharacterRotation = new THREE.Quaternion();
      newCharacterRotation.copy(currentRotation).slerp(targetRotation, 0.2);

      body.setRotation(newCharacterRotation);

    }
    
    // camera

    orbitControls.target.lerp(position, dampedAlpha);
    camera.position.copy(orbitControls.target).add(offset);
    orbitControls.update();
    offset.subVectors(camera.position, orbitControls.target);
      
    // debug

    if (ticks%30 == 0) {
      
    }

  })

  return (
    <RigidBody 
    ref={rigidBody} 
    type="dynamic" 
    colliders="cuboid" mass={5} restitution={0} friction={0} position={[0, 5, 0]}>
      <group ref={container}>
        <group ref={character}>
          <Character/>
        </group>
      </group>
    </RigidBody>
  )
}
