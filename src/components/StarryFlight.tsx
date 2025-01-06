import {useRef} from "react";
import {Canvas, useFrame} from "@react-three/fiber";

const FlyingStars = () => {
    const starsRef = useRef<any[]>([]);

    const createStars = () => {
        const stars = [];
        for (let i = 0; i < 10000; i++) {
            stars.push({
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
                z: Math.random() * 200 - 100,
            });
        }
        return stars;
    };

    const stars = useRef(createStars());

    useFrame(() => {
        stars.current.forEach((star) => {
            star.z += 0.1;
            if (star.z > 100) star.z = -100;
        });

        starsRef.current.forEach((mesh, index) => {
            mesh.position.set(
                stars.current[index].x,
                stars.current[index].y,
                stars.current[index].z
            );
        });
    });

    return (
        <>
            {stars.current.map((_star, i) => (
                <mesh key={i} ref={(el: any): any => (starsRef.current[i] = el)}>
                    <sphereGeometry args={[0.1, 8, 8]}/>
                    <meshBasicMaterial color="white"/>
                </mesh>
            ))}
        </>
    );
};

const StarryFlight = () => {
    return (
        <Canvas
            style={{
                height: "100vh",
                width: "100vw",
                background: "black",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                position: 'fixed',
                zIndex: -1,
                filter: "blur(5px)",
            }}
        >
            <FlyingStars/>
        </Canvas>
    );
};

export default StarryFlight;
