"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useState } from "react";
import { moonlit } from "../lib/fonts";
import PencilPortrait from "./Pencilportrait";
import SiteNav, { type NavItem } from "./SiteNav";

// Badge, headline, subtext and CTA rise in one after another while the painting is still filling in.
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function Hero({ nav }: { nav: NavItem[] }) {
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const shown = revealed || reduceMotion;

  return (
    <header className="relative flex min-h-svh flex-col overflow-hidden bg-white bg-[radial-gradient(ellipse_50%_60%_at_85%_45%,rgba(124,58,237,0.10),transparent_70%)] text-ink">
      <SiteNav items={nav} />

      <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-5 pb-12 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <PencilPortrait
          className="w-full max-w-[min(30rem,60svh)] lg:max-w-[min(42rem,84svh)]"
          onReveal={() => setRevealed(true)}
        />

        <motion.div
          initial={reduceMotion ? false : "hidden"}
          animate={shown ? "shown" : "hidden"}
          transition={{ staggerChildren: 0.28 }}
          className="text-center lg:text-left"
        >
          <motion.p variants={item} className="flex flex-col items-center lg:items-start">
            <span className="font-display text-[clamp(2.75rem,1.75rem+3.2vw,4.25rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
              Here is to the
            </span>
            <span className={`${moonlit.className} text-gradient mt-4 pr-[0.12em] text-[clamp(3.75rem,2rem+5vw,6.25rem)] leading-[1.1] lg:-ml-[0.04em]`}>
              Crazy Ones
            </span>
          </motion.p>
          <motion.h1
            variants={item}
            className="mt-8 max-w-[30ch] font-hero text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-light leading-relaxed tracking-[-0.01em] text-ink/75 max-lg:mx-auto lg:max-w-none"
          >
            <span className="text-gradient font-medium">Entrepreneurship</span> program <br className="hidden lg:block" />
            for school students{" "}
            <span className="whitespace-nowrap text-ink/50">(Class 6 to 12)</span>
          </motion.h1>
          <motion.a
            variants={item}
            href="#programs"
            className="group mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-ink via-ink-soft to-accent px-8 py-4 text-base font-medium text-white transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(124,58,237,0.7)]"
          >
            Explore Programs
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </motion.a>
        </motion.div>
      </div>
    </header>
  );
}
