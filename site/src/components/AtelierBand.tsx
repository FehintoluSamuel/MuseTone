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
            <h2 className="font-['Montserrat'] text-[clamp(44px,5.8vw,82px)] font-black leading-[0.9] tracking-[-0.04em] text-[#F7F2EF]">
              <span className="box-decoration-clone rounded-[2px] bg-[linear-gradient(90deg,#D9605C_0%,#C65D58_55%,#9E3F3B_100%)] bg-[length:100%_80%] bg-center bg-no-repeat px-3 text-[#F7F2EF] shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
                From skin
                <br />
                to sample.
              </span>
            </h2>
            <p className="mt-6 max-w-[420px] text-[17px] leading-[1.7] text-[#D8CCC5]">
              Use MUSE to build a colour profile for a client or for yourself, read the fabric
              you're considering, and see how the palette looks on a full-body model before you cut,
              buy or wear it.
            </p>

            <dl className="mt-8 divide-y divide-white/10 border-y border-white/10">
              <div className="grid grid-cols-[38px_1fr] gap-3 py-3">
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[#A99B94]">
                  →
                </dt>
                <dd>
                  <p className="text-base font-semibold text-white">Colour profile</p>
                  <p className="mt-1 text-sm leading-[1.6] text-[#B9ACA5]">
                    Capture tone, undertone and contrast, then turn it into a palette you can use and
                    explain.
                  </p>
                </dd>
              </div>
              <div className="grid grid-cols-[38px_1fr] gap-3 py-3">
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[#A99B94]">
                  →
                </dt>
                <dd>
                  <p className="text-base font-semibold text-white">Fabric colour read</p>
                  <p className="mt-1 text-sm leading-[1.6] text-[#B9ACA5]">
                    Photograph a fabric and compare its colour with the palette before you buy the
                    cloth.
                  </p>
                </dd>
              </div>
              <div className="grid grid-cols-[38px_1fr] gap-3 py-3">
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[#A99B94]">
                  →
                </dt>
                <dd>
                  <p className="text-base font-semibold text-white">Full-body preview</p>
                  <p className="mt-1 text-sm leading-[1.6] text-[#B9ACA5]">
                    See the palette on a model, so you know how the colours read together before the
                    first sample.
                  </p>
                </dd>
              </div>
            </dl>

            <button
              onClick={onExploreClick}
              className="btn-ghost mt-7"
            >
              See the colour workflow
            </button>
          </div>
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.08em] text-[#A99B94]">
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
          <figcaption className="absolute bottom-4 left-4 bg-[#171414] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white sm:bottom-6 sm:left-6">
            Wardrobe / Rose light
          </figcaption>
        </figure>
      </div>
    </section>
  );
};
