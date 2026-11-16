import React from 'react';
import { NavItem } from '../types';

interface NavbarProps {
  onGetStartedClick: () => void;
  onNavClick: (item: string) => void;
  activeNav: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'explore', label: 'Explore', href: '#explore' },
  { id: 'motion', label: 'Motion', href: '#motion' },
  { id: 'palettes', label: 'Palettes', href: '#palettes' },
  { id: 'technology', label: 'Technology', href: '#technology' },
  { id: 'studio', label: 'Studio', href: '#studio' },
];

export const Navbar: React.FC<NavbarProps> = ({
  onGetStartedClick,
  onNavClick,
  activeNav,
}) => {
  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-6 sm:px-6">
      <nav
        aria-label="Primary"
        className="flex w-full max-w-[860px] items-center gap-4 rounded-full border border-white/[0.08] bg-[rgba(63,63,68,0.88)] py-2.5 pl-4 pr-3 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-[14px] sm:gap-6 sm:py-3 sm:pl-[22px] sm:pr-[18px]"
      >
        <a
          href="#explore"
          id="nav-logo"
          aria-label="Muse home"
          className="flex shrink-0 items-center gap-2.5 text-white transition-opacity hover:opacity-80"
          onClick={(e) => {
            e.preventDefault();
            onNavClick('Explore');
          }}
        >
          <span className="relative flex h-6 w-6 items-center justify-center" aria-hidden="true">
            <span className="absolute inset-0 rounded-[3px] border-[1.5px] border-white" />
            <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-[#D9605C]" />
          </span>
          <span className="text-sm font-semibold tracking-[0.01em]">Muse</span>
        </a>

        <div className="ml-auto hidden items-center gap-5 min-[721px]:flex min-[961px]:gap-10">
          {NAV_ITEMS.slice(1).map((item) => {
            const isActive = activeNav.toLowerCase() === item.label.toLowerCase();
            return (
              <a
                key={item.id}
                id={`nav-link-${item.id}`}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  onNavClick(item.label);
                }}
                className={`cursor-pointer text-sm leading-[21px] transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-white/[0.78] hover:text-white'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        <button
          type="button"
          id="btn-get-started-nav"
          onClick={onGetStartedClick}
          className="btn-pill-light nav-cta shrink-0"
        >
          Get Started
        </button>
      </nav>
    </header>
  );
};
