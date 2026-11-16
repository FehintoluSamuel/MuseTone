import React from 'react';
import { MannequinViewer } from './MannequinViewer';

const READS = [
  { label: 'Tone', value: 'Warm' },
  { label: 'Undertone', value: 'Olive' },
  { label: 'Contrast', value: 'High' },
];

export const MannequinStudio: React.FC = () => {
  return (
    <section
      id="mannequin"
      className="mt-20 w-full scroll-mt-20 bg-[#D8C0B8] py-16 sm:mt-28 sm:py-24"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-4 sm:px-6 md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-10 lg:gap-16 lg:px-8">
        <div>
          <h2 className="font-['Montserrat'] text-[clamp(40px,6vw,82px)] font-black leading-[0.92] tracking-[-0.035em] text-[#171414]">
            On the
            <br />
            body.
          </h2>
          <p className="mt-6 max-w-[430px] text-sm leading-relaxed text-[#4F4844]">
            A palette only matters when it meets a body. Rotate the form, change the garment
            colour, and see how the same read holds across tone and light.
          </p>

          <dl className="mt-8 grid max-w-[430px] grid-cols-3 gap-4 border-t border-[#B99F97] pt-5">
            {READS.map((read) => (
              <div key={read.label}>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#4F4844]">
                  {read.label}
                </dt>
                <dd className="mt-1 text-lg font-semibold text-[#171414]">{read.value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#4F4844]">
            3D study / Interactive dress form
          </p>
        </div>

        <div className="mx-auto w-full max-w-[520px] border border-[#B99F97] bg-[#171414] p-2 sm:p-3 md:max-w-none">
          <MannequinViewer />
        </div>
      </div>
    </section>
  );
};
