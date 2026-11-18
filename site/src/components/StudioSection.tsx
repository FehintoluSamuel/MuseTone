import React from 'react';

interface StudioSectionProps {
  onStartClick: () => void;
  onStudioClick: () => void;
}

export const StudioSection: React.FC<StudioSectionProps> = ({
  onStartClick,
  onStudioClick,
}) => {
  return (
    <section
      id="studio"
      className="mx-auto mt-20 w-full max-w-[1280px] scroll-mt-20 bg-[#E5CEC9] px-4 sm:mt-28 sm:px-6 lg:px-8"
    >
      <div className="overflow-hidden bg-[#171414] text-white">
        <div className="grid lg:grid-cols-[1fr_420px]">
          <div className="px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
            <div className="reveal reveal-up max-w-[620px]">
              <h2 className="font-['Montserrat'] text-display font-semibold tracking-[-0.02em]">
                Build the look
                <br />
                before the garment.
              </h2>
              <p className="mt-5 max-w-[460px] text-base leading-[1.7] text-[#D8CCC5]">
                Create a colour profile, read the fabric, style the full look and save the
                combinations you want to return to. Use it for client work or for your own wardrobe.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <button
                  onClick={onStartClick}
                  className="btn-pill-light"
                >
                  Start a free palette
                </button>
                <button
                  onClick={onStudioClick}
                  className="btn-ghost"
                >
                  Talk to the studio
                </button>
              </div>
            </div>
          </div>

          <figure className="reveal reveal-up reveal-delay-1 relative min-h-[320px] overflow-hidden border-t border-[#3A3230] lg:min-h-0 lg:border-l lg:border-t-0">
            <img
              src="/editorial/studio-outfit.webp"
              width="1200"
              height="800"
              alt="Model in a colourful outfit in a studio"
              loading="eager"
              fetchPriority="low"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-[50%_35%]"
            />
            <figcaption className="absolute bottom-4 left-4 bg-[#171414] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white">
              Studio study / Pexels
            </figcaption>
          </figure>
        </div>
      </div>

      <footer className="reveal reveal-up reveal-delay-2 mt-8 flex flex-col gap-4 border-t border-[#CBB8B0] pt-5 text-xs font-semibold uppercase tracking-[0.08em] text-[#5A5350] sm:flex-row sm:items-center sm:justify-between">
        <span>MUSE / Colour intelligence</span>
        <div className="flex flex-wrap gap-5">
          <a href="#atelier" className="transition-colors hover:text-[#171414]">
            Colour
          </a>
          <a href="#mannequin" className="transition-colors hover:text-[#171414]">
            Studio
          </a>
          <a href="#features" className="transition-colors hover:text-[#171414]">
            Features
          </a>
          <a href="#pricing" className="transition-colors hover:text-[#171414]">
            Pricing
          </a>
        </div>
        <span>For designers and colour-led wardrobes</span>
      </footer>
    </section>
  );
};
