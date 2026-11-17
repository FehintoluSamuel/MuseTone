import React from 'react';

interface ProcessSectionProps {
  onStartClick: () => void;
  onStudioClick: () => void;
}

const STEPS = [
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

export const ProcessSection: React.FC<ProcessSectionProps> = ({
  onStartClick,
  onStudioClick,
}) => {
  return (
    <>
      <section
        id="process"
        className="mx-auto mt-20 w-full max-w-[1280px] scroll-mt-20 bg-[#E5CEC9] px-4 sm:mt-28 sm:px-6 lg:px-8"
      >
        <div className="border-t border-[#CBB8B0] pt-8 sm:pt-10">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-7">
              <h2 className="font-['Montserrat'] text-[clamp(40px,6vw,84px)] font-black leading-[0.92] tracking-[-0.04em] text-[#171414]">
                From skin tone
                <br />
                to a finished
                <br />
                look.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="max-w-[360px] text-sm leading-relaxed text-[#5A5350]">
                A deterministic colour workflow for designers who need to explain the decision,
                not just make it.
              </p>
            </div>
          </div>

          <div className="mt-12 sm:mt-16">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className="group grid grid-cols-[64px_1fr] items-start gap-5 border-t border-[#CBB8B0] py-8 last:border-b sm:grid-cols-[120px_1fr] sm:gap-8 sm:py-12 lg:grid-cols-[190px_1fr] lg:gap-12"
              >
                <div className="font-['Montserrat'] text-[52px] font-black leading-[0.78] tracking-[-0.04em] text-[#171414] sm:text-[84px] lg:text-[96px]">
                  <span aria-hidden="true">0{index + 1}</span>
                  <span className="sr-only">Step {index + 1}</span>
                </div>
                <div className="grid gap-3 pt-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-baseline lg:gap-12">
                  <h3 className="text-2xl font-semibold leading-tight tracking-[-0.03em] text-[#171414] sm:text-3xl">
                    {step.title}
                  </h3>
                  <p className="max-w-[460px] text-sm leading-relaxed text-[#5A5350]">
                    {step.copy}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-stretch gap-3 border-t border-[#CBB8B0] pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
            <button
              onClick={onStartClick}
              className="btn-pill-dark w-full sm:w-auto"
            >
              Start a colour profile
            </button>
            <button
              onClick={onStudioClick}
              className="btn-ghost-dark w-full -translate-y-[5%] sm:w-auto"
            >
              Studio plans
            </button>
          </div>
        </div>
      </section>

      <section
        id="studio"
        className="mx-auto mt-20 w-full max-w-[1280px] scroll-mt-20 bg-[#E5CEC9] px-4 sm:mt-28 sm:px-6 lg:px-8"
      >
        <div className="overflow-hidden bg-[#171414] text-white">
          <div className="grid lg:grid-cols-[1fr_420px]">
            <div className="px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
              <div className="max-w-[620px]">
                <h2 className="font-['Montserrat'] text-[clamp(38px,5vw,68px)] font-black leading-[0.96] tracking-[-0.04em]">
                  Build the look
                  <br />
                  before the garment.
                </h2>
                <p className="mt-5 max-w-[430px] text-sm leading-relaxed text-[#D8CCC5]">
                  Start with one palette. Keep every client, fitting, and colour decision in one
                  place.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <button
                    onClick={onStartClick}
                    className="btn-pill-light"
                  >
                    Start free
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

            <figure className="relative min-h-[320px] overflow-hidden border-t border-[#3A3230] lg:min-h-0 lg:border-l lg:border-t-0">
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
              <figcaption className="absolute bottom-4 left-4 bg-[#171414] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-white">
                Studio study / Pexels
              </figcaption>
            </figure>
          </div>
        </div>

        <footer className="mt-8 flex flex-col gap-4 border-t border-[#CBB8B0] pt-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5A5350] sm:flex-row sm:items-center sm:justify-between">
          <span>Muse / 2026</span>
          <div className="flex flex-wrap gap-5">
            <a href="#motion" className="transition-colors hover:text-[#171414]">
              Motion
            </a>
            <a href="#palettes" className="transition-colors hover:text-[#171414]">
              Palettes
            </a>
            <a href="#technology" className="transition-colors hover:text-[#171414]">
              Technology
            </a>
            <a href="#studio" className="transition-colors hover:text-[#171414]">
              Studio
            </a>
          </div>
          <span>Colour intelligence / 2026</span>
        </footer>
      </section>
    </>
  );
};
