import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Pause, Play } from 'lucide-react';

interface CampaignSectionProps {
  onExploreClick: () => void;
}

const LOOKS = [
  {
    src: '/editorial/campaign-red.webp',
    alt: 'Woman in a red dress against a white studio backdrop',
    label: 'Red on white',
    meta: 'Campaign study / 01',
    width: 1000,
    height: 1499,
    position: 'object-[50%_28%]',
  },
  {
    src: '/editorial/studio-red.webp',
    alt: 'Model in a deep red gown against a dark studio background',
    label: 'After dark',
    meta: 'Studio study / 02',
    width: 1100,
    height: 1650,
    position: 'object-[50%_26%]',
  },
  {
    src: '/editorial/look-structure.webp',
    alt: 'Model in a layered sweater and skirt against a neutral studio backdrop',
    label: 'Soft structure',
    meta: 'Structure study / 03',
    width: 1200,
    height: 1800,
    position: 'object-[50%_24%]',
  },
  {
    src: '/editorial/look-rose.webp',
    alt: 'Model in a rose two-piece outfit seated against a white backdrop',
    label: 'Rose study',
    meta: 'Colour study / 04',
    width: 1200,
    height: 1800,
    position: 'object-[50%_28%]',
  },
  {
    src: '/editorial/look-leather.webp',
    alt: 'Model in a black leather jacket and heels against a pale studio backdrop',
    label: 'Leather edit',
    meta: 'Leather study / 05',
    width: 1200,
    height: 1800,
    position: 'object-[50%_22%]',
  },
];

export const CampaignSection: React.FC<CampaignSectionProps> = ({ onExploreClick }) => {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [manualPaused, setManualPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const figureRef = useRef<HTMLElement>(null);
  const autoplay = !reduceMotion && !manualPaused && !hovered && inView;
  const look = LOOKS[active];
  const total = String(LOOKS.length).padStart(2, '0');

  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 }
    );

    observer.observe(figure);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!autoplay) return;

    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % LOOKS.length);
    }, 5600);

    return () => window.clearTimeout(timer);
  }, [active, autoplay]);

  const pauseOnBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setHovered(false);
    }
  };

  return (
    <section
      id="campaign"
      className="mx-auto mt-20 w-full max-w-[1280px] scroll-mt-20 bg-[#E5CEC9]/85 px-4 sm:mt-28 sm:px-6 lg:px-8"
    >
      <div className="border-t border-[#CBB8B0] pt-8 sm:pt-10">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-8">
            <h2 className="font-['Montserrat'] text-[clamp(42px,6.6vw,88px)] font-black leading-[0.9] tracking-[-0.04em] text-[#171414]">
              Red,
              <br />
              recalibrated.
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="max-w-[330px] text-sm leading-relaxed text-[#5A5350]">
              An editorial study in shade and undertone, where a palette stops being a swatch and
              starts behaving on a body, in daylight, on camera.
            </p>
            <button
              onClick={onExploreClick}
              className="mt-6 inline-flex text-[13px] font-bold text-[#171414] underline decoration-[#B9534F] decoration-2 underline-offset-4 transition-colors hover:text-[#B9534F]"
            >
              See the full colour index
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-10 sm:mt-14 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-4 lg:pb-16">
            <p className="max-w-[300px] text-sm leading-relaxed text-[#5A5350]">
              Five studies, one palette. Move through the looks to see how the same read changes
              with light, fabric, and form.
            </p>

            <div className="mt-10 flex items-end justify-between gap-4 border-t border-[#CBB8B0] pt-4 sm:mt-14">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5A5350]">
                  Look
                </p>
                <p className="mt-1 text-sm font-semibold tabular-nums tracking-tight text-[#171414]">
                  {String(active + 1).padStart(2, '0')} / {total}
                </p>
              </div>

              <div className="flex items-center gap-1" aria-label="Choose a look">
                {LOOKS.map((item, index) => (
                  <button
                    key={item.meta}
                    type="button"
                    onClick={() => setActive(index)}
                    aria-label={`Go to look ${index + 1}: ${item.label}`}
                    aria-current={active === index ? 'true' : undefined}
                    className={`flex h-8 min-w-8 items-center justify-center px-1.5 text-sm font-semibold tabular-nums transition-colors ${
                      active === index
                        ? 'bg-[#171414] text-white'
                        : 'text-[#4F4844] hover:text-[#171414]'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5A5350]">
              {look.meta}
            </p>
          </div>

          <div className="lg:col-span-8">
            <figure
              ref={figureRef}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') setHovered(true);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === 'mouse') setHovered(false);
              }}
              onFocusCapture={() => setHovered(true)}
              onBlurCapture={pauseOnBlur}
              className="mx-auto w-full max-w-[540px] lg:ml-auto lg:mr-0 lg:max-w-[580px]"
            >
              <div className="relative h-[480px] overflow-hidden bg-[#171414] sm:h-[620px] lg:h-[740px]">
                {LOOKS.map((item, index) => (
                  <motion.img
                    key={item.meta}
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    loading="eager"
                    fetchPriority={index === 0 ? 'high' : 'low'}
                    decoding="async"
                    aria-hidden={active !== index}
                    initial={false}
                    animate={{
                      opacity: active === index ? 1 : 0,
                      scale: active === index ? 1 : 1.02,
                    }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={`absolute inset-0 h-full w-full object-cover ${item.position}`}
                  />
                ))}

                {!reduceMotion && (
                  <button
                    type="button"
                    onClick={() => setManualPaused((paused) => !paused)}
                    aria-label={manualPaused ? 'Resume look slideshow' : 'Pause look slideshow'}
                    className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center border border-white/40 bg-[#171414] text-white transition-colors hover:bg-[#2A2422]"
                  >
                    {manualPaused ? (
                      <Play className="ml-0.5 h-3.5 w-3.5" fill="currentColor" />
                    ) : (
                      <Pause className="h-3.5 w-3.5" fill="currentColor" />
                    )}
                  </button>
                )}
              </div>

              <figcaption className="flex items-end justify-between gap-4 bg-[#171414] px-4 py-4 text-white sm:px-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#C9BDB7]">
                    {look.meta} / Pexels
                  </p>
                  <p className="mt-1 text-xl font-semibold tracking-tight text-white">
                    {look.label}
                  </p>
                </div>
                <span className="text-sm font-semibold tabular-nums text-[#F7DCD8]">
                  {String(active + 1).padStart(2, '0')} / {total}
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};
