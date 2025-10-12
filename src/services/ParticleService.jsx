import {useFrame} from "@react-three/fiber";
import {useRef, useMemo, useImperativeHandle} from "react";
import {Object3D, Vector3} from "three";

function getRandomMovement() {

    const downwardVelocity = 0.01 + Math.random() * 0.1;

    const velocity = new Vector3(0, -downwardVelocity, 0);

    const position = new Vector3((Math.random() - 0.5) * 0.8, -0.5, (Math.random() - 0.5) * 0.8);

    return {velocity, position}
}

export const JumpEffect = ({ref}) => {

    const particleCount = 25;

    const dummy = new Object3D();
    const mesh = useRef();
    const life = useRef(0);

    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < particleCount; i++) {

            const {velocity, position} = getRandomMovement();

            temp.push({velocity, position});

        }
        return temp;
    })

    useFrame((_, delta) => {
        particles.forEach((particle, i) => {
            const {velocity, position} = particle;

            particle
                .position
                .add(velocity);
            dummy
                .position
                .copy(particle.position);
            dummy.updateMatrix();

            mesh
                .current
                .setMatrixAt(i, dummy.matrix);

            life.current += delta;
            mesh.current.material.opacity = Math.max(0.5 - life.current / 20, 0);

        });

        mesh.current.instanceMatrix.needsUpdate = true;
    })

    useImperativeHandle(ref, () => ({
        play() {
            life.current = 0;
            particles.forEach((particle, i) => {
                // set position to 0,0,
                const {velocity, position} = getRandomMovement();
                particle
                    .position
                    .copy(position);
                particle
                    .velocity
                    .copy(velocity);

            })
        }
    }));

    return (
        <instancedMesh ref={mesh} args={[null, null, particleCount]}>
            <boxGeometry args={[0.02, 0.5, 0.02]}/>
            <meshStandardMaterial
                color="#ffffff"
                roughness={0.5}
                transparent
                opacity={0.2}/>d
        </instancedMesh>
    );
};

export const TrailEffect = ({ref}) => {

    const particleCount = 30;

    const dummy = new Object3D();
    const mesh = useRef();

    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < particleCount; i++) {

            const position = new Vector3(0, 0, 0);
            const life = 0;

            temp.push({position, life});

        }
        return temp;
    })

    useFrame((_, delta) => {
        particles.forEach((particle, i) => {

            particle.life += delta;

            const positionOffset = new Vector3(0, particle.life / 2, 0);
            dummy
                .position
                .subVectors(particle.position, positionOffset);
            dummy.updateMatrix();

            mesh
                .current
                .setMatrixAt(i, dummy.matrix);

        })
        mesh.current.instanceMatrix.needsUpdate = true;
    })

    useImperativeHandle(ref, () => ({
        play(playerPosition) {

            const offset = new Vector3(Math.random()-0.5,0.8,Math.random()-0.5);
            
            for (let i = 0; i < particles.length; i++) {

                if (particles[i].life <= 1) continue;
                
                particles[i].position.subVectors(playerPosition, offset)
                particles[i].life = 0;

                break;

            }
        }
    }))

    return (
        <instancedMesh ref={mesh} args={[null, null, particleCount]} frustumCulled={false}>
            <dodecahedronGeometry args={[0.25, 0]}/>
            <meshStandardMaterial
                color="#ffffff"
                roughness={0.5}
                transparent
                opacity={0.2}
                />
        </instancedMesh>
    );

}