import React, { useState, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";
import { getFresnelMat } from "./Sphere/getFresnelMat.js";

const Sphere = () => {
  const [selectedDot, setSelectedDot] = useState(null);

  useEffect(() => {
    const container = document.getElementById("sphere-container");
    const w = container?.clientWidth || window.innerWidth;
    const h = container?.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 2.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);

    renderer.setClearColor(0x00000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = -23.4 * Math.PI / 180;
    scene.add(earthGroup);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;

    const detail = 12;
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.IcosahedronGeometry(1, detail);

    const material = new THREE.MeshPhongMaterial({
      map: loader.load("/textures/00_earthmap1k.jpg"),
      specularMap: loader.load("/textures/02_earthspec1k.jpg"),
      bumpMap: loader.load("/textures/01_earthbump1k.jpg"),
      bumpScale: 0.04,
    });
    const earthMesh = new THREE.Mesh(geometry, material);
    earthGroup.add(earthMesh);

    // Dot creation
    const dotGeometry = new THREE.SphereGeometry(0.05, 5, 5);
    const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xFc6c85 });
    const dotMeshArray = [];
    const dotInitialPositions = [];

    for (let i = 0; i < 8; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.sin(phi) * Math.sin(theta);
      const z = Math.cos(phi);

      const dotMesh = new THREE.Mesh(dotGeometry, dotMaterial);
      dotMesh.position.set(x * 1.1, y * 1.1, z * 1.1);
      scene.add(dotMesh);
      dotMeshArray.push(dotMesh);

      dotMesh.userData = { index: i, x, y, z };
      dotInitialPositions.push({ theta, phi });  // Store initial spherical coordinates for each dot
    }

    // Raycasting setup
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseClick(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(dotMeshArray);

      if (intersects.length > 0) {
        const selected = intersects[0].object.userData;
        setSelectedDot(`Dot ${selected.index + 1} at position: X: ${selected.x.toFixed(2)}, Y: ${selected.y.toFixed(2)}, Z: ${selected.z.toFixed(2)}`);
      }
    }

    window.addEventListener("click", onMouseClick, false);

    const lightsMat = new THREE.MeshBasicMaterial({
      map: loader.load("/textures/03_earthlights1k.jpg"),
      blending: THREE.AdditiveBlending,
    });
    const lightsMesh = new THREE.Mesh(geometry, lightsMat);
    earthGroup.add(lightsMesh);

    const cloudsMat = new THREE.MeshStandardMaterial({
      map: loader.load("/textures/04_earthcloudmap.jpg"),
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      alphaMap: loader.load("/textures/05_earthcloudmaptrans.jpg"),
    });
    const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
    cloudsMesh.scale.setScalar(1.003);
    earthGroup.add(cloudsMesh);

    const fresnelMat = getFresnelMat();
    const glowMesh = new THREE.Mesh(geometry, fresnelMat);
    glowMesh.scale.setScalar(1.01);
    earthGroup.add(glowMesh);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
    sunLight.position.set(-2, 0.5, 1.5);
    scene.add(sunLight);

    // Dot movement speed factor
    const dotSpeed = 0.05;

    function animate() {
      requestAnimationFrame(animate);

      earthMesh.rotation.y += 0.002;
      lightsMesh.rotation.y += 0.002;
      cloudsMesh.rotation.y += 0.0023;
      glowMesh.rotation.y += 0.002;

      // Rotate dots along with the sphere's rotation
      dotMeshArray.forEach((dot, i) => {
        const { theta, phi } = dotInitialPositions[i];

        // Calculate new position based on the sphere's rotation
        const currentTheta = theta + earthGroup.rotation.y;
        const currentPhi = phi;

        // Convert spherical coordinates back to Cartesian coordinates
        const x = Math.sin(currentPhi) * Math.cos(currentTheta);
        const y = Math.sin(currentPhi) * Math.sin(currentTheta);
        const z = Math.cos(currentPhi);

        dot.position.set(x * 1.1, y * 1.1, z * 1.1); // Ensure dots stay on the sphere's surface
      });

      renderer.render(scene, camera);
    }

    animate();

    function handleWindowResize() {
      const w = container?.clientWidth || window.innerWidth;
      const h = container?.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", handleWindowResize);

    return () => {
      renderer.dispose();
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("click", onMouseClick);
      if (container) container.innerHTML = "";
    };
  }, []);

  return (
    <div id="sphere-container" style={{ width: "100%", height: "100vh" }}>
      <div style={{ position: "absolute", top: "10px", left: "10px", background: "white", padding: "10px", zIndex: 1 }}>
        {selectedDot && <p>{selectedDot}</p>}
      </div>
    </div>
  );
};

export default Sphere;
