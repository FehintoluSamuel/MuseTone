import React from 'react';
import { StylingStudio } from './StylingStudio';

export const MannequinStudio: React.FC = () => {
  return (
    <section
      id="mannequin"
      className="mt-20 w-full scroll-mt-20 bg-[#171414] py-16 text-white sm:mt-28 sm:py-24"
    >
      <div className="mx-auto w-full max-w-[1664px] px-4 sm:px-6 lg:px-8">
        <div className="reveal reveal-up grid gap-8 border-b border-white/15 pb-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <h2 className="font-['Montserrat'] text-display font-semibold tracking-[-0.02em] text-white">
              <span className="box-decoration-clone rounded-[2px] bg-[linear-gradient(90deg,#D9605C_0%,#C65D58_55%,#9E3F3B_100%)] bg-[length:100%_80%] bg-center bg-no-repeat px-3 text-white shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
                Try the colour
                <br />
                on the dress.
              </span>
            </h2>
          </div>

          <div className="md:justify-self-end">
            <p className="max-w-[460px] text-base leading-[1.7] text-white/70">
              Choose a dress and recolour it on a full-body model. Compare colour combinations,
              change the light and detail, and save the match that works — for a collection or your
              own wardrobe.
            </p>

          </div>
        </div>

        <div className="reveal reveal-up reveal-delay-1 mt-8 sm:mt-10">
          <StylingStudio />
        </div>

        <p className="reveal reveal-up reveal-delay-2 mt-6 text-xs font-semibold uppercase tracking-[0.08em] text-white/65">
          Build a palette, fit the dress colour, save the match.
        </p>
      </div>
    </section>
  );
};
