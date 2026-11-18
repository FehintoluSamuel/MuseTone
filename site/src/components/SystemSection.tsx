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
    copy: 'Dress a full-body model, change garment, light and detail, and compare complete looks side by side.',
  },
  {
    title: 'Fit the dress colour',
    copy: 'Recolour the dress on the model, compare it with the original, and save the combination that works.',
  },
  {
    title: 'Keep the matches',
    copy: 'Return to saved matches, compare alternatives and reuse the dress colour decisions that worked.',
  },
];

export const SystemSection: React.FC<SystemSectionProps> = ({ onStartClick }) => {
  return (
    <section
      id="features"
      className="relative mt-20 w-full scroll-mt-20 overflow-hidden bg-canvas py-20 text-ink sm:mt-28 sm:py-28"
    >
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.35fr)] lg:gap-20 xl:gap-28">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="reveal reveal-up max-w-[440px] font-['Montserrat'] text-section font-semibold tracking-[-0.02em] text-ink">
              How the colour
              <br />
              fit works.
            </h2>
            <p className="reveal reveal-up reveal-delay-1 mt-5 max-w-[380px] text-base leading-[1.7] text-ink/55">
              Everything you need to choose dress colours that work together, from a client profile
              to a saved match.
            </p>
            <button
              onClick={onStartClick}
              className="reveal reveal-up reveal-delay-2 mt-8 text-base font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-soft"
            >
              Start matching dress colours
            </button>
          </div>

          <div className="reveal reveal-up reveal-delay-1 border-t border-line/10">
            {STEPS.map((step) => (
              <article key={step.title} className="border-b border-line/10 py-7">
                <p className="max-w-[62ch] text-base leading-[1.65] text-ink/65">
                  <span className="font-semibold text-ink">{step.title}.</span> {step.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
