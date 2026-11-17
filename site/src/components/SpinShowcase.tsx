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
      className="mt-20 w-full scroll-mt-20 bg-[#171414] py-16 text-white sm:mt-28 sm:py-24"
    >
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 border-b border-white/15 pb-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/55">
              MUSE / Motion study
            </p>
            <h2 className="mt-3 font-['Montserrat'] text-[clamp(46px,6.6vw,92px)] font-black leading-[0.9] tracking-[-0.04em] text-white">
              <span className="box-decoration-clone rounded-[2px] bg-[linear-gradient(90deg,#D9605C_0%,#C65D58_55%,#9E3F3B_100%)] bg-[length:100%_80%] bg-center bg-no-repeat px-3 text-white shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
                The form,
                <br />
                in the round.
              </span>
            </h2>
          </div>

          <div className="md:justify-self-end">
            <p className="max-w-[460px] text-base leading-[1.7] text-white/70">
              A single silhouette, turning under studio light. Drag to read the drape, the weight,
              and the way colour changes across a seam.
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-white/55">
              360° study / 01
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 sm:mt-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-12">
          <div className="lg:pb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/55">
              Turn the look
            </p>
            <p className="mt-3 max-w-[360px] text-base leading-[1.7] text-white/70">
              The stage holds the frame while you rotate. Use the thumbnails to return to the
              front or back.
            </p>

            <div className="mt-8 border-t border-white/15 pt-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/55">
                    Angle
                  </p>
                  <p className="mt-1 text-base font-semibold tabular-nums tracking-tight text-white">
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
                          ? 'bg-[#171414] text-white'
                          : 'text-white/45 hover:text-white'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 h-px w-full bg-white/15">
                <div
                  className="h-px bg-[#B9534F]"
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
                      ? 'border-[#B9534F]'
                      : 'border-white/15 hover:border-white/40'
                  }`}
                >
                  <img
                    src={index === 0 ? FRAMES[0] : FRAMES[24]}
                    alt=""
                    loading="eager"
                    draggable={false}
                    className={`block aspect-square w-full object-cover bg-white/10 ${
                      activeLook === index ? 'opacity-100' : 'opacity-60 grayscale'
                    }`}
                  />
                  <span className="mt-1.5 block text-left text-xs font-semibold uppercase tracking-[0.08em] text-white/55">
                    {index === 0 ? 'Front' : 'Back'}
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-white/55">
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
                ariaLabel="Drag to rotate the Muse 360 study"
                className="h-full w-full"
              />

              <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between gap-3">
                <span className="bg-[#171414] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
                  MUSE / 360
                </span>
                <span className="bg-[#171414] px-3 py-2 text-xs font-semibold tabular-nums uppercase tracking-[0.14em] text-white backdrop-blur">
                  {degrees}°
                </span>
              </div>

              <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
                <span className="bg-[#171414] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
                  Drag to rotate
                </span>
                <span className="bg-[#171414] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
                  {viewLabel}
                </span>
              </div>
            </div>

            <figcaption className="flex items-end justify-between gap-4 bg-[#171414] px-4 py-4 text-white sm:px-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/55">
                  360 study / 01
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
                  The silhouette
                </p>
              </div>
              <span className="text-base font-semibold tabular-nums text-[#F7DCD8]">
                {degrees}°
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};
