import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnrollPopup } from "../../components/FormPopups";
import JoinTimeline from "../../components/program/JoinTimeline";
import OutcomeIcon from "../../components/program/OutcomeIcon";
import ProgramHero from "../../components/program/ProgramHero";
import SessionList from "../../components/program/SessionList";
import Reveal from "../../components/Reveal";
import SiteFooter from "../../components/SiteFooter";
import SiteNav from "../../components/SiteNav";
import { getProgram, PROGRAMS } from "../../lib/programs";

// Every section below depends on the slug, so there's no shared shell worth prefetching
export const instant = false;

export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/programs/[slug]">): Promise<Metadata> {
  const program = getProgram((await params).slug);
  if (!program) return {};
  return { title: `${program.title} — Loons Club`, description: program.body };
}

export default async function ProgramPage({ params }: PageProps<"/programs/[slug]">) {
  const program = getProgram((await params).slug);
  if (!program) notFound();
  const unit = program.sessionUnit.toLowerCase().replace(/s$/, "");
  const other = PROGRAMS.find((p) => p.slug !== program.slug);

  return (
    <>
      <SiteNav
        program={program.title}
        items={[
          { href: "#join", label: "How to join" },
          { href: "#about", label: "About" },
          { href: "/#programs", label: PROGRAMS.length > 1 ? "All programs" : "Home" },
        ]}
      />

      <main>
        <ProgramHero program={program} />

        {/* HOW TO JOIN */}
        <section id="join" className="scroll-mt-4 overflow-hidden bg-linear-to-b from-white via-sand to-sand px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto mb-20 max-w-2xl text-center lg:mb-28">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">How to join</p>
              <h2 className="section-title mt-4">
                From this page to <span className="text-gradient">day one</span>.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                {program.join.length} simple steps, at school or on weekends.
              </p>
            </Reveal>
            <JoinTimeline steps={program.join} />
          </div>
        </section>

        {/* ABOUT THE PROGRAM */}
        <section id="about" className="scroll-mt-4 bg-sand px-5 pb-24 sm:px-8 sm:pb-32">
          <div className="mx-auto max-w-7xl">
            <div className="bg-night relative overflow-hidden rounded-[2.5rem] p-8 text-white sm:p-12 lg:p-16">
              <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16">
                <Reveal>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-light">About the program</p>
                  <h2 className="section-title mt-4">
                    {program.title}, <span className="text-gradient-light">{unit} by {unit}</span>.
                  </h2>
                </Reveal>
                <Reveal delay={120}>
                  <p className="max-w-lg text-lg leading-relaxed text-white/70">{program.body}</p>
                </Reveal>
              </div>

              {/* OUTCOMES */}
              <div className="mt-14 border-t border-white/10 pt-10 lg:mt-16 lg:pt-12">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">You leave with</p>
                <ul
                  className={`mt-6 grid gap-4 sm:grid-cols-2 ${program.outcomes.length % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}
                >
                  {program.outcomes.map((o, i) => (
                    <Reveal as="li" key={o.title} delay={i * 70}>
                      <div className="group relative h-full rounded-3xl bg-white/4 p-6 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:bg-white/7 hover:ring-accent-light/30 sm:p-7">
                        <span aria-hidden className="absolute right-6 top-6 font-display text-sm font-bold text-white/20">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="bg-accent-gradient grid h-12 w-12 place-items-center rounded-2xl text-white shadow-[0_12px_28px_-10px_rgba(168,85,247,0.85)] ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-105">
                          <OutcomeIcon name={o.icon} className="h-6 w-6" />
                        </span>
                        <h3 className="mt-6 font-display text-lg font-semibold leading-snug tracking-tight text-white">{o.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-white/60">{o.detail}</p>
                      </div>
                    </Reveal>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-20 lg:mt-28">
              <SessionList sessions={program.sessions} unit={program.sessionUnit} />
            </div>

            {/* closing call to action */}
            <Reveal className="mt-24 text-center lg:mt-32">
              <p className="hero-copy text-2xl italic text-ink/70 sm:text-3xl">{program.tagline}</p>
              <h2 className="section-title mx-auto mt-4 max-w-3xl">
                Ready to start <span className="text-gradient">something</span>?
              </h2>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <EnrollPopup
                  program={program.title}
                  className="group inline-flex items-center gap-2 rounded-full bg-linear-to-r from-ink via-ink-soft to-accent px-8 py-4 font-medium text-white transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(124,58,237,0.7)]"
                >
                  Save a seat
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </EnrollPopup>
                {other?.href && (
                  <Link href={other.href} className="group inline-flex items-center gap-2 px-3 py-4 font-medium text-ink/70 transition hover:text-ink">
                    Or explore {other.title}
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
