import React, { useState } from 'react';

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
    code: '01 / Free',
    name: 'Read',
    monthly: 0,
    annual: 0,
    cta: 'Start free',
    features: [
      '1 colour profile',
      '8 studio looks',
      '5 try-on tops',
      '360° motion study',
      'Save up to 3 looks',
    ],
    note: 'No card required. One profile and three saved looks.',
  },
  {
    code: '02 / Individual',
    name: 'Studio',
    monthly: 19,
    annual: 15,
    cta: 'Choose Studio',
    highlight: true,
    features: [
      'Everything in Read',
      'Unlimited colour profiles',
      '6 light grades',
      'Full colour index',
      'Unlimited saved looks',
      'Priority email support',
    ],
    note: 'For one stylist. Cancel anytime.',
  },
  {
    code: '03 / Team',
    name: 'Atelier',
    monthly: 49,
    annual: 39,
    cta: 'Talk to the studio',
    features: [
      'Everything in Studio',
      'Multi-client profiles',
      'Shared palettes',
      'Team seats',
      'Early access to garment drops',
      'Dedicated studio support',
    ],
    note: 'For teams. Fair-use limits apply.',
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
        <div className="mx-auto max-w-[560px] text-center">
          <h2 className="font-['Montserrat'] text-[30px] font-bold leading-[1.1] tracking-[-0.03em] text-white">
            Pricing
          </h2>
          <p className="mt-4 text-base font-medium leading-[1.7] text-white/50">
            Choose the tier that matches how you work. Move up when the studio needs more colour,
            more looks, or more room for clients.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3 text-sm font-semibold">
            <button
              type="button"
              onClick={() => setBilling('monthly')}
              aria-pressed={billing === 'monthly'}
              className={`transition-colors ${
                billing === 'monthly' ? 'text-white' : 'text-white/35 hover:text-white/70'
              }`}
            >
              Monthly
            </button>
            <span className="text-white/20">/</span>
            <button
              type="button"
              onClick={() => setBilling('annual')}
              aria-pressed={billing === 'annual'}
              className={`transition-colors ${
                billing === 'annual' ? 'text-white' : 'text-white/35 hover:text-white/70'
              }`}
            >
              Annual
            </button>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#D9605C]">
              Save 20%
            </span>
          </div>
        </div>

        <div className="mt-16 grid gap-8 min-[900px]:grid-cols-2 min-[1280px]:grid-cols-3">
          {TIERS.map((tier) => {
            const isPaid = tier.monthly > 0;
            const price = isPaid
              ? `$${billing === 'annual' ? tier.annual : tier.monthly}`
              : 'Free';
            const billingNote = !isPaid
              ? 'No card required'
              : billing === 'annual'
                ? 'Billed annually'
                : 'Billed monthly';

            return (
              <article
                key={tier.name}
                className={`relative flex min-h-[540px] flex-col justify-between overflow-hidden rounded-[10px] border bg-[#0A0A0A] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] ${
                  tier.highlight
                    ? 'border-[#D9605C]/50'
                    : 'border-white/[0.06]'
                }`}
              >
                {tier.highlight && (
                  <>
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(217,96,92,0.16),transparent_55%)]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#D9605C] to-transparent"
                    />
                  </>
                )}

                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
                      {tier.code}
                    </p>
                    {tier.highlight && (
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#D9605C]">
                        Recommended
                      </p>
                    )}
                  </div>

                  <h3 className="mt-6 text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-white">
                    {tier.name}
                  </h3>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="font-['Montserrat'] text-[56px] font-bold leading-none tracking-[-0.04em] text-white">
                      {price}
                    </span>
                    {isPaid && (
                      <span className="text-sm font-medium text-white/30">/month</span>
                    )}
                  </div>
                  <p className="mt-3 text-sm font-medium text-white/50">{billingNote}</p>

                  <ul className="mt-10 grid gap-3 text-sm font-medium leading-[1.7] text-white/50">
                    {tier.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="relative mt-12">
                  <p className="min-h-[38px] max-w-[280px] text-[11px] leading-[1.7] text-white/35">
                    {tier.note}
                  </p>
                  <div className="mt-5 flex justify-center">
                    <button
                      type="button"
                      onClick={isPaid ? onChoosePlan : onStartClick}
                      className="text-sm font-bold tracking-[0.04em] text-white transition-colors hover:text-white/70"
                    >
                      {tier.cta}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-10 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-white/35">
          Monthly plans can be cancelled anytime. Annual billing saves 20%.
        </p>
      </div>
    </section>
  );
};
