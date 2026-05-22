import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TweenMax, Power2 } from 'gsap';

// Type for cubes in modularGroup
type CubeMesh = THREE.Mesh<THREE.IcosahedronGeometry, THREE.MeshStandardMaterial> & {
  speedRotation: number;
  positionX: number;
  positionY: number;
  positionZ: number;
  currentHex?: number; // Optional, set only when intersected
};

// Type for particles in particularGroup
type ParticleMesh = THREE.Mesh<THREE.CircleGeometry, THREE.MeshPhysicalMaterial> & {
  speedValue: number;
};

const Scene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mathRandom = (num = 1): number =>
    -Math.random() * num + Math.random() * num;

  useEffect(() => {
    if (!canvasRef.current) return;

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = false;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.needsUpdate = true;

    // Camera Setup
    const cameraRange = 3;
    const camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    camera.position.set(0, 0, cameraRange);

    // Scene Setup
    const setcolor = 0x000000;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(setcolor);
    scene.fog = new THREE.Fog(setcolor, 2.5, 3.5);

    // Groups Setup
    const sceneGroup = new THREE.Object3D();
    const particularGroup = new THREE.Object3D();
    const modularGroup = new THREE.Object3D();

    // Particle Generation
    const generateParticle = (num: number, amp = 2) => {
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
      });
      const geometry = new THREE.CircleGeometry(0.2, 5);

      for (let i = 1; i < num; i++) {
        const pscale = 0.001 + Math.abs(mathRandom(0.03));
        const particle = new THREE.Mesh(geometry, material) as ParticleMesh;
        particle.position.set(mathRandom(amp), mathRandom(amp), mathRandom(amp));
        particle.rotation.set(mathRandom(), mathRandom(), mathRandom());
        particle.scale.set(pscale, pscale, pscale);
        particle.speedValue = mathRandom(1);
        particularGroup.add(particle);
      }
    };

    generateParticle(200, 2);

    // Add groups to scene
    sceneGroup.add(particularGroup);
    scene.add(modularGroup);
    scene.add(sceneGroup);

    // Cube Initialization (Modular Group)
    const init = () => {
      for (let i = 0; i < 30; i++) {
        const geometry = new THREE.IcosahedronGeometry(1);
        const material = new THREE.MeshStandardMaterial({
          flatShading: true, // Fixed: use flatShading instead of shading
          color: 0x111111,
          transparent: false,
          opacity: 1,
          wireframe: false,
        });
        const cube = new THREE.Mesh(geometry, material) as CubeMesh;
        cube.speedRotation = Math.random() * 0.1;
        cube.positionX = mathRandom();
        cube.positionY = mathRandom();
        cube.positionZ = mathRandom();
        cube.castShadow = true;
        cube.receiveShadow = true;

        const newScaleValue = mathRandom(0.3);
        cube.scale.set(newScaleValue, newScaleValue, newScaleValue);

        cube.rotation.x = mathRandom((180 * Math.PI) / 180);
        cube.rotation.y = mathRandom((180 * Math.PI) / 180);
        cube.rotation.z = mathRandom((180 * Math.PI) / 180);

        cube.position.set(cube.positionX, cube.positionY, cube.positionZ);
        modularGroup.add(cube);
      }
    };

    init();

    // Lighting
    const spotLight = new THREE.SpotLight(0xffffff, 3);
    spotLight.position.set(5, 5, 2);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 10000;
    spotLight.shadow.mapSize.height = 10000;
    spotLight.penumbra = 0.5;
    scene.add(spotLight);

    const lightBack = new THREE.PointLight(0x0fffff, 1);
    lightBack.position.set(0, -3, -1);
    scene.add(lightBack);

    const rectSize = 2;
    const intensity = 100;
    const rectLight = new THREE.RectAreaLight(0x0fffff, intensity, rectSize, rectSize);
    rectLight.position.set(0, 0, 1);
    rectLight.lookAt(0, 0, 0);
    scene.add(rectLight);

    // Raycaster and Mouse Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let INTERSECTED: CubeMesh | null = null;
    const uSpeed = 0.1;

    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      onMouseMove(event);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(modularGroup.children);
      if (intersects.length > 0) {
        if (INTERSECTED !== intersects[0].object) {
          if (INTERSECTED && INTERSECTED.material.emissive && INTERSECTED.currentHex !== undefined) {
            INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
          }
          INTERSECTED = intersects[0].object as CubeMesh;
          INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
          INTERSECTED.material.emissive.setHex(0xffff00);
          TweenMax.to(camera.position, 1, {
            x: INTERSECTED.position.x,
            y: INTERSECTED.position.y,
            z: INTERSECTED.position.z + 3,
            ease: Power2.easeInOut,
          });
        } else {
          if (INTERSECTED && INTERSECTED.material.emissive && INTERSECTED.currentHex !== undefined) {
            INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
          }
          INTERSECTED = null;
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('mousedown', onMouseDown, false);

    // Animation Loop
    const animate = () => {
      const time = performance.now() * 0.0003;
      requestAnimationFrame(animate);

      // Update Particles
      particularGroup.children.forEach(child => {
        const particle = child as ParticleMesh;
        particle.rotation.x += particle.speedValue / 10;
        particle.rotation.y += particle.speedValue / 10;
        particle.rotation.z += particle.speedValue / 10;
      });

      // Update Cubes
      modularGroup.children.forEach(child => {
        const cube = child as CubeMesh;
        cube.rotation.x += 0.008;
        cube.rotation.y += 0.005;
        cube.rotation.z += 0.003;
        cube.position.x = Math.sin(time * cube.positionZ) * cube.positionY;
        cube.position.y = Math.cos(time * cube.positionX) * cube.positionZ;
        cube.position.z = Math.sin(time * cube.positionY) * cube.positionX;
      });

      particularGroup.rotation.y += 0.005;

      // Mouse-based rotation for the modular group
      modularGroup.rotation.y -= ((mouse.x * 4) + modularGroup.rotation.y) * uSpeed;
      modularGroup.rotation.x -= ((-mouse.y * 4) + modularGroup.rotation.x) * uSpeed;

      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };

    animate();

    // Resize Handling
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onResize, false);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
};

export default Scene;
