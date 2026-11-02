"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useRef } from "react";
import { EnrollPopup } from "./FormPopups";

// Drifting flakes inside the tag: left offset, size, delay and fall time
const FLAKES = [
  { left: "12%", size: 3, delay: 0, time: 7 },
  { left: "34%", size: 2, delay: 2.4, time: 9 },
  { left: "55%", size: 3, delay: 4.1, time: 8 },
  { left: "74%", size: 2, delay: 1.2, time: 10 },
  { left: "90%", size: 2, delay: 3.3, time: 7.5 },
];

// The rope's top end is the pivot for every swing
const PIVOT = "50% 0%";
// Lands after the headline, subtext and CTA have risen in
const DROP_DELAY = 1.1;
// Past this many pixels a press counts as a pull, not a click
const PULL_THRESHOLD = 6;
// The rope gives a little when pulled down, up to this many pixels
const MAX_STRETCH = 36;
// How far the card can swing out either way, in degrees
const MAX_SWING = 40;

function Snowflake({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className={className} aria-hidden>
      <path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7" />
      <path d="M9.5 3.5 12 6l2.5-2.5M9.5 20.5 12 18l2.5 2.5M3.6 10.2l3.4-.9-.9-3.4M20.4 13.8l-3.4.9.9 3.4M3.6 13.8l3.4.9-.9 3.4M20.4 10.2l-3.4-.9.9-3.4" />
    </svg>
  );
}

