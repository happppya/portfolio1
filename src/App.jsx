import {Suspense, useRef, useState, useEffect} from 'react'
import {Canvas, useFrame} from '@react-three/fiber'
import {KeyboardControls} from '@react-three/drei'

import {GlobalOverlay} from './components/GlobalOverlay.jsx'
import {ConditionalOverlay} from './components/ConditionalOverlay/ConditionalOverlay.jsx'
import {Experience} from './components/Experience.jsx'
import * as StateService from './services/StateService.jsx'

import "./css/overlay.css"

export default function App() {

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

    return (
        <div
            style={{
            position: 'relative',
            width: '100vw',
            height: '100vh'
        }}>
            <StateService.StateProvider>
                <KeyboardControls map={keyboardMap}>

                    <Canvas
                        shadows={"variance"}
                        camera={{
                        position: [
                            0, 10, 10
                        ],
                        fov: 50
                    }}>

                        <Suspense fallback={null}>
                            <Experience/>
                        </Suspense>

                    </Canvas>

                </KeyboardControls>

                <div className="overlay">

                    <ConditionalOverlay/>
                    <GlobalOverlay/>

                </div>

            </StateService.StateProvider>

        </div>
    )
}
