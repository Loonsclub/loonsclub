"use client";

import Image from "next/image";
import { useId, useState } from "react";
import Reveal from "./Reveal";

export type TeamMember = {
  name: string;
  role: string;
  previously: string;
  photo: string | null;
  focus?: string;
  zoom?: number;
  // % of the circle to push the photo down by, for shots cropped tight above the head (fills with white)
  headroom?: number;
};

// Profile cards: dark header band, portrait on the seam, the bio's opening lines fading out below.
// On hover (tap on touch screens) the header shrinks, the portrait shrinks into colour and the full bio shows.
export default function TeamCards({ team }: { team: TeamMember[] }) {
  return (
    <ul className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-7 min-[560px]:grid-cols-2 lg:grid-cols-3">
      {team.map((m, i) => (
        <Reveal as="li" key={m.name} delay={(i % 3) * 90} className="mx-auto w-full max-w-sm">
          <TeamCard member={m} />
        </Reveal>
      ))}
    </ul>
  );
}

function TeamCard({ member: m }: { member: TeamMember }) {
  // Touch screens have no hover, so a tap toggles the details instead
  const [open, setOpen] = useState(false);
  const bioId = useId();
  const tap = () => {
    if (window.matchMedia("(hover: none)").matches) setOpen((o) => !o);
  };

  // expanded styles apply on hover, on keyboard focus, or when tapped open
  const when = (expanded: string, collapsed: string) => (open ? expanded : collapsed);

  return (
    <article
      onClick={tap}
      className={`group relative flex h-[24rem] flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_60px_-34px_rgba(46,16,101,0.55)] ring-1 ring-ink/8 transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_32px_70px_-28px_rgba(124,58,237,0.6)] ${when(
        "-translate-y-1.5",
        "",
      )}`}
    >
      {/* dark band (same as the quote section): runs under the white panel's rounded top, covers the upper half of the portrait */}
      <div
        aria-hidden
        className={`bg-night relative shrink-0 overflow-hidden transition-[height] duration-500 ease-out group-hover:h-20 group-has-focus-visible:h-20 ${when(
          "h-20",
          "h-34",
        )}`}
      >
        <span className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-accent-2/25 blur-2xl" />
        <span className="absolute -left-8 top-6 h-20 w-20 rounded-full bg-accent-light/25 blur-xl" />
      </div>

      {/* plus that turns into a close mark; the keyboard and screen reader toggle */}
      {m.previously && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
          aria-expanded={open}
          aria-controls={bioId}
          aria-label={`${open ? "Hide" : "Show"} more about ${m.name}`}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white ring-1 ring-white/30 backdrop-blur-sm transition duration-300 hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <svg
            viewBox="0 0 24 24"
            className={`h-4 w-4 transition-transform duration-500 group-hover:rotate-45 group-has-focus-visible:rotate-45 ${when("rotate-45", "")}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      )}

      <div
        className={`relative -mt-6 flex min-h-0 flex-1 flex-col items-center rounded-t-[1.6rem] bg-white px-6 pb-5 text-center transition-[padding] duration-500 ease-out group-hover:pt-13 group-has-focus-visible:pt-13 ${when(
          "pt-13",
          "pt-20",
        )}`}
      >
        {/* portrait on the seam: shrinks and turns to colour */}
        <div
          className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ease-out group-hover:scale-[0.62] group-has-focus-visible:scale-[0.62] ${when(
            "scale-[0.62]",
            "",
          )}`}
        >
          <div className={`rounded-full p-1 ${m.photo ? "bg-accent-gradient" : "border-2 border-dashed border-ink/20 bg-white"}`}>
            <div className={`relative h-32 w-32 overflow-hidden rounded-full ring-4 ring-white ${m.photo ? "bg-white" : "bg-sand"}`}>
              {m.photo ? (
                <Image
                  src={m.photo}
                  alt={m.name}
                  fill
                  sizes="160px"
                  style={{
                    objectPosition: m.focus ?? "50% 50%",
                    transform: `translateY(${m.headroom ?? 0}%) scale(${m.zoom ?? 1})`,
                    transformOrigin: m.focus ?? "50% 50%",
                  }}
                  className={`object-cover transition duration-700 group-hover:grayscale-0 group-has-focus-visible:grayscale-0 ${when(
                    "grayscale-0",
                    "grayscale",
                  )}`}
                />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="absolute inset-0 m-auto h-1/2 w-1/2 text-ink/25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21a8 8 0 0 1 16 0" />
                </svg>
              )}
            </div>
          </div>
        </div>

        <h3 className={`font-display text-xl font-bold leading-snug tracking-tight ${m.photo ? "text-ink" : "text-ink/35"}`}>
          {m.name}
        </h3>
        {m.role && (
          <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent">{m.role}</p>
        )}

        {m.previously && (
          // bio: opening lines fade out at rest, the whole text shows when expanded (scrolls if it runs long)
          // data-lenis-prevent: let the wheel and touch scroll the bio instead of the page
          <div
            id={bioId}
            data-lenis-prevent
            className={`mt-4 min-h-0 w-full flex-1 border-t border-ink/8 pt-4 text-left group-hover:overflow-y-auto group-hover:mask-none group-has-focus-visible:overflow-y-auto group-has-focus-visible:mask-none ${when(
              "overflow-y-auto mask-none",
              "overflow-hidden mask-[linear-gradient(to_bottom,black_40%,transparent)]",
            )}`}
          >
            <p className="text-[0.875rem] leading-[1.65] text-pretty text-muted">{m.previously}</p>
          </div>
        )}
      </div>
    </article>
  );
}
