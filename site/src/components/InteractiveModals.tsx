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
    title: 'Build the profile',
    copy: 'Capture tone, undertone and contrast for a client or yourself, then turn it into a palette you can explain.',
  },
  {
    title: 'Read the fabric',
    copy: 'Photograph the cloth you are considering and compare its colour with the palette before you buy or cut.',
  },
  {
    title: 'Fit the dress colour',
    copy: 'Put the palette on a full-body model and check the colour combination on the dress before the first sample.',
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
      ? 'MUSE / Personal'
      : activeModal === 'get-started'
        ? 'MUSE / Studio'
        : 'MUSE / Atelier';

  return (
    <AnimatePresence>
      {activeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-panel/90 backdrop-blur-[6px]"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="MUSE dialog"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97, y: 12 }}
            className={`relative z-10 max-h-[90vh] w-full overflow-y-auto border border-line/10 bg-canvas text-ink shadow-[0_40px_120px_rgba(0,0,0,0.55)] ${
              activeModal === 'learn-more' ? 'max-w-4xl' : 'max-w-xl'
            }`}
          >
            <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-line/10 bg-canvas/95 px-5 py-3 backdrop-blur sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/40">
                {meta}
              </p>
              <button
                id="modal-close-btn"
                onClick={onClose}
                aria-label="Close dialog"
                className="flex h-9 w-9 items-center justify-center text-ink/60 transition-colors hover:bg-contrast/[0.06] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 sm:p-8">
              {activeModal === 'start' && (
                <div className="space-y-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                      Free colour match
                    </p>
                    <h3 className="mt-3 font-['Montserrat'] text-2xl font-semibold leading-[1.2] tracking-[-0.02em] text-ink sm:text-3xl">
                      Create your
                      <br />
                      colour profile.
                    </h3>
                    <p className="mt-3 max-w-[430px] text-base leading-[1.7] text-ink/60">
                      A working colour profile, a palette you can explain, and a place to keep the
                      dress colour combinations that work. Use it for client work or your own
                      wardrobe.
                    </p>
                  </div>

                  <dl className="divide-y divide-line/10 border-y border-line/10">
                    <div className="flex items-center justify-between gap-4 py-4 text-base">
                      <dt className="text-ink/55">Built from</dt>
                      <dd className="text-right font-semibold text-ink">
                        Tone, undertone and contrast
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4 py-4 text-base">
                      <dt className="text-ink/55">Fabric colour checks</dt>
                      <dd className="font-semibold text-ink">Included</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4 py-4 text-base">
                      <dt className="text-ink/55">Look library</dt>
                      <dd className="font-semibold text-ink">A few saved looks</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4 py-4">
                      <dt className="text-base text-ink/55">Price</dt>
                      <dd className="font-['Montserrat'] text-2xl font-semibold tracking-[-0.02em] text-ink">
                        Free
                      </dd>
                    </div>
                  </dl>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button
                      onClick={onClose}
                      className="btn-pill-light w-full sm:w-auto"
                    >
                      Start matching
                    </button>
                    <button
                      onClick={onClose}
                      className="btn-ghost w-full sm:w-auto"
                    >
                      Not now
                    </button>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ink/40">
                    Free to start. No card needed. Studio and Atelier access is by request.
                  </p>
                </div>
              )}

              {activeModal === 'get-started' && (
                <div className="space-y-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                      Studio access
                    </p>
                    <h3 className="mt-3 font-['Montserrat'] text-2xl font-semibold leading-[1.2] tracking-[-0.02em] text-ink sm:text-3xl">
                      Talk to the
                      <br />
                      studio.
                    </h3>
                    <p className="mt-3 max-w-[430px] text-base leading-[1.7] text-ink/60">
                      For independent designers, stylists and ateliers. Request access to client
                      profiles, shared palettes and saved looks.
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
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/40">
                        Full name
                      </label>
                      <input
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="e.g. Amara Okafor"
                        className="w-full border-0 border-b border-line/15 bg-transparent px-0 py-3 text-base text-ink placeholder:text-ink/30 focus:border-accent focus:outline-none focus:ring-0"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/40">
                        Business email
                      </label>
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="amara@studio.com"
                        className="w-full border-0 border-b border-line/15 bg-transparent px-0 py-3 text-base text-ink placeholder:text-ink/30 focus:border-accent focus:outline-none focus:ring-0"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/40">
                        I am a
                      </label>
                      <select className="w-full border-0 border-b border-line/15 bg-canvas px-0 py-3 text-base text-ink focus:border-accent focus:outline-none focus:ring-0">
                        <option>Independent designer</option>
                        <option>Stylist or image consultant</option>
                        <option>Atelier or studio team</option>
                        <option>Client or individual</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-line/10 pt-5 sm:flex-row sm:items-center">
                      <button
                        type="submit"
                        className="btn-pill-light w-full sm:w-auto"
                      >
                        Request Studio access
                      </button>
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ink/40">
                        No checkout. We'll reply by email.
                      </p>
                    </div>
                  </form>
                </div>
              )}

              {activeModal === 'learn-more' && (
                <div className="space-y-10">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                      Atelier notes
                    </p>
                    <h3 className="mt-3 font-['Montserrat'] text-2xl font-semibold leading-[1.2] tracking-[-0.02em] text-ink sm:text-3xl">
                      From palette
                      <br />
                      to the dress.
                    </h3>
                    <p className="mt-4 max-w-[620px] text-base leading-[1.7] text-ink/60">
                      Use the colour profile to set the palette, read the fabric, then try colour
                      combinations on a dress on a model before the first sample.
                    </p>
                  </div>

                  <section>
                    <div className="flex items-end justify-between gap-4 border-b border-line/10 pb-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/40">
                          Colour profile
                        </p>
                        <h4 className="mt-2 text-2xl font-semibold leading-tight text-ink sm:text-3xl">
                          Not every red belongs on every skin.
                        </h4>
                      </div>
                      <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">
                        Core palette
                      </span>
                    </div>

                    <p className="mt-4 max-w-[620px] text-base leading-[1.7] text-ink/60">
                      MUSE reads tone, undertone and contrast, then builds a palette you can use for
                      client work or your own wardrobe. It holds up in daylight, evening light and on
                      camera.
                    </p>

                    <div className="mt-6 grid grid-cols-5 gap-2">
                      {PALETTE.map((swatch) => (
                        <div key={swatch.name}>
                          <div
                            className="relative h-24 border border-line/10 sm:h-36"
                            style={{ backgroundColor: swatch.hex }}
                          >
                            <span
                              className="absolute bottom-2 left-2 text-xs font-semibold uppercase tracking-[0.08em]"
                              style={{ color: swatch.ink }}
                            >
                              {swatch.code}
                            </span>
                          </div>
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-ink/60">
                            {swatch.name}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-line/10 pt-3 text-xs font-semibold uppercase tracking-[0.08em] text-ink/40">
                      <span>Seasonal palettes</span>
                      <span>Tone and undertone mapped</span>
                      <span>Daylight tested</span>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-end justify-between gap-4 border-b border-line/10 pb-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/40">
                          How it works
                        </p>
                        <h4 className="mt-2 text-2xl font-semibold leading-tight text-ink sm:text-3xl">
                          From colour call to the right dress.
                        </h4>
                      </div>
                      <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">
                        Your workflow
                      </span>
                    </div>

                    <p className="mt-4 max-w-[620px] text-base leading-[1.7] text-ink/60">
                      A colour workflow for designers and personal styling: find the combination that
                      works, then explain it.
                    </p>

                    <div className="mt-5 divide-y divide-line/10 border-y border-line/10">
                      {PROCESS_STEPS.map((step) => (
                        <div key={step.title} className="py-5">
                          <p className="text-base font-semibold text-ink">{step.title}</p>
                          <p className="mt-1 text-base leading-[1.7] text-ink/60">
                            {step.copy}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <div className="flex flex-col gap-3 border-t border-line/10 pt-6 sm:flex-row sm:items-center">
                    <button
                      onClick={onStartClick}
                      className="btn-pill-light w-full sm:w-auto"
                    >
                      Match a dress colour
                    </button>
                    <button
                      onClick={onStudioClick}
                      className="btn-ghost w-full sm:w-auto"
                    >
                      Talk to the studio
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
