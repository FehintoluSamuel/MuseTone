import React from 'react';

interface SystemSectionProps {
  onStartClick: () => void;
}

const STEPS = [
  {
    title: 'Skin read',
    copy: 'Tone, undertone and contrast are declared and checked, then resolved into a five-tone palette you can explain. No selfie, no guessing.',
  },
  {
    title: 'Styling studio',
    copy: 'Move through eight complete looks and six light grades, with controls for face, hair, makeup, body, accessories, tattoos and detail.',
  },
  {
    title: 'Motion study',
    copy: 'Rotate the silhouette through a 360-degree study with front and back views, so the line is read before a sample is cut.',
  },
  {
    title: 'Colour try-on',
    copy: 'Five tops are mapped to the mannequin. Recolour by mask, compare the original, and save the colour match to a look.',
  },
  {
    title: 'Saved matches',
    copy: 'Keep the colour matches that work. Reopen them from your library and compare alternatives without starting the read again.',
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
              How Muse works.
            </h2>
            <p className="mt-5 max-w-[380px] text-base leading-[1.7] text-white/55">
              Five moves from skin read to saved match, before the first stitch.
            </p>
            <button
              onClick={onStartClick}
              className="mt-8 text-base font-semibold text-white underline decoration-[#D9605C] decoration-2 underline-offset-4 transition-colors hover:text-[#F7DCD8]"
            >
              Start with a skin read
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
