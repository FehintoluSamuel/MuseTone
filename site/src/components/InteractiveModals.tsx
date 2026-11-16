import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';

interface InteractiveModalsProps {
  activeModal: 'start' | 'get-started' | 'learn-more' | null;
  onClose: () => void;
}

export const InteractiveModals: React.FC<InteractiveModalsProps> = ({
  activeModal,
  onClose,
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

  return (
    <AnimatePresence>
      {activeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#171414]/80"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Muse dialog"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97, y: 12 }}
            className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto border border-[#CBB8B0] bg-[#EDE3DD] p-6 text-[#171414] sm:p-8"
          >
            <button
              id="modal-close-btn"
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute right-4 top-4 p-2 text-[#5A5350] transition-colors hover:bg-[#D8C0B8] hover:text-[#171414]"
            >
              <X className="h-5 w-5" />
            </button>

            {activeModal === 'start' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center bg-[#171414] text-lg font-bold text-white">
                    M
                  </div>
                  <div>
                    <span className="inline-block bg-[#D8C0B8] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#171414]">
                      Free profile
                    </span>
                    <h3 className="mt-2 text-2xl font-bold text-[#171414]">Muse Personal</h3>
                  </div>
                </div>

                <div className="divide-y divide-[#CBB8B0] border-y border-[#CBB8B0]">
                  <div className="flex items-center justify-between gap-4 py-3 text-sm">
                    <span className="text-[#5A5350]">Palette depth</span>
                    <span className="text-right font-semibold text-[#171414]">
                      Undertone + core colours
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-3 text-sm">
                    <span className="text-[#5A5350]">Garment checks</span>
                    <span className="font-semibold text-[#171414]">Daily</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-3 text-sm">
                    <span className="text-[#5A5350]">Saved boards</span>
                    <span className="font-semibold text-[#171414]">One profile</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-3">
                    <span className="text-sm text-[#5A5350]">Price</span>
                    <span className="text-2xl font-extrabold text-[#171414]">Free</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      alert('Welcome to Muse. Your palette is ready to build.');
                      onClose();
                    }}
                    className="btn-pill-dark w-full"
                  >
                    Create your palette
                  </button>
                  <p className="text-center text-xs text-[#5A5350]">
                    Upgrade any time. Your profile and boards stay with you.
                  </p>
                </div>
              </div>
            )}

            {activeModal === 'get-started' && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-[#171414]">Get started with Muse</h3>
                  <p className="text-sm text-[#5A5350]">
                    Colour intelligence for designers, stylists, and the clients they dress.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('Request received. A Muse specialist will contact you shortly.');
                    onClose();
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5A5350]">
                      Full name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amara Okafor"
                      className="w-full border border-[#CBB8B0] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B9534F]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5A5350]">
                      Business email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="amara@studio.com"
                      className="w-full border border-[#CBB8B0] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B9534F]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5A5350]">
                      I am a
                    </label>
                    <select className="w-full border border-[#CBB8B0] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B9534F]">
                      <option>Fashion designer</option>
                      <option>Stylist / image consultant</option>
                      <option>Client / individual</option>
                      <option>Studio / team</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="btn-pill-dark w-full"
                  >
                    Request early access
                  </button>
                </form>
              </div>
            )}

            {activeModal === 'learn-more' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-2xl font-bold text-[#171414]">
                    Colour decisions, made in daylight.
                  </h3>
                  <p className="mt-2 text-sm text-[#5A5350]">
                    Deterministic colour science, explainable results, and a 3D mannequin that wears
                    your client&apos;s skin tone.
                  </p>
                </div>

                <dl className="divide-y divide-[#CBB8B0] border-y border-[#CBB8B0]">
                  <div className="py-4">
                    <dt className="text-sm font-semibold text-[#171414]">Palette engine</dt>
                    <dd className="mt-1 text-sm text-[#5A5350]">
                      Tone, undertone, contrast, and seasonal mapping.
                    </dd>
                  </div>
                  <div className="py-4">
                    <dt className="text-sm font-semibold text-[#171414]">Garment scan</dt>
                    <dd className="mt-1 text-sm text-[#5A5350]">
                      Dominant colours extracted from a fabric photograph.
                    </dd>
                  </div>
                  <div className="py-4">
                    <dt className="text-sm font-semibold text-[#171414]">3D preview</dt>
                    <dd className="mt-1 text-sm text-[#5A5350]">
                      The palette on an interactive full-body mannequin before the sample is cut.
                    </dd>
                  </div>
                  <div className="py-4">
                    <dt className="text-sm font-semibold text-[#171414]">Saved boards</dt>
                    <dd className="mt-1 text-sm text-[#5A5350]">
                      Client-ready boards you can share with the studio.
                    </dd>
                  </div>
                </dl>

                <button
                  onClick={onClose}
                  className="btn-pill-dark w-full"
                >
                  Close overview
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
