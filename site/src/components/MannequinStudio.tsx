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
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/55">
              MUSE / Virtual styling studio
            </p>
            <h2 className="mt-3 font-['Montserrat'] text-[clamp(46px,6.6vw,92px)] font-black leading-[0.9] tracking-[-0.04em] text-white">
              <span className="box-decoration-clone rounded-[2px] bg-[linear-gradient(90deg,#D9605C_0%,#C65D58_55%,#9E3F3B_100%)] bg-[length:100%_80%] bg-center bg-no-repeat px-3 text-white shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
                On the
                <br />
                body.
              </span>
            </h2>
          </div>

          <div className="md:justify-self-end">
            <p className="max-w-[460px] text-base leading-[1.7] text-white/70">
              A full-body cut-out study. Build the look, move through the tabs, and watch the same
              face and pose hold across eight outfits and six grades of light.
            </p>

            <dl className="mt-6 grid max-w-[430px] grid-cols-3 gap-4 border-t border-white/15 pt-5">
              {READS.map((read) => (
                <div key={read.label}>
                  <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-white/55">
                    {read.label}
                  </dt>
                  <dd className="mt-1 text-xl font-semibold text-white">{read.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-8 sm:mt-10">
          <StylingStudio />
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.08em] text-white/65">
          Full-body cut-out study / 08 looks
        </p>
      </div>
    </section>
  );
};
