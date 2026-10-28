import Image from "next/image";
import Link from "next/link";
import type { Program } from "../lib/programs";
import Reveal from "./Reveal";

// Programs side by side, level and equal height
export default function ProgramCards({ programs }: { programs: Program[] }) {
  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
      {programs.map((program, i) => (
        <Reveal key={program.slug} delay={i * 150} className="h-full">
          <ProgramCard program={program} />
        </Reveal>
      ))}
    </div>
  );
}

function ProgramCard({ program }: { program: Program }) {
  const outcome = program.facts.find((f) => f.label === "You leave with");

  return (
    <Link
      href={program.href ?? "#programs"}
      aria-label={`Explore ${program.title}`}
      className="group flex h-full flex-col rounded-[2rem] bg-white p-3 shadow-[0_30px_60px_-30px_rgba(29,23,41,0.35)] ring-1 ring-ink/5 outline-none transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_40px_80px_-30px_rgba(124,58,237,0.45)] focus-visible:ring-4 focus-visible:ring-accent/50"
    >
      <div className="relative aspect-[5/4] overflow-hidden rounded-[1.5rem] bg-linear-to-br from-ink-soft to-accent">
        {program.image && (
          <Image
            src={program.image}
            alt={program.imageAlt}
            fill
            sizes="(min-width: 1024px) 620px, 100vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-105"
            style={{ objectPosition: program.imagePosition }}
          />
        )}
        {/* fade keeps the number readable on any photo */}
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/15 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white ring-1 ring-white/25 backdrop-blur-md">
          {program.duration}
        </span>
        <span
          aria-hidden
          className="absolute bottom-4 left-5 font-display text-[clamp(3.5rem,2.75rem+3vw,5.5rem)] font-bold leading-none tracking-[-0.04em] text-white/90 sm:left-7"
        >
          {program.number}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-7 sm:px-6 sm:pb-6">
        <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{program.title}</h3>
        <p className="text-gradient mt-2 font-hero text-xl sm:text-2xl">{program.tagline}</p>
        <p className="mb-7 mt-4 leading-relaxed text-muted">{program.body}</p>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-ink/8 pt-5">
          {outcome && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/40">{outcome.label}</p>
              <p className="mt-1 font-display font-semibold">{outcome.value}</p>
            </div>
          )}
          <span className="ml-auto inline-flex items-center gap-3 font-medium text-ink">
            <span className="hidden sm:inline">Explore</span>
            <span
              aria-hidden
              className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white transition duration-300 group-hover:-rotate-45 group-hover:bg-accent"
            >
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
