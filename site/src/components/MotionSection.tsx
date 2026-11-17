import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Pause, Play } from 'lucide-react';

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

interface CaptionProps {
  label: string;
  credit?: string;
}

const Caption: React.FC<CaptionProps> = ({ label, credit = 'Pexels' }) => (
  <figcaption className="mt-3 flex items-center justify-between gap-3 border-t border-[#CBB8B0] pt-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#5A5350]">
    <span>{label}</span>
    <span>{credit}</span>
  </figcaption>
);

interface VideoTileProps {
  src: string;
  poster: string;
  label: string;
  description: string;
  delay?: number;
  className?: string;
  frameClassName?: string;
}

const VideoTile: React.FC<VideoTileProps> = ({
  src,
  poster,
  label,
  description,
  delay = 0,
  className = '',
  frameClassName = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const reduceMotion = useReducedMotion();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduceMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!userPaused.current) {
            void video.play().catch(() => setIsPlaying(false));
          }
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [reduceMotion]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      userPaused.current = false;
      void video.play().catch(() => setIsPlaying(false));
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  return (
    <motion.figure
      initial={reduceMotion ? false : reveal.initial}
      whileInView={reduceMotion ? undefined : reveal.whileInView}
      viewport={reveal.viewport}
      transition={reduceMotion ? undefined : { ...reveal.transition, delay }}
      className={className}
    >
      <div
        className={`group relative overflow-hidden bg-[#171414] ${frameClassName}`}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay={!reduceMotion}
          preload="auto"
          aria-label={description}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
        />
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={isPlaying ? `Pause ${label}` : `Play ${label}`}
          className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center border border-white/40 bg-[#171414] text-white transition-colors hover:bg-[#2A2422]"
        >
          {isPlaying ? (
            <Pause className="h-3.5 w-3.5" fill="currentColor" />
          ) : (
            <Play className="ml-0.5 h-3.5 w-3.5" fill="currentColor" />
          )}
        </button>
      </div>
      <Caption label={label} />
    </motion.figure>
  );
};

export const MotionSection: React.FC = () => {
  return (
    <section
      id="motion"
      className="mx-auto mt-20 w-full max-w-[1280px] scroll-mt-20 bg-[#E5CEC9] px-4 sm:mt-28 sm:px-6 lg:px-8"
    >
      <div className="border-t border-[#CBB8B0] pt-8 sm:pt-10">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-8">
            <h2 className="font-['Montserrat'] text-[clamp(48px,7vw,96px)] font-black leading-[0.88] tracking-[-0.04em] text-[#171414]">
              See how the
              <br />
              colour moves.
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="max-w-[380px] text-base leading-[1.7] text-[#5A5350]">
              Watch a look in motion to judge how the fabric behaves in real light. Use it to choose
              colours that still work when the garment moves, not just when it's standing still.
            </p>
            <ul className="mt-5 space-y-2 border-t border-[#CBB8B0] pt-4 text-sm font-medium leading-[1.6] text-[#5A5350]">
              <li>Check colour in movement</li>
              <li>Compare complete looks</li>
              <li>Pause on the frame you need</li>
            </ul>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#5A5350]">
              Motion preview / pause to hold a frame
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2">
          <VideoTile
            src="/motion/red-motion.mp4"
            poster="/motion/red-motion-poster.webp"
            label="Red dress / Colour in motion"
            description="Model in a red dress moving under studio light"
            frameClassName="h-[440px] sm:h-[460px] lg:h-[560px]"
          />
          <VideoTile
            src="/motion/suit-motion.mp4"
            poster="/motion/suit-motion-poster.webp"
            label="Black suit / Colour in motion"
            description="Model in a black suit moving under studio light"
            delay={0.08}
            frameClassName="h-[440px] sm:h-[460px] lg:h-[560px]"
          />
        </div>
      </div>
    </section>
  );
};
