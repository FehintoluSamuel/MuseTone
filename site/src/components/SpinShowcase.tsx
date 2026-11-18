import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SpinTurntable, SpinTurntableHandle } from './SpinTurntable';

const FRAMES = Array.from(
  { length: 48 },
  (_, index) => `/spin/frames/frame-${String(index).padStart(3, '0')}.jpg`
);

export const SpinShowcase: React.FC = () => {
  const turntable = useRef<SpinTurntableHandle>(null);
  const [angle, setAngle] = useState(0);
  const [activeLook, setActiveLook] = useState(0);

  useEffect(() => {
    FRAMES.forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, []);

  const spinToLook = (index: number) => {
    setActiveLook(index);
    turntable.current?.spinTo(index === 0 ? 0 : 0.5);
  };

  const handleAngleChange = useCallback((next: number) => {
    setAngle(next);
    if (Math.min(next, 1 - next) <= 0.02) {
      setActiveLook(0);
    } else if (Math.abs(next - 0.5) <= 0.02) {
      setActiveLook(1);
    }
  }, []);

  const degrees = String(Math.round(angle * 360) % 360).padStart(3, '0');
  const dotPercent = Math.max(0, Math.min(100, angle * 100));
  const viewLabel =
    Math.min(angle, 1 - angle) <= 0.03
      ? 'Front'
      : Math.abs(angle - 0.5) <= 0.03
        ? 'Back'
        : 'In rotation';

  return (
    <section
      id="spin-showcase"
      className="mt-20 w-full scroll-mt-20 bg-canvas py-16 text-ink sm:mt-28 sm:py-24"
    >
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="reveal reveal-up grid gap-8 border-b border-line/15 pb-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <h2 className="font-['Montserrat'] text-display font-semibold tracking-[-0.02em] text-ink">
              <span className="headline-highlight text-ink">
                Check the
                <br />
                drape.
              </span>
            </h2>
          </div>

          <div className="md:justify-self-end">
            <p className="max-w-[460px] text-base leading-[1.7] text-ink/70">
              Use the turntable to see how a garment falls, how the colour shifts across a seam, and
              whether the back works as hard as the front. Spin it before you cut, buy or style the
              piece.
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-ink/55">
              Turntable preview
            </p>
          </div>
        </div>

        <div className="reveal reveal-up reveal-delay-1 mt-8 grid gap-8 sm:mt-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-12">
          <div className="lg:pb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ink/55">
              What to check
            </p>
            <p className="mt-3 max-w-[360px] text-base leading-[1.7] text-ink/70">
              Spin the model, then compare the front, side and back. Look for drape, weight and
              colour across the seams.
            </p>

            <div className="mt-8 border-t border-line/15 pt-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ink/55">
                    Angle
                  </p>
                  <p className="mt-1 text-base font-semibold tabular-nums tracking-tight text-ink">
                    {degrees}°
                  </p>
                </div>
                <div className="flex items-center gap-1" aria-label="Choose a view">
                  {[0, 1].map((index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => spinToLook(index)}
                      aria-current={activeLook === index ? 'true' : undefined}
                      className={`flex h-9 min-w-9 items-center justify-center px-1.5 text-base font-semibold tabular-nums transition-colors ${
                        activeLook === index
                          ? 'bg-canvas text-ink'
                          : 'text-ink/45 hover:text-ink'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 h-px w-full bg-contrast/15">
                <div
                  className="h-px bg-accent"
                  style={{ width: `${dotPercent}%` }}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {[0, 1].map((index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => spinToLook(index)}
                  aria-label={index === 0 ? 'Front view' : 'Back view'}
                  aria-current={activeLook === index ? 'true' : undefined}
                  className={`group relative w-[88px] border p-1 transition-colors ${
                    activeLook === index
                      ? 'border-accent'
                      : 'border-line/15 hover:border-line/40'
                  }`}
                >
                  <img
                    src={index === 0 ? FRAMES[0] : FRAMES[24]}
                    alt=""
                    loading="eager"
                    draggable={false}
                    className={`block aspect-square w-full object-cover bg-contrast/10 ${
                      activeLook === index ? 'opacity-100' : 'opacity-60 grayscale'
                    }`}
                  />
                  <span className="mt-1.5 block text-left text-xs font-semibold uppercase tracking-[0.08em] text-ink/55">
                    {index === 0 ? 'Front' : 'Back'}
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-ink/55">
              Drag or use arrow keys to rotate
            </p>
          </div>

          <figure className="relative mx-auto w-full max-w-[430px] lg:ml-auto lg:mr-0">
            <div className="relative aspect-[9/16] overflow-hidden bg-[#E2E4E8]">
              <SpinTurntable
                ref={turntable}
                frames={FRAMES}
                fit="cover"
                dragPixelsPerTurn={720}
                onAngleChange={handleAngleChange}
                ariaLabel="Drag to rotate the MUSE turntable study"
                className="h-full w-full"
              />

              <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between gap-3">
                <span className="bg-canvas px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink backdrop-blur">
                  MUSE / TURNTABLE
                </span>
                <span className="bg-canvas px-3 py-2 text-xs font-semibold tabular-nums uppercase tracking-[0.14em] text-ink backdrop-blur">
                  {degrees}°
                </span>
              </div>

              <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
                <span className="bg-canvas px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink backdrop-blur">
                  Drag to rotate
                </span>
                <span className="bg-canvas px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink backdrop-blur">
                  {viewLabel}
                </span>
              </div>
            </div>

            <figcaption className="flex items-end justify-between gap-4 bg-canvas px-4 py-4 text-ink sm:px-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ink/55">
                  Turntable preview
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-ink">
                  Check the turn
                </p>
              </div>
              <span className="text-base font-semibold tabular-nums text-soft">
                {degrees}°
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};
