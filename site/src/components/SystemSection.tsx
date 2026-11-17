import React from 'react';

interface SystemSectionProps {
  onStartClick: () => void;
}

const STEPS = [
  {
    title: 'Build a colour profile',
    copy: 'Capture tone, undertone and contrast for a client or yourself, then turn it into a palette you can explain and reuse.',
  },
  {
    title: 'Read a fabric',
    copy: 'Photograph the cloth you are considering and compare its colour with the palette before you buy or cut.',
  },
  {
    title: 'Style the full look',
    copy: 'Dress a full-body model, change garment, light and detail, and compare complete outfits side by side.',
  },
  {
    title: 'Test colour on the body',
    copy: 'Recolour a garment on the model, compare it with the original, and save the match that works.',
  },
  {
    title: 'Keep the matches',
    copy: 'Return to saved looks, compare alternatives and reuse the colour decisions that worked.',
  },
];

export const SystemSection: React.FC<SystemSectionProps> = ({ onStartClick }) => {
  return (
    <section
      id="features"
      className="relative mt-20 w-full scroll-mt-20 overflow-hidden bg-[#171414] py-20 text-white sm:mt-28 sm:py-28"
    >
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.35fr)] lg:gap-20 xl:gap-28">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="max-w-[440px] font-['Montserrat'] text-[clamp(36px,3.8vw,54px)] font-bold leading-[1.02] tracking-[-0.04em] text-white">
              What you can
              <br />
              do in MUSE.
            </h2>
            <p className="mt-5 max-w-[380px] text-base leading-[1.7] text-white/55">
              Everything you need to make the colour call, from a client profile to a saved look.
            </p>
            <button
              onClick={onStartClick}
              className="mt-8 text-base font-semibold text-white underline decoration-[#D9605C] decoration-2 underline-offset-4 transition-colors hover:text-[#F7DCD8]"
            >
              Start free with a colour profile
            </button>
          </div>

          <div className="border-t border-white/10">
            {STEPS.map((step, index) => (
              <article
                key={step.title}
                className="grid gap-4 border-b border-white/10 py-8 sm:grid-cols-[96px_minmax(0,1fr)] sm:gap-8 sm:py-10 lg:grid-cols-[120px_minmax(0,1fr)] lg:py-11"
              >
                <div className="font-['Montserrat'] text-[clamp(52px,6vw,80px)] font-bold leading-none tracking-[-0.04em] text-white">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <p className="max-w-[62ch] text-[clamp(17px,1.2vw,20px)] leading-[1.65] text-white/65">
                  <span className="font-semibold text-white">{step.title}.</span> {step.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
