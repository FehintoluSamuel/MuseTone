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
      'Saved looks to revisit',
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
      'Unlimited saved looks',
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
        <div className="mx-auto max-w-[680px] text-center">
          <h2 className="font-['Montserrat'] text-[clamp(40px,5vw,64px)] font-black leading-[0.96] tracking-[-0.04em] text-white">
            Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-[620px] text-[clamp(17px,1.3vw,19px)] leading-[1.65] text-white/60">
            Start free for your own wardrobe or first client. Move to Studio for unlimited profiles
            and saved looks. Choose Atelier when the work is shared.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3 text-base font-semibold">
            <button
              type="button"
              onClick={() => setBilling('monthly')}
              aria-pressed={billing === 'monthly'}
              className={`transition-colors ${
                billing === 'monthly' ? 'text-white' : 'text-white/50 hover:text-white/80'
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
                billing === 'annual' ? 'text-white' : 'text-white/50 hover:text-white/80'
              }`}
            >
              Annual
            </button>
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#D9605C]">
              Annual costs less
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
                ? 'Annual launch price'
                : 'Monthly launch price';

            return (
              <article
                key={tier.name}
                className={`relative flex min-h-[580px] flex-col justify-between overflow-hidden rounded-[10px] border bg-[#0A0A0A] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] ${
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
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/45">
                      {tier.code}
                    </p>
                    {tier.highlight && (
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#D9605C]">
                        Recommended
                      </p>
                    )}
                  </div>

                  <h3 className="mt-6 text-[clamp(36px,3.2vw,42px)] font-bold leading-[1.05] tracking-[-0.035em] text-white">
                    {tier.name}
                  </h3>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="font-['Montserrat'] text-[clamp(60px,5.5vw,72px)] font-black leading-none tracking-[-0.04em] text-white">
                      {price}
                    </span>
                    {isPaid && (
                      <span className="text-base font-medium text-white/40">/month</span>
                    )}
                  </div>
                  <p className="mt-3 text-base font-medium text-white/55">{billingNote}</p>

                  <ul className="mt-10 grid gap-3.5 text-base font-medium leading-[1.7] text-white/60">
                    {tier.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="relative mt-12">
                  <p className="min-h-[44px] max-w-[300px] text-xs leading-[1.65] text-white/45">
                    {tier.note}
                  </p>
                  <div className="mt-5 flex justify-center">
                    <button
                      type="button"
                      onClick={isPaid ? onChoosePlan : onStartClick}
                      className="text-base font-bold tracking-[0.02em] text-white transition-colors hover:text-white/70"
                    >
                      {tier.cta}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-10 text-center text-xs font-semibold uppercase tracking-[0.08em] text-white/40">
          Launch pricing. Annual costs less. Billing is not live yet; paid access is by request.
        </p>
      </div>
    </section>
  );
};
