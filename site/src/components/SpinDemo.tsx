import React, { useRef, useState } from 'react';
import { SpinTurntable, SpinTurntableHandle } from './SpinTurntable';

const SPEC_CLIP = '/spin/okta-turn.mp4';

export const SpinDemo: React.FC = () => {
  const turntable = useRef<SpinTurntableHandle>(null);
  const [angle, setAngle] = useState(0);
  const [open, setOpen] = useState(true);
  const [useSpecClip, setUseSpecClip] = useState(true);

  if (!open) return null;

  const close = () => {
    setOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('spin-demo');
    window.history.replaceState({}, '', url);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#171414] p-4 backdrop-blur-sm">
      <div className="w-full max-w-[430px] rounded-2xl border border-white/15 bg-[#241F1F] p-4 text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/55">
              MUSE / Turntable engine
            </p>
            <h3 className="mt-1 text-xl font-semibold">Spin demo</h3>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-full border border-white/20 px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            Close
          </button>
        </div>

        <SpinTurntable
          key={useSpecClip ? 'clip' : 'cutout'}
          ref={turntable}
          onAngleChange={setAngle}
          className="mt-4 h-[520px] w-full rounded-xl bg-[#1A1717]"
          videoSrc={useSpecClip ? SPEC_CLIP : undefined}
          renderFrame={
            useSpecClip
              ? undefined
              : (current) => {
                  const wave = Math.sin(current * Math.PI * 2);
                  return (
                    <img
                      src="/editorial/mannequin-ember.webp"
                      alt="Mannequin turntable placeholder"
                      className="h-full w-full object-contain"
                      style={{
                        transform: `perspective(900px) rotateY(${wave * 16}deg) scaleX(${0.9 + 0.1 * Math.cos(current * Math.PI * 2)})`,
                      }}
                    />
                  );
                }
          }
        />

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold tabular-nums tracking-[0.08em] text-white/70">
            {Math.round(angle * 360)}°
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => turntable.current?.spinTo(0)}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#171414]"
            >
              Front
            </button>
            <button
              type="button"
              onClick={() => turntable.current?.spinTo(0.5)}
              className="rounded-full border border-white/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-white/85"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => turntable.current?.stop()}
              className="rounded-full border border-white/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-white/85"
            >
              Stop
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
          <button
            type="button"
            onClick={() => setUseSpecClip((current) => !current)}
            className="rounded-full border border-white/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-white/85"
          >
            {useSpecClip ? 'Use cutout' : 'Use spec clip'}
          </button>
          <span className="text-right text-xs leading-relaxed text-white/50">
            {useSpecClip
              ? 'MUSE 360 reference clip — turntable engine check.'
              : 'Static cutout placeholder — no real 360° frames.'}
          </span>
        </div>
      </div>
    </div>
  );
};
