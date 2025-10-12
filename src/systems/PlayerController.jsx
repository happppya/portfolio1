import {useRef} from 'react'
import {RigidBody} from '@react-three/rapier'
import {useFrame, useLoader} from '@react-three/fiber'
import * as THREE from 'three'
import {useFBX, useKeyboardControls} from '@react-three/drei'
import {useEffect} from 'react'
import {clamp, lerp} from 'three/src/math/MathUtils.js'

import { Emitter } from '../services/ParticleService'

const Character = () => {

    const pearto = useFBX('models/pearto.fbx')

    const box = new THREE
        .Box3()
        .setFromObject(pearto);
    const size = new THREE.Vector3();
    box.getSize(size);
    console.log('Model size:', size);

    pearto.rotation.y = Math.PI / 2;

    return (<primitive object={pearto} scale={0.017}/>)

}

export function Player({orbitRef}) {

    const rigidBody = useRef();
    const container = useRef();
    const character = useRef();

    const offset = new THREE.Vector3(-5, 10, 0);
    const dampingSpeed = 20;

    const speed = 12;
    const acceleration = 0.2;
    const jumpPower = 10;
    const onGround = useRef(true);

    const walkTime = useRef(0);

    const [,
        getInput] = useKeyboardControls();

    let ticks = 0;
    let lastPosition = new THREE.Vector3(0, 0, 0);

    useFrame(({
        camera
    }, delta) => {

        ticks += 1;

        const orbitControls = orbitRef.current;
        const body = rigidBody.current;

        if (!body) 
            return;
        
        const dampedAlpha = 1 - Math.exp(-dampingSpeed * delta);

        const cameraWorldQuat = camera.getWorldQuaternion(new THREE.Quaternion());

        // extract yaw from quaternion
        const cameraEuler = new THREE
            .Euler()
            .setFromQuaternion(cameraWorldQuat, 'YXZ'); // Y = up
        const cameraYaw = cameraEuler.y;

        const cameraFacing = new THREE.Quaternion();
        cameraFacing.setFromAxisAngle(new THREE.Vector3(0, 1, 0), cameraYaw);

        const position = body.translation();
        const positionDelta = new THREE
            .Vector3()
            .subVectors(position, lastPosition);
        positionDelta.y = 0;
        const movementDelta = positionDelta.lengthSq() > 0.01;

        const currentInput = getInput();
        const isInputtingWalk = (currentInput.left || currentInput.right || currentInput.forward || currentInput.backward);

        lastPosition = position;

        // movement
        const inputMovementVector = new THREE.Vector3((currentInput.right
            ? 1
            : 0) + (currentInput.left
            ? -1
            : 0), 0, (currentInput.backward
            ? 1
            : 0) + (currentInput.forward
            ? -1
            : 0));

        const currentCharacterVelocity = body.linvel();

        inputMovementVector.multiplyScalar(speed);
        inputMovementVector.applyQuaternion(cameraFacing);

        let newYVelocity = currentCharacterVelocity.y;

        if (currentInput.jump && onGround.current) { // jumping
            newYVelocity = jumpPower;
        }

        const newCharacterVelocity = {
            x: lerp(currentCharacterVelocity.x, inputMovementVector.x, acceleration),
            y: newYVelocity,
            z: lerp(currentCharacterVelocity.z, inputMovementVector.z, acceleration)
        }

        body.setLinvel(newCharacterVelocity, true);

        if (movementDelta > 0.01 && onGround) {

            // rotation

            positionDelta.normalize();

            const targetRotation = new THREE.Quaternion();
            targetRotation.setFromUnitVectors(new THREE.Vector3(0, 0, 1), // character forward in local space
                    positionDelta);

            const currentRotation = body.rotation();
            const newCharacterRotation = new THREE.Quaternion();
            newCharacterRotation
                .copy(currentRotation)
                .slerp(targetRotation, 0.2);

            body.setRotation(newCharacterRotation);

            // proc walk animation

        }
        
        let bob;
        let tilt;

        if (isInputtingWalk && onGround.current) {
            walkTime.current += delta;
            bob = Math.sin(walkTime.current * 50) * 0.1;
            tilt = Math.sin(walkTime.current * 25) * 0.1;
        } else {
            bob = 0;
            tilt = 0;
        }

        bob -= 0.32;

        character.current.position.y = bob;
        character.current.rotation.z = tilt;
        // camera

        orbitControls
            .target
            .lerp(position, dampedAlpha);

        camera
            .position
            .copy(orbitControls.target)
            .add(offset);

        orbitControls.update();

        offset.subVectors(camera.position, orbitControls.target);

        // debug

        if (ticks % 30 == 0) {
            //console.log(currentCharacterVelocity.y);
        }

    })

    return (
        <RigidBody
            ref={rigidBody}
            type="dynamic"
            colliders="cuboid"
            mass={5}
            restitution={0}
            friction={0}
            position={[0, 8, 0]}
            onCollisionEnter={(e) => {
            if (e.other.rigidBodyObject
                ?.name == "ground") {
                onGround.current = true;
            }
        }}
            onCollisionExit={(e) => {
            if (e.other.rigidBodyObject
                ?.name == "ground") {
                onGround.current = false;
            }
        }}>
            <group ref={container}>
                <group ref={character}>
                    <Character/>
                    <Emitter/>
                </group>
            </group>
        </RigidBody>
    )
}
