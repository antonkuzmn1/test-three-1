import * as THREE from 'three';
import {useEffect, useRef} from "react";
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

function Scene() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (!ref.current) {
            return;
        }
        ref.current.appendChild(renderer.domElement);

        const light = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(light);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        const loader = new GLTFLoader();
        let model: THREE.Object3D | null = null;
        loader.load(
            '/3d-models/data-center/scene.gltf',
            // '/3d-models/test-1/test-2.glb',
            // '/3d-models/data-center-custom/data_center.glb',
            (gltf: any) => {
                model = gltf.scene;
                if (!model) {
                    return;
                }
                model.position.set(0, 0, 0);
                scene.add(model);
            },
            (xhr: any) => {
                console.log(`Model loading: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`);
            },
            (error: any) => {
                console.error('Error loading model:', error);
            }
        );

        camera.position.z = 50;
        camera.position.y = 3;

        const vertexShader = `
            varying vec2 vUv;

            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            varying vec2 vUv;

            void main() {
                gl_FragColor = vec4(vUv, 0.5 + 0.5 * sin(vUv.x * 10.0), 1.0);
            }
        `;

        const shaderMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const plane = new THREE.Mesh(geometry, shaderMaterial);
        scene.add(plane);

        /// MOUSE

        let isDragging = false;
        let previousMousePosition = {x: 0, y: 0};

        const onMouseDown = (event: MouseEvent) => {
            isDragging = true;
            previousMousePosition = {x: event.clientX, y: event.clientY};
        };

        const onMouseMove = (event: MouseEvent) => {
            if (!isDragging || !model) return;

            const deltaMove = {
                x: event.clientX - previousMousePosition.x,
                y: event.clientY - previousMousePosition.y,
            };

            model.rotation.y += deltaMove.x * 0.01;
            model.rotation.x += deltaMove.y * 0.01;

            previousMousePosition = {x: event.clientX, y: event.clientY};
        };

        const onMouseUp = () => {
            isDragging = false;
        };

        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        function animate() {
            renderer.render(scene, camera);
        }

        renderer.setAnimationLoop(animate);

        return () => {
            if (!ref.current) {
                return;
            }
            ref.current.removeChild(renderer.domElement);

            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
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
        />
    );
}

export default Scene;
