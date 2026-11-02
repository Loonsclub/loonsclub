"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

const EASE = [0.22, 1, 0.36, 1] as const;
const noop = () => () => {};

type PopupProps = {
  open: boolean;
  onClose: () => void;
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  // what happens next, shown down the dark side panel
  points: string[];
  // small chip above the form, e.g. the program being applied to
  badge?: string;
  children: ReactNode;
};

// A form popup: a dark violet panel that wipes in with an orbiting "loon" on the left, the form on the right.
// Below lg it becomes a bottom sheet with just the form.
export default function Popup({ open, onClose, eyebrow, title, intro, points, badge, children }: PopupProps) {
  const reduceMotion = useReducedMotion();
  const isClient = useSyncExternalStore(noop, () => true, () => false);
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();
  // Read the latest onClose without re-running the effect (and re-locking scroll) on every render
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const root = document.documentElement;

    // Lock the page behind, keeping the scrollbar's width so nothing shifts
    const gap = window.innerWidth - root.clientWidth;
    const prev = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
    root.style.overflow = "hidden";
    if (gap) root.style.paddingRight = `${gap}px`;

    // Land on the first field once the panel has started moving
    const focusTimer = window.setTimeout(() => {
      panel.current?.querySelector<HTMLElement>("input:not([type=hidden]), select, textarea")?.focus({ preventScroll: true });
    }, 250);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close.current();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      // Keep Tab inside the popup
      const items = Array.from(
        panel.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([type=hidden]):not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      root.style.overflow = prev.overflow;
      root.style.paddingRight = prev.paddingRight;
      opener?.focus({ preventScroll: true });
    };
  }, [open]);

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        // data-lenis-prevent: smooth scroll leaves wheel and touch inside here alone
        <motion.div
          key="popup"
          data-lenis-prevent
          className="fixed inset-0 z-100 flex items-end justify-center sm:items-center sm:p-6"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            aria-hidden
            onClick={onClose}
            className="absolute inset-0 bg-ink/55 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          />

          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative flex max-h-[92svh] w-full flex-col max-w-5xl overflow-hidden rounded-t-4xl bg-white shadow-[0_60px_120px_-30px_rgba(26,16,51,0.7)] ring-1 ring-white/10 sm:max-h-[min(54rem,calc(100svh-3rem))] sm:rounded-4xl lg:grid lg:grid-cols-[0.85fr_1.15fr]"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 80, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { y: 60, scale: 0.97 }}
            transition={reduceMotion ? { duration: 0.2 } : { type: "spring", stiffness: 260, damping: 28 }}
          >
            {/* left: the night panel, wiping in from the left */}
            <motion.aside
              className="bg-night relative hidden flex-col overflow-hidden p-10 text-white lg:flex xl:p-12"
              initial={reduceMotion ? false : { clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
            >
              <Orbit still={!!reduceMotion} />

              <motion.div
                className="relative"
                initial={reduceMotion ? false : "hidden"}
                animate="shown"
                transition={{ staggerChildren: 0.09, delayChildren: 0.35 }}
              >
                <motion.p variants={item} className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-light">
                  {eyebrow}
                </motion.p>
                <motion.p variants={item} aria-hidden className="section-title mt-4 text-[clamp(2rem,1.4rem+1.6vw,2.9rem)]">
                  {title}
                </motion.p>
                {intro && (
                  <motion.p variants={item} className="mt-5 max-w-sm leading-relaxed text-white/70">
                    {intro}
                  </motion.p>
                )}

                <ol className="mt-10">
                  {points.map((p, i) => (
                    <motion.li key={p} variants={item} className="relative flex gap-4 pb-5 last:pb-0">
                      {i < points.length - 1 && (
                        <span aria-hidden className="bg-accent-gradient absolute bottom-0 left-3.75 top-8 w-px opacity-70" />
                      )}
                      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 font-display text-xs font-semibold ring-1 ring-white/25">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="pt-1 text-[0.95rem] leading-relaxed text-white/85">{p}</span>
                    </motion.li>
                  ))}
                </ol>
              </motion.div>

              <p className="relative mt-auto pt-10 text-xs uppercase tracking-[0.2em] text-white/40">
                Loons Club · IITM Research Park, Chennai
              </p>
            </motion.aside>

            {/* right: the form */}
            <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4 sm:px-10 sm:pb-10 sm:pt-10">
              <span aria-hidden className="mx-auto mb-6 block h-1.5 w-12 rounded-full bg-ink/15 sm:hidden" />
              <div className="pr-12 lg:pr-0">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent lg:hidden">{eyebrow}</p>
                <h2 id={titleId} className="section-title mt-3 text-[2rem] lg:sr-only">
                  {title}
                </h2>
              </div>
              {badge && (
                <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent/8 px-3.5 py-1.5 text-xs font-medium text-accent ring-1 ring-accent/20 lg:mt-0">
                  <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                  {badge}
                </p>
              )}
              <motion.div
                className="mt-6"
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
              >
                {children}
              </motion.div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="group absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink ring-1 ring-ink/10 backdrop-blur transition hover:bg-ink hover:text-white sm:right-5 sm:top-5"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

const item = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
};

// Rings with two moons circling a glowing core, tucked into the panel's corner
function Orbit({ still }: { still: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 400 400" className="pointer-events-none absolute -bottom-36 -right-36 h-104 w-104 opacity-90">
      <defs>
        <radialGradient id="popup-core">
          <stop offset="0" stopColor="#e9d5ff" />
          <stop offset="0.45" stopColor="#a855f7" stopOpacity="0.65" />
          <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="70" fill="url(#popup-core)" className={still ? "" : "orbit-breathe"} />
      <circle cx="200" cy="200" r="110" fill="none" stroke="rgba(255,255,255,0.14)" />
      <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.1)" strokeDasharray="2 8" />
      <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(255,255,255,0.06)" />
      <g className={still ? "" : "orbit-spin"}>
        <circle cx="200" cy="90" r="6" fill="#fff" />
        <circle cx="200" cy="90" r="14" fill="#c4b5fd" opacity="0.25" />
      </g>
      <g className={still ? "" : "orbit-spin-reverse"}>
        <circle cx="50" cy="200" r="4" fill="#c4b5fd" />
      </g>
    </svg>
  );
}
