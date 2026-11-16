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
              The rail,
              <br />
              in colour.
            </h2>
            <p className="mt-6 max-w-[390px] text-sm leading-relaxed text-[#D8CCC5]">
              A closet is a palette before it is a wardrobe. Muse reads the pieces you already own
              and shows what belongs beside them.
            </p>
            <button
              onClick={onExploreClick}
              className="btn-ghost mt-7"
            >
              See the colour index
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
