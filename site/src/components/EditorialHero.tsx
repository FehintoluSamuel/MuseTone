import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

interface EditorialHeroProps {
  onStartClick: () => void;
}

export const EditorialHero: React.FC<EditorialHeroProps> = ({ onStartClick }) => {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduceMotion) return;

    const play = () => {
      video.play().catch(() => undefined);
    };

    play();
    video.addEventListener('canplay', play);
    return () => video.removeEventListener('canplay', play);
  }, [reduceMotion]);

  return (
    <section
      ref={heroRef}
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#171414] text-white lg:max-h-[1000px]"
    >
      <motion.div
        aria-hidden="true"
        style={reduceMotion ? { scale: 1 } : { scale: mediaScale }}
        className="absolute inset-0 -z-20"
      >
        {reduceMotion ? (
          <img
            src="/editorial/atelier-wide.webp"
            width="1600"
            height="900"
            alt=""
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-[50%_45%] brightness-[0.58] saturate-[0.82]"
          />
        ) : (
          <video
            ref={videoRef}
            src="/editorial/atelier-loop.mp4"
            poster="/editorial/atelier-wide.webp"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover object-[50%_45%] brightness-[0.58] saturate-[0.82]"
          />
        )}
      </motion.div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#171414]/45" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-5 pb-8 pt-28 sm:px-8 sm:pb-10 sm:pt-32 lg:px-12 lg:pb-12">
        <div className="flex justify-center">
          <div className="flex items-center gap-3 text-white/80">
            <span className="relative flex h-8 w-8 items-center justify-center" aria-hidden="true">
              <span className="absolute inset-0 rounded-[4px] border border-white/60" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#D9605C]" />
            </span>
            <span className="font-['Montserrat'] text-[11px] font-bold uppercase tracking-[0.3em] text-white/85">
              Muse
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center py-12 text-center sm:py-16">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[860px]"
          >
            <h1 className="font-['Montserrat'] text-[clamp(56px,8.6vw,96px)] font-black uppercase leading-[0.88] tracking-[-0.035em] text-white">
              Colour
              <br />
              <span className="text-[#F7DCD8]">Vision.</span>
            </h1>
            <p className="mx-auto mt-7 max-w-[540px] text-sm leading-relaxed text-white sm:text-base">
              Personal palettes, garment checks, and mannequin previews, before the first stitch.
            </p>
            <button
              id="btn-start-free-pill"
              onClick={onStartClick}
              className="mt-8 inline-flex items-center bg-[#B9534F] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#A84440]"
            >
              Build a palette
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 items-end gap-4 border-t border-white/25 pt-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/85 sm:flex sm:justify-between">
          <span>Personal / Studio</span>
          <span className="hidden sm:inline">Colour intelligence / 2026</span>
          <span>Atelier study / Pexels</span>
        </div>
      </div>
    </section>
  );
};
