import { Compass, Home, Moon, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { ERA_META } from '../constants';
import { useAppStore } from '../store/useAppStore';
import type { Era } from '../types/receipt';

const ERA_ICONS: Record<Era, typeof Home> = { quiet: Home, wanderer: Compass, night: Moon };

/** Landing hero: full viewport, the thesis, the three eras, and the door into the story. */
export function Intro() {
  const dismissIntro = useAppStore((s) => s.dismissIntro);

  return (
    <section data-testid="intro" className="flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="flex w-full max-w-3xl flex-col items-center"
      >
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-text-faint" data-testid="intro-eyebrow">
          Three Datasets · Three Eras · One Life
        </p>
        <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight text-text sm:text-[4rem]" data-testid="intro-title">
          Life in <span className="text-gradient">Receipts</span>
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-text-muted" data-testid="intro-thesis">
          Between 2015 and 2024, one person left behind train tickets, chai, subscriptions, credit-card
          swipes across India, and thousands of 2 AM songs. Not three lives — one life, three eras.
          This is what the receipts say changed.
        </p>

        <div className="mt-12 grid w-full gap-4 text-left sm:grid-cols-3" data-testid="intro-eras">
          {(Object.keys(ERA_META) as Era[]).map((era) => {
            const meta = ERA_META[era];
            const Icon = ERA_ICONS[era];
            return (
              <motion.article
                key={era}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-border bg-surface p-6 transition-shadow hover:elevate-2"
                data-testid={`intro-era-${era}`}
              >
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${meta.color}1a`, color: meta.color }}
                  aria-hidden="true"
                >
                  <Icon size={21} />
                </span>
                <h2 className="mt-4 text-base font-bold text-text">{meta.label}</h2>
                <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.16em] text-text-faint">{meta.years}</p>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">{meta.blurb}</p>
              </motion.article>
            );
          })}
        </div>

        <p className="mx-auto mt-12 max-w-xl text-sm italic leading-relaxed text-text-muted" data-testid="intro-finale">
          The last receipt in the archive is a Beach Boys track — “God Only Knows”, 15 Dec 2024, 23:06, on
          an Android phone. Every chapter here is a road that ends there.
        </p>

        <motion.button
          type="button"
          onClick={dismissIntro}
          whileTap={{ scale: 0.98 }}
          data-testid="begin-story"
          className="mt-10 inline-flex min-h-[44px] items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          style={{ background: 'var(--accent-gradient)', boxShadow: 'var(--shadow-md)' }}
        >
          <Play size={16} aria-hidden="true" />
          Begin the story
        </motion.button>
      </motion.div>
    </section>
  );
}
