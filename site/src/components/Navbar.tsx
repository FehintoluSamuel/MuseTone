import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 top-0 z-50 border-b border-[#3A3230] bg-[#171414]"
    >
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a
          href="#explore"
          id="nav-logo"
          className="group flex cursor-pointer items-center gap-2.5 text-white transition-colors hover:text-[#F7DCD8]"
          onClick={(e) => {
            e.preventDefault();
            setMobileMenuOpen(false);
            onNavClick('Explore');
          }}
        >
          <div className="relative flex h-5 w-5 items-center justify-center">
            <div className="h-[18px] w-[18px] rounded-[2px] border-[1.75px] border-white transition-transform group-hover:scale-105" />
            <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-[#D9605C]" />
          </div>
          <span className="font-sans text-lg font-bold tracking-tight text-white sm:text-xl">
            Muse
          </span>
        </a>

        <div
          id="desktop-nav-links"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex lg:gap-9"
        >
          {NAV_ITEMS.map((item) => {
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
                className={`relative cursor-pointer py-1 text-sm tracking-normal transition-colors duration-200 ${
                  isActive
                    ? 'font-semibold text-white'
                    : 'font-medium text-[#C9BDB7] hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#D9605C]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </div>

        <div className="hidden items-center md:flex">
          <motion.button
            id="btn-get-started-nav"
            onClick={onGetStartedClick}
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
            className="cursor-pointer bg-[#B9534F] px-5 py-2.5 text-sm font-semibold tracking-normal text-white transition-colors duration-200 hover:bg-[#A84440]"
          >
            Get Started
          </motion.button>
        </div>

        <div className="flex items-center md:hidden">
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="border border-[#3A3230] bg-[#2A2422] p-2 text-white transition-colors hover:bg-[#3A3230]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute left-0 right-0 top-full z-50 border-b border-[#3A3230] bg-[#171414] p-4 shadow-2xl"
          >
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => {
                    onNavClick(item.label);
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 text-left text-base font-medium text-[#D8CCC5] transition-colors hover:bg-[#2A2422] hover:text-white"
                >
                  {item.label}
                </button>
              ))}
              <div className="mt-2 border-t border-[#3A3230] pt-3">
                <button
                  id="btn-get-started-mobile"
                  onClick={() => {
                    onGetStartedClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-[#B9534F] py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#A84440]"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
