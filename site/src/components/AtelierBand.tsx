import React from 'react';

interface AtelierBandProps {
  onExploreClick: () => void;
}

export const AtelierBand: React.FC<AtelierBandProps> = ({ onExploreClick }) => {
  return (
    <section id="atelier" className="mt-16 w-full scroll-mt-20 bg-[#171414] text-white sm:mt-24">
      <div className="grid w-full md:grid-cols-[0.78fr_1.22fr]">
        <div className="reveal reveal-up flex flex-col justify-between px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <div>
            <h2 className="font-['Montserrat'] text-display font-semibold tracking-[-0.02em] text-[#F7F2EF]">
              <span className="box-decoration-clone rounded-[2px] bg-[linear-gradient(90deg,#D9605C_0%,#C65D58_55%,#9E3F3B_100%)] bg-[length:100%_80%] bg-center bg-no-repeat px-3 text-[#F7F2EF] shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
                From skin
                <br />
                to the dress.
              </span>
            </h2>
            <p className="mt-5 max-w-[420px] text-base leading-[1.6] text-[#D8CCC5]">
              Build a colour profile for a client or yourself, read the fabric you're considering,
              then try dress colour combinations on a full-body model before you cut, buy or wear it.
            </p>

            <dl className="mt-8 divide-y divide-white/10 border-y border-white/10">
              <div className="py-3">
                <dt className="text-base font-semibold text-white">Colour profile</dt>
                <dd className="mt-1 text-sm leading-[1.6] text-[#B9ACA5]">
                  Capture tone, undertone and contrast, then turn it into a palette for matching
                  dress colours.
                </dd>
              </div>
              <div className="py-3">
                <dt className="text-base font-semibold text-white">Fabric colour read</dt>
                <dd className="mt-1 text-sm leading-[1.6] text-[#B9ACA5]">
                  Photograph the fabric and compare its colour with the palette before you buy the
                  cloth.
                </dd>
              </div>
              <div className="py-3">
                <dt className="text-base font-semibold text-white">Dress colour fitting</dt>
                <dd className="mt-1 text-sm leading-[1.6] text-[#B9ACA5]">
                  Try colour combinations on the dress and see how they read together on a model
                  before the first sample.
                </dd>
              </div>
            </dl>

            <button
              onClick={onExploreClick}
              className="btn-ghost mt-7"
            >
              See how colours match
            </button>
          </div>
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.08em] text-[#A99B94]">
            Atelier study / Pexels
          </p>
        </div>

        <figure className="reveal reveal-up reveal-delay-1 relative min-h-[360px] overflow-hidden md:min-h-[420px] lg:min-h-[600px]">
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
          <figcaption className="absolute bottom-4 left-4 bg-[#171414] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white sm:bottom-6 sm:left-6">
            Wardrobe / Rose light
          </figcaption>
        </figure>
      </div>
    </section>
  );
};
