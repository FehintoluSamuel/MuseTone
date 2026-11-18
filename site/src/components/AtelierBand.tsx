import React from 'react';

interface AtelierBandProps {
  onExploreClick: () => void;
}

export const AtelierBand: React.FC<AtelierBandProps> = ({ onExploreClick }) => {
  return (
    <section id="atelier" className="mt-16 w-full scroll-mt-20 bg-canvas text-ink sm:mt-24">
      <div className="grid w-full md:grid-cols-[0.78fr_1.22fr]">
        <div className="reveal reveal-up flex flex-col justify-between px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <div>
            <h2 className="font-['Montserrat'] text-display font-semibold tracking-[-0.02em] text-ink">
              <span className="headline-highlight text-ink">
                From skin
                <br />
                to the dress.
              </span>
            </h2>
            <p className="mt-5 max-w-[420px] text-base leading-[1.6] text-soft">
              Build a colour profile for a client or yourself, read the fabric you're considering,
              then try dress colour combinations on a full-body model before you cut, buy or wear it.
            </p>

            <dl className="mt-8 divide-y divide-line/10 border-y border-line/10">
              <div className="py-3">
                <dt className="text-base font-semibold text-ink">Colour profile</dt>
                <dd className="mt-1 text-sm leading-[1.6] text-soft">
                  Capture tone, undertone and contrast, then turn it into a palette for matching
                  dress colours.
                </dd>
              </div>
              <div className="py-3">
                <dt className="text-base font-semibold text-ink">Fabric colour read</dt>
                <dd className="mt-1 text-sm leading-[1.6] text-soft">
                  Photograph the fabric and compare its colour with the palette before you buy the
                  cloth.
                </dd>
              </div>
              <div className="py-3">
                <dt className="text-base font-semibold text-ink">Dress colour fitting</dt>
                <dd className="mt-1 text-sm leading-[1.6] text-soft">
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
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.08em] text-faint">
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
          <figcaption className="absolute bottom-4 left-4 bg-canvas px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-ink sm:bottom-6 sm:left-6">
            Wardrobe / Rose light
          </figcaption>
        </figure>
      </div>
    </section>
  );
};
