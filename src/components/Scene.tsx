import * as THREE from 'three';
import {useEffect, useRef} from "react";

function Scene() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setAnimationLoop(animate);
        if (!ref.current) {
            return;
        }
        ref.current.appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

        function animate() {

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render(scene, camera);

        }

        animate();

        return () => {
            if (!ref.current) {
                return;
            }
            ref.current.removeChild(renderer.domElement);
        }
    }, []);

    return (
        <div
            ref={ref}
            style={{
                backgroundColor: 'black',
                width: '100vw',
                height: '100vh',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                position: 'fixed',
                zIndex: -1,
            }}
        >
        </div>
    )
}

export default Scene
