import React from 'react';

interface SystemSectionProps {
  onStartClick: () => void;
}

const READ = [
  { label: 'Tone', value: 'Warm' },
  { label: 'Undertone', value: 'Olive' },
  { label: 'Contrast', value: 'High' },
];

const PALETTE = ['#E9D9D1', '#D8C0B8', '#D9605C', '#B9534F', '#171414'];

export const SystemSection: React.FC<SystemSectionProps> = ({ onStartClick }) => {
  return (
    <section
      id="technology"
      className="relative mt-20 w-full scroll-mt-20 overflow-hidden bg-[#171414] py-20 text-white sm:mt-28 sm:py-28"
    >
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="font-['Montserrat'] text-[clamp(42px,5.5vw,82px)] font-black leading-[0.92] tracking-[-0.04em] text-white">
              The read,
              <br />
              made visible.
            </h2>
            <p className="mt-6 max-w-[390px] text-sm leading-relaxed text-[#D8CCC5]">
              Tone, undertone, and contrast are resolved into a palette you can explain, then
              checked against the garment and the body before a sample is cut.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <button
                onClick={onStartClick}
                className="btn-ghost"
              >
                Open a sample profile
              </button>
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#C9BDB7]">
                No selfie. No guess.
              </span>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-[#3A3230] pt-5">
              {READ.map((item) => (
                <div key={item.label}>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#C9BDB7]">
                    {item.label}
                  </dt>
                  <dd className="mt-2 text-lg font-semibold tracking-tight text-white">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-7">
            <div className="border border-[#3A3230] bg-[#211C1B]">
              <div className="flex items-center justify-between gap-3 border-b border-[#3A3230] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#C9BDB7] sm:px-5">
                <span>Sample profile</span>
                <span>01</span>
              </div>

              <div className="grid gap-4 p-4 sm:grid-cols-[1.05fr_0.95fr] sm:p-5">
                <figure className="relative min-h-[380px] overflow-hidden bg-[#D8C0B8] sm:min-h-[470px]">
                  <img
                    src="/editorial/look-leather.webp"
                    alt="Model in a black leather jacket and heels against a pale studio backdrop"
                    width="1200"
                    height="1800"
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover object-[50%_18%]"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-[#171414] px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#C9BDB7]">
                      Amara / 26
                    </p>
                    <p className="mt-1 text-xl font-semibold tracking-tight text-white">
                      Spring / Deep
                    </p>
                  </figcaption>
                </figure>

                <div className="flex flex-col divide-y divide-[#3A3230]">
                  <div className="pb-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#C9BDB7]">
                        Skin read
                      </p>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#A99B94]">
                        ITA 42
                      </span>
                    </div>
                    <dl className="mt-4 space-y-3">
                      {READ.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between gap-4 border-t border-[#3A3230] pt-3"
                        >
                          <dt className="text-xs text-[#D8CCC5]">{item.label}</dt>
                          <dd className="text-sm font-semibold text-white">{item.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="py-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#C9BDB7]">
                        Harmony
                      </p>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#A99B94]">
                        High
                      </span>
                    </div>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span className="text-xs text-[#D8CCC5]">Palette</span>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#A99B94]">
                        5 tones
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-5 gap-1.5" aria-hidden="true">
                      {PALETTE.map((hex) => (
                        <span
                          key={hex}
                          className="h-10 border border-black/10"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="pt-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#C9BDB7]">
                      Garment check
                    </p>
                    <div className="mt-3 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">Silk / Ember</p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-[#A99B94]">
                          Harmonises
                        </p>
                      </div>
                      <span className="border border-[#D9605C] px-3 py-1 text-sm font-semibold uppercase tracking-[0.1em] text-[#F7DCD8]">
                        Pass
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-3 flex items-center justify-between gap-4 border-t border-[#3A3230] pt-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#A99B94]">
              <span>Interface study / Pexels</span>
              <span>Muse / 2026</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
