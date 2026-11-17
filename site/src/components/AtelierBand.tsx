import React from 'react';

interface AtelierBandProps {
  onExploreClick: () => void;
}

export const AtelierBand: React.FC<AtelierBandProps> = ({ onExploreClick }) => {
  return (
    <section id="atelier" className="mt-16 w-full scroll-mt-20 bg-[#171414] text-white sm:mt-24">
      <div className="grid w-full md:grid-cols-[0.78fr_1.22fr]">
        <div className="flex flex-col justify-between px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <div>
            <h2 className="font-['Montserrat'] text-[clamp(40px,6vw,76px)] font-black leading-[0.92] tracking-[-0.035em] text-[#F7F2EF]">
              <span className="box-decoration-clone rounded-[2px] bg-[linear-gradient(90deg,#D9605C_0%,#C65D58_55%,#9E3F3B_100%)] bg-[length:100%_80%] bg-center bg-no-repeat px-3 text-[#F7F2EF] shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
                The rail,
                <br />
                in colour.
              </span>
            </h2>
            <p className="mt-6 max-w-[390px] text-sm leading-relaxed text-[#D8CCC5]">
              Personal palettes, garment checks, and mannequin previews, before the first stitch.
            </p>

            <dl className="mt-8 divide-y divide-white/10 border-y border-white/10">
              <div className="grid grid-cols-[38px_1fr] gap-3 py-3">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#A99B94]">
                  01
                </dt>
                <dd>
                  <p className="text-sm font-semibold text-white">Colour index</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#A99B94]">
                    Five tones, mapped to tone, undertone and contrast.
                  </p>
                </dd>
              </div>
              <div className="grid grid-cols-[38px_1fr] gap-3 py-3">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#A99B94]">
                  02
                </dt>
                <dd>
                  <p className="text-sm font-semibold text-white">Garment check</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#A99B94]">
                    A fabric photo becomes a colour read you can explain.
                  </p>
                </dd>
              </div>
              <div className="grid grid-cols-[38px_1fr] gap-3 py-3">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#A99B94]">
                  03
                </dt>
                <dd>
                  <p className="text-sm font-semibold text-white">Mannequin preview</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#A99B94]">
                    The palette on a body before the first sample is cut.
                  </p>
                </dd>
              </div>
            </dl>

            <button
              onClick={onExploreClick}
              className="btn-ghost mt-7"
            >
              Explore the rail
            </button>
          </div>
          <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#A99B94]">
            Atelier study / Pexels
          </p>
        </div>

        <figure className="relative min-h-[360px] overflow-hidden md:min-h-[420px] lg:min-h-[600px]">
          <img
            src="/editorial/atelier-closet.webp"
            width="2400"
            height="1600"
            alt="Warm pink wardrobe filled with hanging garments in soft atelier light"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-[50%_45%]"
          />
          <figcaption className="absolute bottom-4 left-4 bg-[#171414] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-white sm:bottom-6 sm:left-6">
            Wardrobe / Rose light
          </figcaption>
        </figure>
      </div>
    </section>
  );
};
