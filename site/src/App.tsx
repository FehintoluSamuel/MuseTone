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
    const items = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  if (new URLSearchParams(window.location.search).has('tryon-demo')) {
    return <TryOnDemo />;
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-start bg-transparent pb-16 selection:bg-[#D9605C] selection:text-white">
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
