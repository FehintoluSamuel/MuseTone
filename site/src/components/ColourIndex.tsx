import React from 'react';

interface ColourIndexProps {
  onExploreClick: () => void;
}

const SWATCHES = [
  { name: 'Shell', code: '01', hex: '#E9D9D1', ink: '#171414' },
  { name: 'Rose', code: '02', hex: '#D8C0B8', ink: '#171414' },
  { name: 'Ember', code: '03', hex: '#D9605C', ink: '#171414' },
  { name: 'Brick', code: '04', hex: '#B9534F', ink: '#FFFFFF' },
  { name: 'Ink', code: '05', hex: '#171414', ink: '#FFFFFF' },
];

export const ColourIndex: React.FC<ColourIndexProps> = ({ onExploreClick }) => {
  return (
    <section
      id="palettes"
      className="mx-auto mt-20 w-full max-w-[1280px] scroll-mt-20 bg-[#E5CEC9]/85 px-4 sm:mt-28 sm:px-6 lg:px-8"
    >
      <div className="border-t border-[#CBB8B0] pt-8 sm:pt-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="font-['Montserrat'] text-[clamp(40px,5vw,68px)] font-black leading-[0.94] tracking-[-0.04em] text-[#171414]">
              Not every red
              <br />
              belongs on
              <br />
              every skin.
            </h2>
            <p className="mt-6 max-w-[360px] text-sm leading-relaxed text-[#5A5350]">
              The engine reads tone, undertone, and contrast, then builds a palette that behaves in
              daylight, evening light, and on camera.
            </p>
            <button
              onClick={onExploreClick}
              className="mt-7 inline-flex text-[13px] font-bold text-[#171414] underline decoration-[#B9534F] decoration-2 underline-offset-4 transition-colors hover:text-[#B9534F]"
            >
              Explore the colour index
            </button>
          </div>

          <div className="flex flex-col justify-end lg:col-span-7">
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {SWATCHES.map((swatch) => (
                <div key={swatch.name} className="group">
                  <div
                    className="relative h-[190px] overflow-hidden border border-black/5 transition-transform duration-500 ease-out group-hover:-translate-y-1 sm:h-[260px] lg:h-[310px]"
                    style={{ backgroundColor: swatch.hex }}
                  >
                    <span
                      className="absolute bottom-3 left-3 text-[11px] font-semibold uppercase tracking-[0.1em]"
                      style={{ color: swatch.ink }}
                    >
                      {swatch.code}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-1 border-t border-[#CBB8B0] pt-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#171414]">
                      {swatch.name}
                    </span>
                    <span className="hidden text-[11px] uppercase tracking-[0.1em] text-[#5A5350] sm:inline">
                      {swatch.code}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#CBB8B0] pt-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5A5350]">
              <span>Seasonal palettes</span>
              <span className="hidden sm:inline">Tone and undertone mapped</span>
              <span>Daylight tested</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
