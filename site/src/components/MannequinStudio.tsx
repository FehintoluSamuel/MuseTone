import React from 'react';
import { StylingStudio } from './StylingStudio';

export const MannequinStudio: React.FC = () => {
  return (
    <section
      id="mannequin"
      className="mt-20 w-full scroll-mt-20 bg-canvas py-16 text-ink sm:mt-28 sm:py-24"
    >
      <div className="mx-auto w-full max-w-[1664px] px-4 sm:px-6 lg:px-8">
        <div className="reveal reveal-up grid gap-8 border-b border-line/15 pb-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <h2 className="font-['Montserrat'] text-display font-semibold tracking-[-0.02em] text-ink">
              <span className="headline-highlight text-ink">
                Try the colour
                <br />
                on the dress.
              </span>
            </h2>
          </div>

          <div className="md:justify-self-end">
            <p className="max-w-[460px] text-base leading-[1.7] text-ink/70">
              Choose a dress and recolour it on a full-body model. Compare colour combinations,
              change the light and detail, and save the match that works — for a collection or your
              own wardrobe.
            </p>

          </div>
        </div>

        <div className="reveal reveal-up reveal-delay-1 mt-8 sm:mt-10">
          <StylingStudio />
        </div>

        <p className="reveal reveal-up reveal-delay-2 mt-6 text-xs font-semibold uppercase tracking-[0.08em] text-ink/65">
          Build a palette, fit the dress colour, save the match.
        </p>
      </div>
    </section>
  );
};
