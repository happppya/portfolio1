import * as THREE from 'three'
import React from 'react'
import {RigidBody} from '@react-three/rapier'
import {TextureLoader} from 'three'
import {useLoader} from '@react-three/fiber'

export function Baseplate() {

    return (
        <RigidBody colliders="trimesh" type="fixed" name="ground">
            <mesh rotation={[0, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <cylinderGeometry args={[256, 256, 2, 32]}/>
                <meshStandardMaterial color="#1c4415"/>
            </mesh>
        </RigidBody>
    )
}

export const RectCollider = ({
    size,
    color,
    ...props
}) => (

    <RigidBody colliders="cuboid" type="fixed">
        <mesh castShadow receiveShadow {...props}>
            <boxGeometry args={size}/>
            <meshStandardMaterial color={color || "white"}/>
        </mesh>
    </RigidBody>

)

export const Rect = ({
    size,
    color,
    ...props
}) => (
    <mesh castShadow receiveShadow {...props}>
        <boxGeometry args={size}/>
        <meshStandardMaterial color={color || "white"}/>
    </mesh>
)

export const Sphere = (props) => (
    <RigidBody colliders="ball" restitution={0.7}>
        <mesh castShadow receiveShadow {...props}>
            <sphereGeometry args={[0.5, 16, 16]}/>
            <meshStandardMaterial color="white"/>
        </mesh>
    </RigidBody>
)

export const Cylinder = ({
    size = [
        1, 1, 1
    ],
    color = 'white',
    texture,
    ...props
}) => (
    <mesh castShadow receiveShadow {...props}>
        <cylinderGeometry args={size}/>
        <meshStandardMaterial color={color} map={texture}/>
    </mesh>
)
