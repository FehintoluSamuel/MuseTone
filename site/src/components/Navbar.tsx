import React, { useEffect, useState } from 'react';
import { Camera, LayoutGrid, Moon, SlidersHorizontal, Sparkles, Sun, Tag } from 'lucide-react';
import { NavItem } from '../types';

interface NavbarProps {
  onGetStartedClick: () => void;
  onNavClick: (id: string) => void;
  activeNav: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'explore', label: 'Explore', href: '#explore', icon: Sparkles },
  { id: 'atelier', label: 'Colour', href: '#atelier', icon: SlidersHorizontal },
  { id: 'mannequin', label: 'Studio', href: '#mannequin', icon: Camera },
  { id: 'features', label: 'Features', href: '#features', icon: LayoutGrid },
  { id: 'pricing', label: 'Pricing', href: '#pricing', icon: Tag },
];

export const Navbar: React.FC<NavbarProps> = ({
  onGetStartedClick,
  onNavClick,
  activeNav,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (event: MediaQueryListEvent) => {
      if (localStorage.getItem('muse-theme')) return;
      const next = event.matches ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      setTheme(next);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('muse-theme', next);
    setTheme(next);
  };

  const handleNavClick = (id: string) => {
    onNavClick(id);
    setMenuOpen(false);
  };

  return (
    <header className="reveal reveal-nav is-visible fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-6 sm:px-6">
      <nav
        aria-label="Primary"
        className="relative flex w-full max-w-[860px] items-center gap-2 rounded-full border border-line/[0.08] bg-nav py-2.5 pl-3 pr-3 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-[14px] sm:py-3 sm:pl-[22px] sm:pr-[18px] min-[721px]:gap-3 min-[961px]:gap-6"
      >
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line/10 text-ink transition-colors hover:bg-contrast/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 min-[721px]:hidden"
        >
          <span
            aria-hidden="true"
            className="absolute right-1.5 top-1.5 h-1 w-1 rounded-full bg-accent"
          />
          <span aria-hidden="true" className="flex h-3.5 w-4 flex-col justify-between">
            <span
              className={`h-px w-full bg-current transition-transform duration-300 ${
                menuOpen ? 'translate-y-[6.5px] rotate-45' : ''
              }`}
            />
            <span
              className={`h-px w-3/4 bg-current transition-opacity duration-300 ${
                menuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`h-px w-full bg-current transition-transform duration-300 ${
                menuOpen ? '-translate-y-[6.5px] -rotate-45' : ''
              }`}
            />
          </span>
        </button>

        <a
          href="#explore"
          id="nav-logo"
          aria-label="MUSE home"
          className="flex shrink-0 items-center gap-2.5 text-ink transition-opacity hover:opacity-80"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('explore');
          }}
        >
          <span className="relative flex h-6 w-6 items-center justify-center" aria-hidden="true">
            <span className="absolute inset-0 rounded-[3px] border-[1.5px] border-line" />
            <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span className="text-base font-semibold tracking-[-0.01em]">MUSE</span>
        </a>

        <div className="ml-auto hidden items-center gap-2.5 min-[721px]:flex min-[961px]:gap-7">
          {NAV_ITEMS.slice(1).map((item) => {
            const isActive = activeNav === item.id;
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                id={`nav-link-${item.id}`}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                className={`inline-flex cursor-pointer items-center gap-2 text-base font-medium leading-[22px] transition-colors duration-200 ${
                  isActive ? 'font-semibold text-ink' : 'text-ink/[0.78] hover:text-ink'
                }`}
              >
                <Icon aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>

        <button
          type="button"
          id="btn-theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line/10 text-ink transition-colors hover:bg-contrast/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          {theme === 'dark' ? (
            <Sun aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.8} />
          ) : (
            <Moon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.8} />
          )}
        </button>

        <button
          type="button"
          id="btn-get-started-nav"
          onClick={onGetStartedClick}
          className="btn-pill-light nav-cta ml-auto shrink-0 min-w-[84px] px-2.5 min-[721px]:ml-0 min-[721px]:min-w-[160px] min-[721px]:px-7"
        >
          <span className="hidden min-[721px]:inline">Get Started</span>
          <span className="min-[721px]:hidden">Login</span>
        </button>

        {menuOpen && (
          <div
            id="mobile-nav-menu"
            className="absolute inset-x-0 top-[calc(100%+8px)] z-50 min-[721px]:hidden"
          >
            <div className="overflow-hidden rounded-[20px] border border-line/[0.08] bg-nav p-2 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-[14px]">
                {NAV_ITEMS.slice(1).map((item, index) => {
                  const isActive = activeNav === item.id;
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.id);
                      }}
                      className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-contrast/[0.08] font-semibold text-ink'
                          : 'text-ink/[0.78] hover:bg-contrast/[0.05] hover:text-ink'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon aria-hidden="true" className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} />
                        <span>{item.label}</span>
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/40">
                        0{index + 1}
                      </span>
                    </a>
                  );
                })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
