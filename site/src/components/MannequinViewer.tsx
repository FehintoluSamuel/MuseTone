import React, { useEffect, useRef, useState } from 'react';
import type * as Three from 'three';

const COLOURS = [
  { name: 'Brick', hex: '#B9534F' },
  { name: 'Ink', hex: '#171414' },
  { name: 'Bone', hex: '#E9D9D1' },
  { name: 'Olive', hex: '#6B6A4F' },
];

export const MannequinViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<{ color: { set: (value: string) => void } } | null>(null);
  const rotateRef = useRef<(delta: number) => void>(() => undefined);
  const colourRef = useRef(COLOURS[0].hex);
  const [activeColour, setActiveColour] = useState(COLOURS[0]);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    let disposed = false;
    let frameId = 0;
    let cleanup = () => undefined;

    const init = async () => {
      const THREE = await import('three');
      const canvas = canvasRef.current;
      if (disposed || !canvas) return;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#171414');

      const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100);
      camera.position.set(0, 1.05, 4.55);
      camera.lookAt(0, 0.94, 0);

      scene.add(new THREE.HemisphereLight('#F7DCD8', '#171414', 1.15));

      const key = new THREE.DirectionalLight('#F7DCD8', 3.4);
      key.position.set(2.6, 4.4, 3.2);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.near = 0.5;
      key.shadow.camera.far = 12;
      scene.add(key);

      const rim = new THREE.DirectionalLight('#D9605C', 1.7);
      rim.position.set(-3, 2.4, -2.6);
      scene.add(rim);

      const fill = new THREE.PointLight('#E9D9D1', 6, 9);
      fill.position.set(0, 1.1, 2.4);
      scene.add(fill);

      const group = new THREE.Group();
      group.rotation.y = -0.3;
      scene.add(group);

      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: '#C9ADA3',
        roughness: 0.62,
        metalness: 0.01,
      });
      const dressMaterial = new THREE.MeshStandardMaterial({
        color: colourRef.current,
        roughness: 0.58,
        metalness: 0.01,
        side: THREE.DoubleSide,
      });
      const inkMaterial = new THREE.MeshStandardMaterial({
        color: '#171414',
        roughness: 0.48,
        metalness: 0.04,
      });
      materialRef.current = dressMaterial;

      const addSphere = (
        radius: number,
        position: [number, number, number],
        scale: [number, number, number],
        material: Three.Material
      ) => {
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 40, 28), material);
        mesh.position.set(...position);
        mesh.scale.set(...scale);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
        return mesh;
      };

      const addCapsule = (
        start: [number, number, number],
        end: [number, number, number],
        radius: number,
        material: Three.Material
      ) => {
        const from = new THREE.Vector3(...start);
        const to = new THREE.Vector3(...end);
        const direction = new THREE.Vector3().subVectors(to, from);
        const length = direction.length();
        const mesh = new THREE.Mesh(
          new THREE.CapsuleGeometry(radius, Math.max(length - radius * 2, 0.02), 8, 20),
          material
        );
        mesh.position.copy(from).add(to).multiplyScalar(0.5);
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
        return mesh;
      };

      const bodyProfile = [
        new THREE.Vector2(0.29, 0.94),
        new THREE.Vector2(0.248, 1.02),
        new THREE.Vector2(0.235, 1.1),
        new THREE.Vector2(0.258, 1.22),
        new THREE.Vector2(0.31, 1.32),
        new THREE.Vector2(0.315, 1.39),
        new THREE.Vector2(0.25, 1.43),
        new THREE.Vector2(0.16, 1.46),
        new THREE.Vector2(0.09, 1.48),
      ];
      const body = new THREE.Mesh(new THREE.LatheGeometry(bodyProfile, 64), bodyMaterial);
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      addSphere(0.23, [0, 0.93, 0], [1.25, 0.75, 0.92], bodyMaterial);

      const neck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.066, 0.078, 0.17, 28),
        bodyMaterial
      );
      neck.position.y = 1.56;
      neck.castShadow = true;
      group.add(neck);

      addSphere(0.135, [0, 1.72, 0], [0.92, 1.12, 0.96], bodyMaterial);

      for (const side of [-1, 1]) {
        addSphere(0.1, [side * 0.29, 1.38, 0], [1.05, 0.9, 0.95], bodyMaterial);
        addCapsule([side * 0.3, 1.38, 0], [side * 0.405, 1.13, 0.04], 0.072, bodyMaterial);
        addSphere(0.062, [side * 0.405, 1.13, 0.04], [1, 1, 1], bodyMaterial);
        addCapsule([side * 0.405, 1.13, 0.04], [side * 0.445, 0.9, 0.09], 0.052, bodyMaterial);
        addSphere(0.043, [side * 0.445, 0.9, 0.09], [1, 1, 1], bodyMaterial);

        const hand = addSphere(0.07, [side * 0.455, 0.815, 0.1], [0.8, 1.25, 0.55], bodyMaterial);
        hand.rotation.z = side * 0.12;
        addCapsule(
          [side * 0.42, 0.875, 0.085],
          [side * 0.458, 0.815, 0.16],
          0.024,
          bodyMaterial
        );
        for (const finger of [-0.022, 0, 0.022]) {
          addCapsule(
            [side * 0.455 + finger, 0.79, 0.1],
            [side * 0.455 + finger, 0.735, 0.11],
            0.01,
            bodyMaterial
          );
        }

        addSphere(0.11, [side * 0.14, 0.92, 0], [1, 1, 0.95], bodyMaterial);
        addCapsule([side * 0.14, 0.92, 0], [side * 0.145, 0.5, 0.015], 0.105, bodyMaterial);
        addSphere(0.085, [side * 0.145, 0.5, 0.015], [1, 1, 1], bodyMaterial);
        addCapsule([side * 0.145, 0.5, 0.015], [side * 0.15, 0.12, 0.02], 0.073, bodyMaterial);
        addSphere(0.05, [side * 0.15, 0.12, 0.02], [1, 1, 1], bodyMaterial);
        addSphere(0.1, [side * 0.15, 0.062, 0.075], [0.85, 0.52, 1.65], bodyMaterial);
      }

      const dressProfile = [
        new THREE.Vector2(0.315, 0.64),
        new THREE.Vector2(0.33, 0.72),
        new THREE.Vector2(0.315, 0.86),
        new THREE.Vector2(0.275, 1.0),
        new THREE.Vector2(0.255, 1.08),
        new THREE.Vector2(0.285, 1.2),
        new THREE.Vector2(0.325, 1.31),
        new THREE.Vector2(0.335, 1.37),
        new THREE.Vector2(0.29, 1.41),
      ];
      const dress = new THREE.Mesh(new THREE.LatheGeometry(dressProfile, 72), dressMaterial);
      dress.castShadow = true;
      dress.receiveShadow = true;
      group.add(dress);

      const belt = new THREE.Mesh(new THREE.TorusGeometry(0.258, 0.011, 10, 72), inkMaterial);
      belt.rotation.x = Math.PI / 2;
      belt.position.y = 1.08;
      belt.castShadow = true;
      group.add(belt);

      const hem = new THREE.Mesh(new THREE.TorusGeometry(0.315, 0.008, 10, 72), inkMaterial);
      hem.rotation.x = Math.PI / 2;
      hem.position.y = 0.64;
      group.add(hem);

      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.45, 0.05, 72),
        new THREE.MeshStandardMaterial({ color: '#2A211F', roughness: 0.55 })
      );
      base.position.y = 0.025;
      base.castShadow = true;
      base.receiveShadow = true;
      group.add(base);

      const floor = new THREE.Mesh(
        new THREE.CircleGeometry(2.1, 72),
        new THREE.MeshStandardMaterial({ color: '#201A18', roughness: 0.92 })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = 0;
      floor.receiveShadow = true;
      scene.add(floor);

      const resize = () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(canvas);
      resize();

      let dragging = false;
      let lastX = 0;
      let targetRotation = -0.32;
      let currentRotation = -0.32;

      const onPointerDown = (event: PointerEvent) => {
        dragging = true;
        lastX = event.clientX;
        canvas.setPointerCapture(event.pointerId);
        canvas.style.cursor = 'grabbing';
      };
      const onPointerMove = (event: PointerEvent) => {
        if (!dragging) return;
        targetRotation += (event.clientX - lastX) * 0.009;
        lastX = event.clientX;
      };
      const onPointerUp = () => {
        dragging = false;
        canvas.style.cursor = 'grab';
      };

      canvas.style.cursor = 'grab';
      canvas.addEventListener('pointerdown', onPointerDown);
      canvas.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('pointerup', onPointerUp);
      canvas.addEventListener('pointercancel', onPointerUp);

      rotateRef.current = (delta) => {
        targetRotation += delta;
      };

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const animate = () => {
        frameId = requestAnimationFrame(animate);
        if (!dragging && !reduceMotion) targetRotation += 0.0024;
        currentRotation += (targetRotation - currentRotation) * 0.075;
        group.rotation.y = currentRotation;
        renderer.render(scene, camera);
      };
      animate();
      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(frameId);
        observer.disconnect();
        canvas.removeEventListener('pointerdown', onPointerDown);
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerup', onPointerUp);
        canvas.removeEventListener('pointercancel', onPointerUp);
        scene.traverse((object) => {
          const mesh = object as { geometry?: { dispose: () => void }; material?: { dispose: () => void } | Array<{ dispose: () => void }> };
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => material.dispose());
          } else {
            mesh.material?.dispose();
          }
        });
        renderer.dispose();
      };
    };

    init().catch(() => {
      if (!disposed) setFailed(true);
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [visible]);

  useEffect(() => {
    colourRef.current = activeColour.hex;
    materialRef.current?.color.set(activeColour.hex);
  }, [activeColour]);

  return (
    <div ref={frameRef} className="relative aspect-[4/5] w-full overflow-hidden bg-[#171414]">
      {failed ? (
        <img
          src="/editorial/mannequin-fallback.webp"
          alt="Full-body mannequin in the Muse studio"
          className="h-full w-full object-cover opacity-80"
        />
      ) : (
        <canvas
          ref={canvasRef}
          tabIndex={0}
          aria-label="Interactive 3D full-body mannequin with head, shoulders, hands, and legs. Drag to rotate, or use the left and right arrow keys."
          onKeyDown={(event) => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
            event.preventDefault();
            rotateRef.current(event.key === 'ArrowLeft' ? -0.18 : 0.18);
          }}
          className="h-full w-full touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-[#D9605C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171414]"
        />
      )}

      {!ready && !failed && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#171414]">
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#D8CCC5]">
            Preparing 3D mannequin
          </span>
        </div>
      )}

      {!failed && (
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 bg-[#171414]/95 p-4">
          <div className="flex items-center gap-2" aria-label="Garment colour">
            {COLOURS.map((colour) => {
              const isActive = activeColour.name === colour.name;
              return (
                <button
                  key={colour.name}
                  type="button"
                  aria-label={`Set garment colour to ${colour.name}`}
                  aria-pressed={isActive}
                  onClick={() => setActiveColour(colour)}
                  className={`h-8 w-8 border transition-transform hover:scale-105 ${
                    isActive ? 'border-white' : 'border-[#5A4A45]'
                  }`}
                  style={{ backgroundColor: colour.hex }}
                />
              );
            })}
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#D8CCC5]">
            Drag to rotate
          </span>
        </div>
      )}
    </div>
  );
};
