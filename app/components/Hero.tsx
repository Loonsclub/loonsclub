"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { moonlit } from "../lib/fonts";
import SiteNav, { type NavItem } from "./SiteNav";
import WinterCard from "./WinterCard";

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

      <div className="mx-auto grid w-full max-w-400 flex-1 items-center gap-12 px-5 pb-12 sm:px-8 lg:grid-cols-[1.4fr_1fr] xl:px-12">
        {/* Soft unblur-and-settle reveal once the image has loaded; the copy follows it in */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 1.06, filter: "blur(14px)" }}
          animate={shown ? { opacity: 1, scale: 1, filter: "blur(0px)" } : undefined}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full overflow-hidden rounded-3xl"
        >
          <Image
            src="/hero.png"
            alt="Pencil sketch of famous inventors, scientists, artists and founders who changed the world: the original loons"
            width={1536}
            height={1024}
            priority
            sizes="(min-width: 1024px) 62vw, 100vw"
            className="h-auto w-full"
            onLoad={() => setRevealed(true)}
          />
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : "hidden"}
          animate={shown ? "shown" : "hidden"}
          transition={{ staggerChildren: 0.28 }}
          className="text-center lg:text-left"
        >
          {/* One type family (Clamp, light) for all supporting copy; Moonlit is reserved for the single accent word */}
          <motion.h1 variants={item} className="flex flex-col items-center lg:items-start">
            <span className="font-hero text-[clamp(2.5rem,1.6rem+2.8vw,4rem)] font-light leading-none tracking-[-0.02em] text-ink/80">
              We are the
            </span>
            <span className={`${moonlit.className} text-gradient mt-0 pr-[0.12em] text-[clamp(4.75rem,2.75rem+6.5vw,8.5rem)] leading-[1.05] lg:ml-[-0.04em]`}>
              Loons
            </span>
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-8 max-w-[32ch] font-hero text-[clamp(1.5rem,1.15rem+1.1vw,2.25rem)] font-light leading-relaxed tracking-[-0.01em] text-ink/70 max-lg:mx-auto"
          >
            <span className="text-gradient">Entrepreneurship</span> program for <span className="whitespace-nowrap">school students</span>{" "}
            <span className="whitespace-nowrap text-[0.8em] text-ink">(Class 6 to 12)</span>
          </motion.p>
          <motion.a
            variants={item}
            href="#programs"
            className="group mt-10 inline-flex items-center justify-center gap-2.5 rounded-full bg-linear-to-r from-ink via-ink-soft to-accent px-9 py-4 text-lg font-medium text-white transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(124,58,237,0.7)]"
          >
            Explore Programs
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </motion.a>
        </motion.div>
      </div>

      {/* Hangs on a rope from the top edge once there is room beside the headline, so the hero copy keeps its place; sits below the hero on narrower screens */}
      <div className="flex justify-center pb-12 min-[1360px]:absolute min-[1360px]:right-6 min-[1360px]:top-0 min-[1360px]:pb-0 2xl:right-12">
        <WinterCard show={!!shown} ropeClassName="h-12 min-[1360px]:h-28" nailClassName="min-[1360px]:hidden" />
      </div>
    </header>
  );
}
