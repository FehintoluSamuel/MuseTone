import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { EditorialHero } from './components/EditorialHero';
import { AtelierBand } from './components/AtelierBand';
import { CampaignSection } from './components/CampaignSection';
import { MotionSection } from './components/MotionSection';
import { MannequinStudio } from './components/MannequinStudio';
import { SystemSection } from './components/SystemSection';
import { ColourIndex } from './components/ColourIndex';
import { ProcessSection } from './components/ProcessSection';
import { InteractiveModals } from './components/InteractiveModals';

export default function App() {
  const [activeNav, setActiveNav] = useState('Explore');
  const [activeModal, setActiveModal] = useState<
    'start' | 'get-started' | 'learn-more' | null
  >(null);

  const handleNavClick = (nav: string) => {
    setActiveNav(nav);
    document.getElementById(nav.toLowerCase())?.scrollIntoView({ block: 'start' });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-[#E5CEC9] pb-16 selection:bg-[#B9534F] selection:text-white">
      <Navbar
        activeNav={activeNav}
        onNavClick={handleNavClick}
        onGetStartedClick={() => setActiveModal('get-started')}
      />

      <header id="explore" className="relative w-full scroll-mt-20">
        <EditorialHero onStartClick={() => setActiveModal('start')} />
      </header>

      <main className="flex w-full flex-col items-center">
        <AtelierBand onExploreClick={() => setActiveModal('learn-more')} />

        <CampaignSection onExploreClick={() => setActiveModal('learn-more')} />

        <MannequinStudio />

        <MotionSection />

        <SystemSection onStartClick={() => setActiveModal('start')} />

        <ColourIndex onExploreClick={() => setActiveModal('learn-more')} />

        <ProcessSection
          onStartClick={() => setActiveModal('start')}
          onStudioClick={() => setActiveModal('get-started')}
        />
      </main>

      <InteractiveModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}