// A small board hung on a rope: drops in, swings to rest, then sways gently. Opens enrollment on click.
// It can be grabbed and pulled (mouse or touch): it swings around the nail and the rope stretches a little,
// then it springs back and swings to rest when let go.
// `ropeClassName` sets the rope's length, e.g. a long one running down from the top of the page;
// `nailClassName` can hide the nail when the rope runs off the top edge instead.
export default function WinterCard({
  show,
  ropeClassName = "h-12",
  nailClassName = "",
}: {
  show: boolean;
  ropeClassName?: string;
  nailClassName?: string;
}) {
  const reduceMotion = useReducedMotion();

  // Pointer offset from where the pull started
  const pullX = useMotionValue(0);
  const pullY = useMotionValue(0);
  const ropeRef = useRef<HTMLSpanElement>(null);
  const pull = useRef<{ id: number; x: number; y: number; rope: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  // Rope length while pulled: the board follows the pointer but the rope only gives so much
  const reach = (rope: number, x: number, y: number) => Math.hypot(x, rope + y);
  const stretch = useTransform(() => {
    const rope = pull.current?.rope ?? ropeRef.current?.offsetHeight ?? 0;
    const extra = reach(rope, pullX.get(), pullY.get()) - rope;
    return extra > 0 ? MAX_STRETCH * (1 - Math.exp(-extra / (MAX_STRETCH * 2.5))) : 0;
  });
  const swing = useTransform(() => {
    const rope = pull.current?.rope ?? ropeRef.current?.offsetHeight ?? 0;
    // Distance from the nail to the board's top, so the angle tracks the pointer
    const deg = (-Math.atan2(pullX.get(), Math.max(rope + 24 + pullY.get(), 24)) * 180) / Math.PI;
    return Math.max(-MAX_SWING, Math.min(MAX_SWING, deg));
  });
  const ropeScale = useTransform(() => {
    const rope = ropeRef.current?.offsetHeight ?? 0;
    return rope ? (rope + stretch.get()) / rope : 1;
  });

  const release = () => {
    if (!pull.current) return;
    suppressClick.current = pull.current.moved;
    pull.current = null;
    // Low damping so it overshoots and swings back to rest like a hung board
    const spring = { type: "spring", stiffness: reduceMotion ? 400 : 140, damping: reduceMotion ? 40 : 7 } as const;
    animate(pullX, 0, spring);
    animate(pullY, 0, spring);
  };

  const pullHandlers = {
    onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      pullX.stop();
      pullY.stop();
      pull.current = {
        id: e.pointerId,
        x: e.clientX - pullX.get(),
        y: e.clientY - pullY.get(),
        rope: ropeRef.current?.offsetHeight ?? 0,
        moved: false,
      };
      suppressClick.current = false;
    },
    onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => {
      const p = pull.current;
      if (!p || p.id !== e.pointerId) return;
      const x = e.clientX - p.x;
      const y = e.clientY - p.y;
      if (!p.moved && Math.hypot(x, y) < PULL_THRESHOLD) return;
      if (!p.moved) {
        p.moved = true;
        e.currentTarget.setPointerCapture(e.pointerId);
      }
      pullX.set(x);
      pullY.set(y);
    },
    onPointerUp: release,
    // Fires when a touch turns into a page scroll, or the pointer is otherwise lost
    onPointerCancel: release,
    onLostPointerCapture: release,
    // A pull shouldn't also open the enrollment popup
    onClickCapture: (e: React.MouseEvent) => {
      if (!suppressClick.current) return;
      suppressClick.current = false;
      e.preventDefault();
      e.stopPropagation();
    },
  };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: -60, rotate: -10 }}
      animate={show ? { opacity: 1, y: 0, rotate: 0 } : undefined}
      transition={{
        opacity: { duration: 0.3, delay: DROP_DELAY },
        y: { type: "spring", stiffness: 220, damping: 18, delay: DROP_DELAY },
        rotate: { type: "spring", stiffness: 45, damping: 4, mass: 0.9, delay: DROP_DELAY },
      }}
      style={{ transformOrigin: PIVOT }}
      className="w-44 select-none"
    >
      {/* idle sway */}
      <motion.div
        animate={reduceMotion ? undefined : { rotate: [0, 2, 0, -2, 0] }}
        transition={{ duration: 5.5, ease: "easeInOut", repeat: Infinity, delay: DROP_DELAY + 2.5 }}
        style={{ transformOrigin: PIVOT }}
        className="flex flex-col items-center"
      >
        {/* swings to follow a pull */}
        <motion.div style={{ rotate: swing, transformOrigin: PIVOT }} className="flex w-full flex-col items-center">
        {/* nail, twisted rope and the ring it's tied to */}
        <span
          aria-hidden
          className={`-mb-1 h-2.5 w-2.5 rounded-full bg-linear-to-br from-accent-light to-ink shadow-[0_1px_3px_rgba(36,18,74,0.45)] ${nailClassName}`}
        />
        <motion.span
          ref={ropeRef}
          aria-hidden
          style={{ scaleY: ropeScale, transformOrigin: "50% 0%" }}
          className={`w-0.75 rounded-full bg-[repeating-linear-gradient(155deg,#3b1f73_0_3px,#a78bfa_3px_5px)] opacity-80 ${ropeClassName}`}
        />
        {/* ring and board ride down as the rope stretches */}
        <motion.div
          style={{ y: stretch }}
          {...pullHandlers}
          // Sideways pulls swing the card; vertical swipes still scroll the page on touch screens
          className="flex w-full cursor-grab touch-pan-y flex-col items-center active:cursor-grabbing"
        >
        <span aria-hidden className="relative z-10 -mb-2.5 h-4.5 w-4.5 rounded-full border-[2.5px] border-ink-soft/80 bg-white/40 shadow-sm" />

        <EnrollPopup
          program="Winter Cohort"
          className="group relative block w-full cursor-[inherit] overflow-hidden rounded-2xl bg-[linear-gradient(160deg,#24124a_0%,#3b1f73_55%,#7c3aed_125%)] px-4 pb-3 pt-5 text-left text-white shadow-[0_22px_40px_-18px_rgba(36,18,74,0.75)] ring-1 ring-white/10 transition-shadow duration-300 hover:shadow-[0_28px_50px_-16px_rgba(124,58,237,0.7)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          {/* punched hole under the ring */}
          <span aria-hidden className="absolute left-1/2 top-1.5 h-2 w-2 -translate-x-1/2 rounded-full bg-[#1a0d36] ring-1 ring-white/25" />

          {/* soft glow and falling snow */}
          <span aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-accent-2/40 blur-2xl" />
          {!reduceMotion &&
            FLAKES.map((f, i) => (
              <span
                key={i}
                aria-hidden
                className="snowflake pointer-events-none absolute top-0 rounded-full bg-white/70"
                style={{ left: f.left, width: f.size, height: f.size, animationDelay: `${f.delay}s`, animationDuration: `${f.time}s` }}
              />
            ))}
          {/* sheen that sweeps across on hover */}
          <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[480%]" />

          <span className="relative flex items-center justify-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-accent-light">
            <Snowflake className="h-3.5 w-3.5 motion-safe:animate-[spin_12s_linear_infinite]" />
            Winter Cohort
          </span>

          {/* when the cohort starts */}
          <span className="relative mt-3 block text-center font-display">
            <span className="block text-[0.6rem] uppercase tracking-[0.14em] text-white/55">Kicks off</span>
            <span className="block text-xl font-semibold leading-tight">December &rsquo;26</span>
            <span className="mt-1 block text-[0.68rem] text-white/70">Limited seats are available</span>
          </span>

          <span className="relative mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 text-xs font-medium">
            Enroll now
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </span>
        </EnrollPopup>
        </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
