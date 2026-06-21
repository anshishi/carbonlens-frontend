import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * DottedSurface - Animated 3D particle wave background using Three.js.
 * Rendered behind the Hero section as a dark-themed glowing particle mesh.
 */
export function DottedSurface() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const SEPARATION = 110;
    const AMOUNTX = 25;
    const AMOUNTY = 35;

    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let renderer: THREE.WebGLRenderer;
    let particles: THREE.Points;
    let count = 0;

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || 600;

    // Perspective Camera setup
    camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
    camera.position.z = 1200;
    camera.position.y = 450;
    camera.position.x = 0;
    camera.rotation.x = -Math.PI / 6; // Angled downwards for 3D perspective

    scene = new THREE.Scene();
    scene.background = null; // Transparent scene background to merge with CSS bg
    scene.fog = new THREE.FogExp2(0x0a0f0d, 0.0006); // Fade particles into deep green-black

    const numParticles = AMOUNTX * AMOUNTY;
    const positions = new Float32Array(numParticles * 3);
    const scales = new Float32Array(numParticles);

    let i = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        // Space out particles in X and Z directions
        positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;     // x
        positions[i + 1] = 0;                                             // y
        positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2; // z
        scales[ix * AMOUNTY + iy] = 1;
        i += 3;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

    // Points Material using glowing teal-green color (#2dd4a7)
    const material = new THREE.PointsMaterial({
      color: 0x2dd4a7,
      size: 5,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // WebGL Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    const onWindowResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onWindowResize);

    // Animation animationFrameId
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const positionAttribute = particles.geometry.attributes.position as THREE.BufferAttribute;
      const posArray = positionAttribute.array as Float32Array;

      let index = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          // Double sine wave animation pattern
          posArray[index + 1] =
            Math.sin((ix + count) * 0.3) * 65 +
            Math.sin((iy + count) * 0.5) * 65;
          index += 3;
        }
      }

      positionAttribute.needsUpdate = true;
      
      // Subtle rotation to enhance depth
      particles.rotation.y = count * 0.03;

      renderer.render(scene, camera);
      count += 0.04;
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onWindowResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none opacity-45"
      style={{ minHeight: "100vh" }}
    />
  );
}
export default DottedSurface;
