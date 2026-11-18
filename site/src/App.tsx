import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { EditorialHero, HeroBackdrop } from './components/EditorialHero';
import { AtelierBand } from './components/AtelierBand';
import { PricingSection } from './components/PricingSection';
import { MannequinStudio } from './components/MannequinStudio';
import { SpinShowcase } from './components/SpinShowcase';
import { SystemSection } from './components/SystemSection';
import { StudioSection } from './components/StudioSection';
import { InteractiveModals } from './components/InteractiveModals';
import { SpinDemo } from './components/SpinDemo';
import { TryOnDemo } from './components/TryOnDemo';

export default function App() {
  const [activeNav, setActiveNav] = useState('explore');
  const [activeModal, setActiveModal] = useState<
    'start' | 'get-started' | 'learn-more' | null
  >(null);

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    document.getElementById(id)?.scrollIntoView({ block: 'start' });
  };

  useEffect(() => {
    let frame = 0;
    let observer: IntersectionObserver | null = null;

    const reveal = (element: HTMLElement) => {
      if (element.classList.contains('is-visible')) return;
      element.classList.add('is-visible');
      window.setTimeout(() => element.classList.add('is-settled'), 1200);
    };

    const revealOnScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const limit = window.innerHeight * 0.95;
        document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)').forEach((element) => {
          const { top, bottom } = element.getBoundingClientRect();
          if (top < limit || bottom <= 0) reveal(element);
        });
      });
    };

    if ('IntersectionObserver' in window) {
      try {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              reveal(entry.target as HTMLElement);
              io.unobserve(entry.target);
            });
          },
          { threshold: 0, rootMargin: '0px 0px -5% 0px' }
        );
        observer = io;
        document
          .querySelectorAll<HTMLElement>('.reveal:not(.is-visible)')
          .forEach((element) => io.observe(element));
      } catch {
        observer = null;
      }
    }

    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll, { passive: true });
    window.addEventListener('resize', revealOnScroll);
    window.addEventListener('pageshow', revealOnScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('scroll', revealOnScroll);
      window.removeEventListener('resize', revealOnScroll);
      window.removeEventListener('pageshow', revealOnScroll);
    };
  }, []);

  if (new URLSearchParams(window.location.search).has('tryon-demo')) {
    return <TryOnDemo />;
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-start bg-transparent pb-16 selection:bg-accent selection:text-white">
      <HeroBackdrop />
      <div className="relative z-10 flex w-full flex-col items-center">
        <Navbar
          activeNav={activeNav}
          onNavClick={handleNavClick}
          onGetStartedClick={() => setActiveModal('start')}
        />

        <header id="explore" className="relative w-full scroll-mt-20">
          <EditorialHero onStartClick={() => setActiveModal('start')} />
        </header>

        <main className="flex w-full flex-col items-center">
          <AtelierBand onExploreClick={() => setActiveModal('learn-more')} />

          <MannequinStudio />

          <SpinShowcase />

          <SystemSection onStartClick={() => setActiveModal('start')} />

          <PricingSection
            onStartClick={() => setActiveModal('start')}
            onChoosePlan={() => setActiveModal('get-started')}
          />

          <StudioSection
            onStartClick={() => setActiveModal('start')}
            onStudioClick={() => setActiveModal('get-started')}
          />
        </main>
      </div>

      <InteractiveModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onStartClick={() => setActiveModal('start')}
        onStudioClick={() => setActiveModal('get-started')}
      />

      {new URLSearchParams(window.location.search).has('spin-demo') && <SpinDemo />}
    </div>
  );
}
