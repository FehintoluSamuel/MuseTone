import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';

interface InteractiveModalsProps {
  activeModal: 'start' | 'get-started' | 'learn-more' | null;
  onClose: () => void;
  onStartClick: () => void;
  onStudioClick: () => void;
}

const PALETTE = [
  { name: 'Shell', code: '01', hex: '#E9D9D1', ink: '#171414' },
  { name: 'Rose', code: '02', hex: '#D8C0B8', ink: '#171414' },
  { name: 'Ember', code: '03', hex: '#D9605C', ink: '#171414' },
  { name: 'Brick', code: '04', hex: '#B9534F', ink: '#FFFFFF' },
  { name: 'Ink', code: '05', hex: '#171414', ink: '#FFFFFF' },
];

const PROCESS_STEPS = [
  {
    title: 'Profile the skin',
    copy: 'Tone, undertone, and contrast are declared and checked. No selfie, no guessing.',
  },
  {
    title: 'Check the garment',
    copy: 'A fabric photo becomes an explainable colour read you can defend in the fitting room.',
  },
  {
    title: 'See it on a body',
    copy: 'The palette meets an interactive full-body mannequin before the first sample is cut.',
  },
];

export const InteractiveModals: React.FC<InteractiveModalsProps> = ({
  activeModal,
  onClose,
  onStartClick,
  onStudioClick,
}) => {
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (!activeModal) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeModal, onClose]);

  React.useEffect(() => {
    if (!activeModal) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [activeModal]);

  const meta =
    activeModal === 'start'
      ? 'Muse / Personal'
      : activeModal === 'get-started'
        ? 'Muse / Studio'
        : 'Muse / Atelier';

  return (
    <AnimatePresence>
      {activeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0A0A0A]/90 backdrop-blur-[6px]"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Muse dialog"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97, y: 12 }}
            className={`relative z-10 max-h-[90vh] w-full overflow-y-auto border border-white/10 bg-[#171414] text-white shadow-[0_40px_120px_rgba(0,0,0,0.55)] ${
              activeModal === 'learn-more' ? 'max-w-4xl' : 'max-w-xl'
            }`}
          >
            <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-white/10 bg-[#171414]/95 px-5 py-3 backdrop-blur sm:px-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
                {meta}
              </p>
              <button
                id="modal-close-btn"
                onClick={onClose}
                aria-label="Close dialog"
                className="flex h-9 w-9 items-center justify-center text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 sm:p-8">
              {activeModal === 'start' && (
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#D9605C]">
                      Free profile
                    </p>
                    <h3 className="mt-3 font-['Montserrat'] text-3xl font-black leading-[0.96] tracking-[-0.03em] text-white sm:text-4xl">
                      Muse Personal
                    </h3>
                    <p className="mt-3 max-w-[430px] text-sm leading-relaxed text-white/50">
                      One profile, a core palette, and a place to keep the reads that work.
                    </p>
                  </div>

                  <dl className="divide-y divide-white/10 border-y border-white/10">
                    <div className="flex items-center justify-between gap-4 py-4 text-sm">
                      <dt className="text-white/45">Palette depth</dt>
                      <dd className="text-right font-semibold text-white">
                        Undertone + core colours
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4 py-4 text-sm">
                      <dt className="text-white/45">Garment checks</dt>
                      <dd className="font-semibold text-white">Daily</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4 py-4 text-sm">
                      <dt className="text-white/45">Saved boards</dt>
                      <dd className="font-semibold text-white">One profile</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4 py-4">
                      <dt className="text-sm text-white/45">Price</dt>
                      <dd className="font-['Montserrat'] text-3xl font-black tracking-[-0.03em] text-white">
                        Free
                      </dd>
                    </div>
                  </dl>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button
                      onClick={onClose}
                      className="btn-pill-light w-full sm:w-auto"
                    >
                      Create your palette
                    </button>
                    <button
                      onClick={onClose}
                      className="btn-ghost w-full sm:w-auto"
                    >
                      Not now
                    </button>
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/35">
                    Upgrade any time. Your profile and boards stay with you.
                  </p>
                </div>
              )}

              {activeModal === 'get-started' && (
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#D9605C]">
                      Studio access
                    </p>
                    <h3 className="mt-3 font-['Montserrat'] text-3xl font-black leading-[0.96] tracking-[-0.03em] text-white sm:text-4xl">
                      Get started
                      <br />
                      with Muse.
                    </h3>
                    <p className="mt-3 max-w-[430px] text-sm leading-relaxed text-white/50">
                      Colour intelligence for designers, stylists, and the clients they dress.
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      onClose();
                    }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
                        Full name
                      </label>
                      <input
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="e.g. Amara Okafor"
                        className="w-full border-0 border-b border-white/15 bg-transparent px-0 py-3 text-sm text-white placeholder:text-white/25 focus:border-[#D9605C] focus:outline-none focus:ring-0"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
                        Business email
                      </label>
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="amara@studio.com"
                        className="w-full border-0 border-b border-white/15 bg-transparent px-0 py-3 text-sm text-white placeholder:text-white/25 focus:border-[#D9605C] focus:outline-none focus:ring-0"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
                        I am a
                      </label>
                      <select className="w-full border-0 border-b border-white/15 bg-[#171414] px-0 py-3 text-sm text-white focus:border-[#D9605C] focus:outline-none focus:ring-0">
                        <option>Fashion designer</option>
                        <option>Stylist / image consultant</option>
                        <option>Client / individual</option>
                        <option>Studio / team</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center">
                      <button
                        type="submit"
                        className="btn-pill-light w-full sm:w-auto"
                      >
                        Request early access
                      </button>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/35">
                        We reply within two working days.
                      </p>
                    </div>
                  </form>
                </div>
              )}

              {activeModal === 'learn-more' && (
                <div className="space-y-10">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#D9605C]">
                      Atelier notes
                    </p>
                    <h3 className="mt-3 font-['Montserrat'] text-4xl font-black leading-[0.92] tracking-[-0.04em] text-white sm:text-5xl">
                      The rail,
                      <br />
                      in colour.
                    </h3>
                    <p className="mt-4 max-w-[620px] text-sm leading-relaxed text-white/50">
                      Personal palettes, garment checks, and mannequin previews, before the first
                      stitch.
                    </p>
                  </div>

                  <section>
                    <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
                          01 / Colour index
                        </p>
                        <h4 className="mt-2 text-xl font-semibold leading-tight text-white sm:text-2xl">
                          Not every red belongs on every skin.
                        </h4>
                      </div>
                      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                        05 tones
                      </span>
                    </div>

                    <p className="mt-4 max-w-[620px] text-sm leading-relaxed text-white/50">
                      The engine reads tone, undertone, and contrast, then builds a palette that
                      behaves in daylight, evening light, and on camera.
                    </p>

                    <div className="mt-6 grid grid-cols-5 gap-2">
                      {PALETTE.map((swatch) => (
                        <div key={swatch.name}>
                          <div
                            className="relative h-24 border border-white/10 sm:h-36"
                            style={{ backgroundColor: swatch.hex }}
                          >
                            <span
                              className="absolute bottom-2 left-2 text-[10px] font-semibold uppercase tracking-[0.1em]"
                              style={{ color: swatch.ink }}
                            >
                              {swatch.code}
                            </span>
                          </div>
                          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/55">
                            {swatch.name}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/10 pt-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/35">
                      <span>Seasonal palettes</span>
                      <span>Tone and undertone mapped</span>
                      <span>Daylight tested</span>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
                          02 / Process
                        </p>
                        <h4 className="mt-2 text-xl font-semibold leading-tight text-white sm:text-2xl">
                          From skin tone to a finished look.
                        </h4>
                      </div>
                      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                        03 steps
                      </span>
                    </div>

                    <p className="mt-4 max-w-[620px] text-sm leading-relaxed text-white/50">
                      A deterministic colour workflow for designers who need to explain the
                      decision, not just make it.
                    </p>

                    <div className="mt-5 divide-y divide-white/10 border-y border-white/10">
                      {PROCESS_STEPS.map((step, index) => (
                        <div
                          key={step.title}
                          className="grid grid-cols-[42px_1fr] gap-4 py-5 sm:grid-cols-[64px_1fr]"
                        >
                          <span className="font-['Montserrat'] text-2xl font-black leading-none tracking-[-0.03em] text-[#D9605C]">
                            0{index + 1}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-white">{step.title}</p>
                            <p className="mt-1 text-sm leading-relaxed text-white/50">
                              {step.copy}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
                    <button
                      onClick={onStartClick}
                      className="btn-pill-light w-full sm:w-auto"
                    >
                      Start a colour profile
                    </button>
                    <button
                      onClick={onStudioClick}
                      className="btn-ghost w-full sm:w-auto"
                    >
                      Studio plans
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
