"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { Session } from "../../lib/programs";
import Reveal from "../Reveal";

const pad = (n: number) => String(n).padStart(2, "0");

// Sticky index on the left rolls its counter to whichever session is in the middle of the screen
export default function SessionList({ sessions, unit }: { sessions: Session[]; unit: string }) {
  const reduceMotion = useReducedMotion();
  const cards = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(cards.current.indexOf(e.target as HTMLElement));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    cards.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const jump = (i: number) => cards.current[i]?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });

  // spotlight that follows the cursor across a card
  const track = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <div className="flex items-end gap-3 font-display">
            <span className="relative h-[7.5rem] overflow-hidden text-[7.5rem] font-extrabold leading-none tracking-[-0.06em]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={active}
                  className="text-gradient block"
                  initial={reduceMotion ? false : { y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={reduceMotion ? undefined : { y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {pad(active + 1)}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="pb-3 text-2xl font-semibold text-ink/25">/ {pad(sessions.length)}</span>
          </div>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink/40">{unit}</p>

          <ol className="mt-10 space-y-1 border-l border-ink/10">
            {sessions.map((s, i) => (
              <li key={s.title}>
                <button
                  onClick={() => jump(i)}
                  className={`relative -ml-px block w-full border-l-2 py-2.5 pl-5 text-left transition-colors ${
                    i === active ? "border-accent text-ink" : "border-transparent text-ink/40 hover:text-ink/70"
                  }`}
                >
                  <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent/80">{s.label}</span>
                  <span className="font-display font-semibold tracking-tight">{s.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </aside>

      <div className="space-y-6">
        {sessions.map((s, i) => (
          <Reveal key={s.title}>
            <article
              ref={(el) => {
                cards.current[i] = el;
              }}
              onPointerMove={track}
              className={`spotlight group relative overflow-hidden rounded-4xl bg-white p-7 ring-1 transition duration-500 sm:p-10 ${
                i === active ? "shadow-[0_40px_80px_-40px_rgba(36,18,74,0.45)] ring-accent/25" : "ring-ink/5"
              }`}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[9rem] font-extrabold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_rgba(124,58,237,0.12)]"
              >
                {pad(i + 1)}
              </span>
              <div className="relative flex flex-wrap items-center gap-2">
                <span className="bg-accent-gradient rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                  {s.label}
                </span>
                <span className="rounded-full bg-sand px-3 py-1 text-xs font-medium text-ink/70 ring-1 ring-accent/15">{s.format}</span>
              </div>
              <h3 className="relative mt-6 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{s.title}</h3>
              <p className="relative mt-4 max-w-2xl text-lg leading-relaxed text-muted">{s.summary}</p>

              <ul className="relative mt-8 grid gap-px overflow-hidden rounded-2xl bg-ink/6 ring-1 ring-ink/6 sm:grid-cols-2">
                {s.topics.map((t, j) => (
                  <li
                    key={t.title}
                    className={`bg-white/95 p-5 ${s.topics.length % 2 && j === s.topics.length - 1 ? "sm:col-span-2" : ""}`}
                  >
                    <p className="flex items-center gap-2.5 font-display font-semibold tracking-tight">
                      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                      {t.title}
                    </p>
                    <p className="mt-1.5 pl-7 text-sm leading-relaxed text-muted">{t.detail}</p>
                  </li>
                ))}
              </ul>

              {s.review && (
                <div className="relative mt-4 flex flex-col gap-3 rounded-2xl bg-sand p-5 ring-1 ring-accent/20 sm:flex-row sm:items-center sm:gap-5">
                  <span className="bg-accent-gradient inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 21V4M5 4h11l-2 4 2 4H5" />
                    </svg>
                    Review
                  </span>
                  <div>
                    <p className="font-display font-semibold tracking-tight">{s.review.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{s.review.detail}</p>
                  </div>
                </div>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
