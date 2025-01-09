import React from "react";
import { Canvas } from "@react-three/fiber";
import './style/item.css'; // Import the CSS file

const Testfornow = () => {
  return (
    <div className="test-container">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </Canvas>
    </div>
  );
};

export default Testfornow;
