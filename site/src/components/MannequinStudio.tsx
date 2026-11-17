import React from 'react';
import { StylingStudio } from './StylingStudio';

const READS = [
  { label: 'Tone', value: 'Deep' },
  { label: 'Undertone', value: 'Warm' },
  { label: 'Contrast', value: 'High' },
];

export const MannequinStudio: React.FC = () => {
  return (
    <section
      id="mannequin"
      className="mt-20 w-full scroll-mt-20 bg-[#171414] py-16 text-white sm:mt-28 sm:py-24"
    >
      <div className="mx-auto w-full max-w-[1664px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 border-b border-white/15 pb-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
              MUSE / Virtual styling studio
            </p>
            <h2 className="mt-3 font-['Montserrat'] text-[clamp(40px,6vw,82px)] font-black leading-[0.92] tracking-[-0.035em] text-white">
              On the
              <br />
              body.
            </h2>
          </div>

          <div className="md:justify-self-end">
            <p className="max-w-[430px] text-sm leading-relaxed text-white/65">
              A full-body cut-out study. Build the look, move through the tabs, and watch the same
              face and pose hold across eight outfits and six grades of light.
            </p>

            <dl className="mt-6 grid max-w-[430px] grid-cols-3 gap-4 border-t border-white/15 pt-5">
              {READS.map((read) => (
                <div key={read.label}>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/50">
                    {read.label}
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-white">{read.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-8 sm:mt-10">
          <StylingStudio />
        </div>

        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/65">
          Full-body cut-out study / Pexels / 08 looks
        </p>
      </div>
    </section>
  );
};
