import React, { useEffect, useRef } from 'react';

export const HeroBackdrop: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('disablepictureinpicture', '');

    const play = () => {
      if (!video.paused) return;
      const attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(() => undefined);
      }
    };

    let retry: number | undefined;
    const queuePlay = () => {
      if (retry !== undefined) window.clearTimeout(retry);
      retry = window.setTimeout(() => {
        retry = undefined;
        play();
      }, 80);
    };
    const clearRetry = () => {
      if (retry !== undefined) window.clearTimeout(retry);
      retry = undefined;
    };
    const resumeOnVisible = () => {
      if (document.visibilityState === 'visible') queuePlay();
    };
    const playNow = () => {
      clearRetry();
      play();
    };
    const restart = () => {
      video.currentTime = 0;
      play();
    };

    play();
    video.addEventListener('canplay', queuePlay);
    video.addEventListener('loadeddata', queuePlay);
    video.addEventListener('playing', clearRetry);
    video.addEventListener('ended', restart);
    document.addEventListener('visibilitychange', resumeOnVisible);
    window.addEventListener('pageshow', resumeOnVisible);
    window.addEventListener('pointerdown', playNow);
    window.addEventListener('touchstart', playNow);
    window.addEventListener('keydown', playNow);

    return () => {
      clearRetry();
      video.removeEventListener('canplay', queuePlay);
      video.removeEventListener('loadeddata', queuePlay);
      video.removeEventListener('playing', clearRetry);
      video.removeEventListener('ended', restart);
      document.removeEventListener('visibilitychange', resumeOnVisible);
      window.removeEventListener('pageshow', resumeOnVisible);
      window.removeEventListener('pointerdown', playNow);
      window.removeEventListener('touchstart', playNow);
      window.removeEventListener('keydown', playNow);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#171414]"
    >
      <video
        ref={videoRef}
        src="/editorial/heroVideo_1.mp4"
        poster="/editorial/heroVideo_1-poster.webp"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover object-[50%_45%] brightness-[0.66] saturate-[0.82]"
      />
    </div>
  );
};

interface EditorialHeroProps {
  onStartClick: () => void;
}

export const EditorialHero: React.FC<EditorialHeroProps> = ({ onStartClick }) => {
  return (
    <section
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-transparent text-white lg:max-h-[1000px]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[rgba(23,20,20,0.93)]"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-5 pb-8 pt-28 sm:px-8 sm:pb-10 sm:pt-32 lg:px-12 lg:pb-12">
        <div className="flex flex-1 flex-col items-center justify-center py-12 text-center sm:py-16">
          <div className="max-w-[860px]">
            <h1 className="reveal reveal-up is-visible font-['Montserrat'] text-hero font-semibold tracking-[-0.02em] text-white">
              Colour
              <br />
              <span className="text-[#F7DCD8]">Vision.</span>
            </h1>
            <p className="reveal reveal-up is-visible reveal-delay-1 mx-auto mt-5 max-w-[650px] text-lg leading-[1.5] text-white/85">
              Create a colour profile, read fabric colour, and see the whole look on a model before
              you cut, buy or wear it. Built for designers and for anyone who wants their outfit
              colours to work together.
            </p>
            <button
              id="btn-start-free-pill"
              onClick={onStartClick}
              className="btn-ghost reveal reveal-up is-visible reveal-delay-2 mt-6"
            >
              Build a free palette
            </button>
          </div>
        </div>

        <div className="reveal reveal-up is-visible reveal-delay-3 grid grid-cols-2 items-end gap-4 border-t border-white/25 pt-4 text-[0.56875rem] font-semibold uppercase tracking-[0.12em] text-white/85 sm:flex sm:justify-between">
          <span>Designers + outfit matching</span>
          <span className="hidden sm:inline">No selfie uploads</span>
          <span className="translate-x-[25%] sm:translate-x-0">Atelier study / Pexels</span>
        </div>
      </div>
    </section>
  );
};
