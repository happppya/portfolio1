import * as THREE from 'three'
import {Suspense, useRef, useState} from 'react'
import {Canvas, useFrame} from '@react-three/fiber'
import {
    useGLTF,
    OrbitControls,
    Sky,
    Environment,
    Clouds,
    Cloud,
    KeyboardControls,
    OrthographicCamera,
    Stats
} from '@react-three/drei'
import {Physics, RigidBody} from '@react-three/rapier'
import {useControls} from 'leva'

import {Bloom, Scanline, EffectComposer, Noise, Vignette} from '@react-three/postprocessing'
import {BlendFunction} from 'postprocessing'

import {Player} from './systems/PlayerController.jsx'
import {Workspace} from './components/Workspace.jsx'
import { Overlay } from './components/Overlay.jsx'
import * as StateService from './services/StateService.jsx'

import "./css/overlay.css"

export default function App() {

    const {debug} = useControls({debug: false})
    const orbitRef = useRef();

    const keyboardMap = [
        {
            name: "forward",
            keys: ["ArrowUp", "KeyW"]
        }, {
            name: "backward",
            keys: ["ArrowDown", "KeyS"]
        }, {
            name: "left",
            keys: ["ArrowLeft", "KeyA"]
        }, {
            name: "right",
            keys: ["ArrowRight", "KeyD"]
        }, {
            name: "run",
            keys: ["Shift"]
        }, {
            name: "jump",
            keys: ["Space"]
        }
    ];

    StateService.setState(StateService.States.EXPLORE);

    return (
        <div
            style={{
            position: 'relative',
            width: '100vw',
            height: '100vh'
        }}>

            <KeyboardControls map={keyboardMap}>

                <Canvas
                    shadows={"variance"}
                    camera={{
                    position: [
                        0, 10, 10
                    ],
                    fov: 50
                }}>
                    <fogExp2 attach="fog" args={['#5e9abeff', 0.003]}/>

                    <Suspense fallback={null}>

                        <hemisphereLight intensity={0.45 * Math.PI}/>
                  
                        <directionalLight
                            castShadow
                            decay={0}
                            color="white"
                            position={[20, 30, 10]}
                            intensity={4}
                            shadow-mapSize-width={2048}
                            shadow-mapSize-height={2048}
                            shadow-camera-near={0.5}
                            shadow-camera-far={500}
                            shadow-bias={-0.002}
                            shadow-camera-top={300}
                            shadow-camera-bottom={-300}
                            shadow-camera-left={-300}
                            shadow-camera-right={300}
                            />
                        <Clouds material={THREE.MeshBasicMaterial}>
                            <Cloud seed={10} bounds={50} volume={80} position={[40, 60, -80]}/>
                            <Cloud seed={10} bounds={50} volume={80} position={[-40, 70, -80]}/>
                        </Clouds>
                        <Environment preset="city"/>
                        <Sky
                            mieCoefficient={0.005}
                            mieDirectionalG={0.03}
                            turbidity={1}
                            rayleigh={0.2}/>
                        <Physics debug={debug} colliders={false} gravity={[0, -20, 0]}>
                            <Workspace/>
                            <Player orbitRef={orbitRef}/>
                        </Physics>
                        <OrbitControls
                            ref={orbitRef}
                            enableRotate={true}
                            enablePan={false}
                            enableZoom={false}
                            minPolarAngle={0}
                            maxPolarAngle={Math.PI / 2}
                            rotateSpeed={4}
                            autoRotate={false}/>
                        <EffectComposer>
                            <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300}/>
                            <Vignette eskil={false} offset={0.1} darkness={0.5}/>
                        </EffectComposer>
                    </Suspense>

                </Canvas>

            </KeyboardControls>

            <Overlay/>
        </div>
    )
}
