import React, { useEffect, useRef, useState } from 'react';

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

      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(0, 1.3, 4.2);
      camera.lookAt(0, 1.02, 0);

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
      group.rotation.y = -0.32;
      scene.add(group);

      const formMaterial = new THREE.MeshStandardMaterial({
        color: '#D8C0B8',
        roughness: 0.58,
        metalness: 0.02,
      });
      const dressMaterial = new THREE.MeshStandardMaterial({
        color: colourRef.current,
        roughness: 0.62,
        metalness: 0,
        side: THREE.DoubleSide,
      });
      materialRef.current = dressMaterial;

      const profile = [
        new THREE.Vector2(0.3, 0.44),
        new THREE.Vector2(0.34, 0.6),
        new THREE.Vector2(0.32, 0.86),
        new THREE.Vector2(0.28, 1.08),
        new THREE.Vector2(0.245, 1.22),
        new THREE.Vector2(0.33, 1.4),
        new THREE.Vector2(0.42, 1.58),
        new THREE.Vector2(0.38, 1.7),
        new THREE.Vector2(0.22, 1.8),
        new THREE.Vector2(0.17, 1.86),
      ];
      const dress = new THREE.Mesh(new THREE.LatheGeometry(profile, 72), dressMaterial);
      dress.castShadow = true;
      dress.receiveShadow = true;
      group.add(dress);

      const neck = new THREE.Mesh(new THREE.SphereGeometry(0.17, 32, 18), formMaterial);
      neck.position.y = 1.88;
      neck.castShadow = true;
      group.add(neck);

      const belt = new THREE.Mesh(
        new THREE.TorusGeometry(0.252, 0.012, 8, 64),
        new THREE.MeshStandardMaterial({ color: '#171414', roughness: 0.45 })
      );
      belt.rotation.x = Math.PI / 2;
      belt.position.y = 1.22;
      belt.castShadow = true;
      group.add(belt);

      const hem = new THREE.Mesh(
        new THREE.TorusGeometry(0.302, 0.009, 8, 64),
        new THREE.MeshStandardMaterial({ color: '#171414', roughness: 0.45 })
      );
      hem.rotation.x = Math.PI / 2;
      hem.position.y = 0.44;
      group.add(hem);

      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.028, 0.028, 0.44, 24),
        new THREE.MeshStandardMaterial({ color: '#5A3E35', roughness: 0.5 })
      );
      pole.position.y = 0.22;
      pole.castShadow = true;
      group.add(pole);

      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.44, 0.05, 64),
        new THREE.MeshStandardMaterial({ color: '#2A211F', roughness: 0.55 })
      );
      base.position.y = 0.025;
      base.castShadow = true;
      base.receiveShadow = true;
      group.add(base);

      const floor = new THREE.Mesh(
        new THREE.CircleGeometry(2.1, 64),
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
          src="/editorial/atelier-form.webp"
          alt="Dress form in the Muse atelier"
          className="h-full w-full object-cover opacity-80"
        />
      ) : (
        <canvas
          ref={canvasRef}
          tabIndex={0}
          aria-label="Interactive 3D dress form. Drag to rotate, or use the left and right arrow keys."
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
            Preparing 3D form
          </span>
        </div>
      )}

      {!failed && (
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 bg-[#171414]/95 p-4">
          <div className="flex items-center gap-2" aria-label="Dress colour">
            {COLOURS.map((colour) => {
              const isActive = activeColour.name === colour.name;
              return (
                <button
                  key={colour.name}
                  type="button"
                  aria-label={`Set dress colour to ${colour.name}`}
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
