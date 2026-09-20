import { Compass, Home, Moon, Play } from 'lucide-react';
import { ERA_META } from '../constants';
import { useAppStore } from '../store/useAppStore';
import type { Era } from '../types/receipt';

const ERA_ICONS: Record<Era, typeof Home> = { quiet: Home, wanderer: Compass, night: Moon };

/** Landing hero: the thesis, the three eras, and the door into the story (PRD: intro screen). */
export function Intro() {
  const dismissIntro = useAppStore((s) => s.dismissIntro);

  return (
    <section data-testid="intro" className="mx-auto max-w-3xl px-4 py-16 text-center lg:py-24">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-faint" data-testid="intro-eyebrow">
        Three datasets · Three eras · One life
      </p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-text lg:text-5xl" data-testid="intro-title">
        Life in Receipts
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-text-muted" data-testid="intro-thesis">
        Between 2015 and 2024, one person left behind train tickets, chai, subscriptions, credit-card
        swipes across India, and thousands of 2 AM songs. Not three lives — one life, three eras.
        This is what the receipts say changed.
      </p>

      <div className="mt-10 grid gap-4 text-left sm:grid-cols-3" data-testid="intro-eras">
        {(Object.keys(ERA_META) as Era[]).map((era) => {
          const meta = ERA_META[era];
          const Icon = ERA_ICONS[era];
          return (
            <article key={era} className="rounded-xl border border-border bg-surface p-5 shadow-xs" data-testid={`intro-era-${era}`}>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${meta.color}1a`, color: meta.color }} aria-hidden="true">
                <Icon size={20} />
              </span>
              <h2 className="mt-3 text-base font-semibold text-text">{meta.label}</h2>
              <p className="text-[11px] font-bold uppercase tracking-widest text-text-faint">{meta.years}</p>
              <p className="mt-2 text-sm leading-snug text-text-muted">{meta.blurb}</p>
            </article>
          );
        })}
      </div>

      <p className="mx-auto mt-8 max-w-xl text-sm italic leading-relaxed text-text-muted" data-testid="intro-finale">
        The last receipt in the archive is a Beach Boys track — “God Only Knows”, 15 Dec 2024, 23:06, on
        an Android phone. Every chapter here is a road that ends there.
      </p>

      <button
        type="button"
        onClick={dismissIntro}
        data-testid="begin-story"
        className="mt-8 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-gradient-to-br from-primary to-music px-6 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Play size={16} aria-hidden="true" />
        Begin the story
      </button>
    </section>
  );
}
