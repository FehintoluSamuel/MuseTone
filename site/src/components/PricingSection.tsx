import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface PricingSectionProps {
  onStartClick: () => void;
  onChoosePlan: () => void;
}

interface Tier {
  code: string;
  name: string;
  monthly: number;
  annual: number;
  cta: string;
  features: string[];
  note: string;
  highlight?: boolean;
}

const TIERS: Tier[] = [
  {
    code: 'Start here',
    name: 'Read',
    monthly: 0,
    annual: 0,
    cta: 'Start free',
    features: [
      'A full colour profile',
      'Fabric colour reads',
      'Styling studio access',
      'Turntable outfit previews',
      'Saved colour matches to revisit',
    ],
    note: 'For personal wardrobes and first client work. No card required.',
  },
  {
    code: 'Solo studio',
    name: 'Studio',
    monthly: 19,
    annual: 15,
    cta: 'Request Studio access',
    highlight: true,
    features: [
      'Everything in Read',
      'Unlimited client profiles',
      'Unlimited saved colour matches',
      'Full colour index',
      'More light conditions',
      'Priority email support',
    ],
    note: 'For independent designers and stylists. Access by request.',
  },
  {
    code: 'Shared studio',
    name: 'Atelier',
    monthly: 49,
    annual: 39,
    cta: 'Talk to the studio',
    features: [
      'Everything in Studio',
      'Shared client profiles and palettes',
      'Team access for your studio',
      'Early access to garment drops',
      'Dedicated studio support',
    ],
    note: 'For studios working across clients. Access by request.',
  },
];

export const PricingSection: React.FC<PricingSectionProps> = ({
  onStartClick,
  onChoosePlan,
}) => {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  return (
    <section
      id="pricing"
      className="relative w-full scroll-mt-20 overflow-hidden bg-[#0A0A0A] py-20 text-white sm:py-24"
    >
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="reveal reveal-up mx-auto max-w-[680px] text-center">
          <h2 className="font-['Montserrat'] text-section font-semibold tracking-[-0.02em] text-white">
            Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-[620px] text-base leading-[1.6] text-white/60">
            Start free to match dress colours for your own wardrobe or first client. Move to Studio
            for unlimited profiles and saved looks. Choose Atelier when the work is shared.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <div
              role="group"
              aria-label="Billing period"
              className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1"
            >
              {(['monthly', 'annual'] as const).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setBilling(period)}
                  aria-pressed={billing === period}
                  className={`min-h-[44px] rounded-full px-7 text-base font-semibold capitalize transition-colors sm:px-9 ${
                    billing === period
                      ? 'bg-white text-[#171414]'
                      : 'text-white/55 hover:text-white'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#D9605C]">
              Annual costs less
            </p>
          </div>
        </div>

        <div className="mt-14 grid items-stretch gap-5 sm:mt-16 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {TIERS.map((tier, index) => {
            const isPaid = tier.monthly > 0;
            const price = isPaid
              ? `$${billing === 'annual' ? tier.annual : tier.monthly}`
              : 'Free';
            const billingNote = !isPaid
              ? 'No card required'
              : billing === 'annual'
                ? 'Annual launch price'
                : 'Monthly launch price';
            const isLast = index === TIERS.length - 1;

            return (
              <article
                key={tier.name}
                className={`reveal reveal-up reveal-delay-${index + 1} relative flex min-h-[520px] flex-col overflow-hidden rounded-[10px] border bg-[#0D0D0D] p-6 sm:p-8 ${
                  isLast
                    ? 'md:col-span-2 md:w-[calc(50%-0.75rem)] md:justify-self-center lg:col-span-1 lg:w-auto lg:justify-self-stretch'
                    : ''
                } ${tier.highlight ? 'border-[#D9605C]/40' : 'border-white/[0.08]'}`}
              >
                {tier.highlight && (
                  <>
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(217,96,92,0.16),transparent_60%)]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#D9605C] to-transparent"
                    />
                  </>
                )}

                <div className="relative flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/45">
                    {tier.code}
                  </p>
                  {tier.highlight && (
                    <span className="rounded-full border border-[#D9605C]/40 bg-[#D9605C]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#F0A39E]">
                      Recommended
                    </span>
                  )}
                </div>

                <h3 className="relative mt-5 text-xl font-semibold leading-[1.2] tracking-[-0.01em] text-white">
                  {tier.name}
                </h3>

                <div className="relative mt-5 flex items-baseline gap-2">
                  <span className="font-['Montserrat'] text-price font-semibold tracking-[-0.02em] text-white">
                    {price}
                  </span>
                  {isPaid && (
                    <span className="text-base font-medium text-white/40">/month</span>
                  )}
                </div>
                <p className="relative mt-2 text-base font-medium text-white/55">{billingNote}</p>

                <ul className="relative mt-8 grid gap-3.5 text-base font-medium leading-[1.7] text-white/60">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        aria-hidden="true"
                        className="mt-[7px] h-4 w-4 shrink-0 text-[#D9605C]"
                        strokeWidth={2.25}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="relative mt-auto pt-8">
                  <div className="border-t border-white/[0.08] pt-5">
                    <p className="min-h-[44px] text-xs leading-[1.65] text-white/45">{tier.note}</p>
                    <button
                      type="button"
                      onClick={isPaid ? onChoosePlan : onStartClick}
                      className={`btn-pill-light mt-5 w-full ${tier.highlight ? 'btn-pill-accent' : ''}`}
                    >
                      {tier.cta}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mx-auto mt-10 max-w-[560px] text-center text-xs font-semibold uppercase leading-[1.7] tracking-[0.08em] text-white/40">
          Launch pricing. Annual costs less. Billing is not live yet; paid access is by request.
        </p>
      </div>
    </section>
  );
};
