"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "motion/react";
import { useRef } from "react";
import { PROGRAMS, type Program } from "../../lib/programs";
import { EnrollPopup } from "../FormPopups";

const EASE = [0.22, 1, 0.36, 1] as const;
const BLINDS = 6;

const rise: Variants = {
  hidden: { y: "110%" },
  shown: (i: number) => ({ y: "0%", transition: { duration: 1, ease: EASE, delay: 0.15 + i * 0.12 } }),
};
const fade: Variants = {
  hidden: { opacity: 0, y: 16 },
  shown: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", delay } }),
};

export default function ProgramHero({ program }: { program: Program }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const numberY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const initial = reduceMotion ? false : "hidden";
  const words = program.title.split(" ");

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white bg-[radial-gradient(ellipse_45%_55%_at_80%_40%,rgba(124,58,237,0.12),transparent_70%)] px-5 pb-16 pt-6 sm:px-8 lg:pb-24"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:min-h-[calc(100svh-6rem)] lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div className="relative z-10">
          <motion.div initial={initial} animate="shown" variants={fade} custom={0}>
            <Link href="/#programs" className="group inline-flex items-center gap-2 text-sm text-ink/60 transition hover:text-ink">
              <span aria-hidden className="transition-transform group-hover:-translate-x-1">
                ←
              </span>
              {PROGRAMS.length > 1 ? "All programs" : "Back to home"}
            </Link>
          </motion.div>

          <motion.p
            initial={initial}
            animate="shown"
            variants={fade}
            custom={0.1}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent/8 px-3.5 py-1.5 text-xs font-medium text-accent ring-1 ring-accent/20"
          >
            <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            {program.eyebrow}
          </motion.p>

          <h1 className="mt-6 font-hero text-[clamp(2.75rem,1.4rem+4.6vw,6rem)] font-light leading-[0.98] tracking-[-0.03em]">
            {words.map((word, i) => (
              <span key={i} className="mb-[0.12em] block overflow-hidden pb-[0.12em]">
                <motion.span
                  className={`block ${i === words.length - 1 ? "text-gradient" : ""}`}
                  initial={initial}
                  animate="shown"
                  variants={rise}
                  custom={i}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={initial}
            animate="shown"
            variants={fade}
            custom={0.55}
            className="hero-copy mt-7 text-2xl italic text-ink/80 sm:text-3xl"
          >
            {program.tagline}
          </motion.p>
          <motion.p
            initial={initial}
            animate="shown"
            variants={fade}
            custom={0.7}
            className="mt-5 max-w-xl text-lg leading-relaxed text-muted"
          >
            {program.body}
          </motion.p>

          <motion.div
            initial={initial}
            animate="shown"
            variants={fade}
            custom={0.85}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <EnrollPopup
              program={program.title}
              className="group inline-flex items-center gap-2 rounded-full bg-linear-to-r from-ink via-ink-soft to-accent px-7 py-3.5 font-medium text-white transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(124,58,237,0.7)]"
            >
              Save a seat
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </EnrollPopup>
            <a href="#join" className="group inline-flex items-center gap-2 px-2 py-3.5 font-medium text-ink/70 transition hover:text-ink">
              How to join
              <span aria-hidden className="transition-transform group-hover:translate-y-0.5">
                ↓
              </span>
            </a>
          </motion.div>
        </div>

        <div className="relative">
          {/* oversized outline numeral drifting behind the photo */}
          <motion.span
            aria-hidden
            style={reduceMotion ? undefined : { y: numberY }}
            className="pointer-events-none absolute -right-2 -top-20 select-none font-display text-[clamp(6rem,4rem+6vw,11rem)] lg:-top-28 font-extrabold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_rgba(124,58,237,0.18)]"
          >
            {program.number}
          </motion.span>

          <div className="relative aspect-4/5 overflow-hidden rounded-[2.5rem] bg-sand shadow-[0_50px_100px_-40px_rgba(36,18,74,0.55)] sm:aspect-5/4 lg:aspect-auto lg:h-[min(40rem,calc(100svh-10rem))]">
            <motion.div
              className="absolute -inset-y-[8%] inset-x-0"
              style={reduceMotion ? undefined : { y: imageY }}
              initial={reduceMotion ? false : { scale: 1.25 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.2, ease: EASE, delay: 0.2 }}
            >
              {program.image && (
                <Image
                  src={program.image}
                  alt={program.imageAlt}
                  fill
                  preload
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: program.imagePosition }}
                />
              )}
            </motion.div>
            <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink/35 via-transparent to-transparent" />

            {!reduceMotion && (
              <div aria-hidden className="absolute inset-0 flex">
                {Array.from({ length: BLINDS }, (_, i) => (
                  <motion.span
                    key={i}
                    className="h-full flex-1 origin-top bg-linear-to-b from-ink-soft to-accent"
                    initial={{ scaleY: 1 }}
                    animate={{ scaleY: 0 }}
                    transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.25 + i * 0.08 }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* all the facts at a glance */}
      <motion.dl
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 1.1 }}
        className="mx-auto mt-16 grid max-w-7xl gap-px overflow-hidden rounded-3xl bg-ink/8 ring-1 ring-ink/8 sm:grid-cols-2 lg:mt-4 lg:grid-cols-4"
      >
        {program.facts.map((f) => (
          <div key={f.label} className="bg-white/95 p-6">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{f.label}</dt>
            <dd className="mt-2 font-display font-semibold leading-snug tracking-tight">{f.value}</dd>
          </div>
        ))}
      </motion.dl>
    </section>
  );
}
