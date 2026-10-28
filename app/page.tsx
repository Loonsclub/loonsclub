import Image from "next/image";
import Reveal from "./components/Reveal";
import Hero from "./components/Hero";
import ProgramCards from "./components/ProgramCards";
import SiteFooter from "./components/SiteFooter";
import { PROGRAMS } from "./lib/programs";
import WaysToJoin, { type Track } from "./components/WaysToJoin";
import Quote from "./components/Quote";


const NAV = [
  { href: "#offer", label: "About" },
  { href: "#programs", label: "Programs" },
  { href: "#schools", label: "Schools" },
  { href: "#students", label: "Students" },
];

// The stages every founder goes through, in order
const OFFERS = [
  {
    title: "Spot the problem",
    body: "Learn to notice what's broken around you and pick a problem worth solving.",
    icon: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="M16 16l4.5 4.5" />
      </>
    ),
  },
  {
    title: "Shape the idea",
    body: "Turn that problem into a clear idea: who it's for, what it does and why it matters.",
    icon: (
      <>
        <path d="M9 18h6M10 21h4" />
        <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z" />
      </>
    ),
  },
  {
    title: "Build your MVP",
    body: "Make the simplest version that works, put it in front of real users and iterate it from the feedback.",
    icon: (
      <>
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
        <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
      </>
    ),
  },
  {
    title: "Go-to-Market",
    body: "Work out who your first customers are, how to reach them and how to get them to say yes.",
    icon: (
      <>
        <path d="M3 10v4a1 1 0 0 0 1 1h3l6 4V5L7 9H4a1 1 0 0 0-1 1z" />
        <path d="M17 9a4 4 0 0 1 0 6M19.5 6.5a7.5 7.5 0 0 1 0 11" />
      </>
    ),
  },
];

const QUOTE_LEAD = "The reasonable man adapts himself to the world; the unreasonable one persists in trying to adapt the world to himself.";
const QUOTE_PUNCHLINE = "Therefore all progress depends on the unreasonable man.";


const TRACKS: Track[] = [
  {
    key: "schools",
    label: "For schools",
    headline: "We bring it to your campus.",
    intro:
      "We partner with your school and run the programs on your premises. You give us a room and a slot in the timetable; we bring the founders, mentors and material.",
    facts: [
      { label: "Where", value: "Your school premises" },
      { label: "When", value: "Fitted into your school calendar" },
      { label: "Who", value: "Students from various classes mixed into teams" },
      { label: "What you need", value: "A room, a slot, and a teacher point of contact" },
    ],
    formats: [
      { program: "Startup Bootcamp", how: "One full day on campus" },
      { program: "Becoming Entrepreneurial", how: "Regular sessions across the academic year" },
    ],
    steps: [
      "Talk to us about your school and your students.",
      "Pick the bootcamp, the year-long program, or both.",
      "We plan the sessions around your calendar.",
      "Founders and mentors run every session at your school.",
      "Students pitch their ideas at a showcase on campus.",
    ],
    cta: { label: "Partner with us", popup: "partner" },
  },
  {
    key: "students",
    label: "For students",
    headline: "Build on your weekends.",
    intro:
      "Not at a partner school? Join on your own. We run both programs on weekends, with students from schools across Chennai working side by side.",
    facts: [
      { label: "Where", value: "Our space in IITM Research Park, Chennai" },
      { label: "When", value: "Weekends" },
      { label: "Who", value: "Students from any school, mixed into teams" },
      { label: "What you need", value: "Curiosity, and your weekends" },
    ],
    formats: [
      { program: "Startup Bootcamp", how: "One Saturday or Sunday" },
      { program: "Becoming Entrepreneurial", how: "Weekend sessions through the year" },
    ],
    steps: [
      "Save a seat with a short form.",
      "Pick the bootcamp or the year-long program.",
      "Meet your team and your mentor on the first weekend.",
      "Build your idea with founders, weekend by weekend.",
      "Pitch to a panel of founders and investors.",
    ],
    cta: { label: "Save a seat", popup: "enroll" },
  },
];

const TEAM: { name: string; role: string; previously: string; photo: string | null }[] = [
  { name: "Member name", role: "Founder & CEO", previously: "Previously founded an edtech startup", photo: null },
  { name: "Member name", role: "Head of Programs", previously: "Previously a curriculum lead at a K–12 school", photo: null },
  { name: "Member name", role: "Mentor Lead", previously: "Previously a product manager at a SaaS company", photo: null },
  { name: "Member name", role: "Community & Partnerships", previously: "Previously ran a startup incubator", photo: null },
];

export default function Home() {
  return (
    <>
      {/* 1. HERO */}
      <Hero nav={NAV} />

      <main>
        {/* 2. WHAT WE OFFER */}
        <section id="offer" className="scroll-mt-4 bg-linear-to-b from-white to-sand px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">What we offer</p>
              <h2 className="section-title mt-4 max-w-3xl">
                Everything you need to go from a <span className="text-gradient">hunch</span> to a launch.
              </h2>
            </Reveal>
            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {OFFERS.map((o, i) => (
                <Reveal key={o.title} delay={i * 90} className="group h-full">
                  <div className="h-full rounded-3xl bg-white p-7 ring-1 ring-ink/5 transition duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_24px_50px_-24px_rgba(29,23,41,0.3)] group-hover:ring-accent/20">
                    <div className="flex items-start justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 bg-accent-gradient text-white shadow-[0_8px_20px_-8px_rgba(124,58,237,0.6)]`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          {o.icon}
                        </svg>
                      </div>
                      <span className="font-display text-sm font-semibold tracking-wide text-ink/25">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-7 font-display text-xl font-semibold tracking-tight">{o.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted">{o.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* QUOTE */}
        <section
          id="quote"
          aria-label="Quote"
          className="bg-night px-5 py-28 text-white sm:px-8 sm:py-40"
        >
          <Quote lead={QUOTE_LEAD} punchline={QUOTE_PUNCHLINE} author="George Bernard Shaw" />
        </section>

        {/* PROGRAMS: what we run, independent of who joins */}
        <section id="programs" className="scroll-mt-4 bg-sand px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <Reveal className="mb-14 max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Programs</p>
              <h2 className="section-title mt-4">
                Two programs.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                Start with a single day that lights the fuse, or spend a year actually building. Both are run by
                founders who have done it themselves.
              </p>
            </Reveal>
            <ProgramCards programs={PROGRAMS} />
          </div>
        </section>

        {/* WAYS TO JOIN: the same programs, delivered at school or on weekends */}
        <section id="join" className="relative scroll-mt-4 bg-linear-to-b from-sand to-white px-5 py-24 sm:px-8 sm:py-32">
          {/* nav targets; the switch picks the matching side */}
          <span id="schools" aria-hidden className="absolute top-0 scroll-mt-4" />
          <span id="students" aria-hidden className="absolute top-0 scroll-mt-4" />
          <div className="mx-auto max-w-7xl">
            <Reveal className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Ways to join</p>
              <h2 className="section-title mt-4">
                At your <span className="text-gradient">school</span>, or on your{" "}
                <span className="text-gradient">weekends</span>.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                Both programs run in two ways. Schools bring us onto their campus; students can also join on their
                own at weekends.
              </p>
              <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-ink/80 shadow-sm ring-1 ring-accent/15">
                <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 9l10-5 10 5-10 5L2 9z" />
                  <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
                </svg>
                For students from <span className="text-gradient font-semibold">Class 6 to 12</span>
              </p>
            </Reveal>
            <WaysToJoin tracks={TRACKS} />
          </div>
        </section>

        {/* 4. MEET THE TEAM */}
        <section id="team" className="scroll-mt-4 bg-linear-to-b from-white to-sand px-5 py-24 text-ink sm:px-8 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="inline-flex items-center gap-2 rounded-full bg-accent/8 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent ring-1 ring-accent/15">
                The people behind it
              </p>
              <h2 className="section-title mt-5">
                Meet the <span className="text-gradient">team</span>
              </h2>
              <div aria-hidden className="bg-accent-gradient mx-auto mt-6 h-1 w-16 rounded-full" />
              <p className="mt-6 text-lg leading-relaxed text-muted">
                Founders, educators and operators who have built things themselves, and now help students do the
                same.
              </p>
            </Reveal>
            <ul className="mt-16 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-x-8">
              {TEAM.map((m, i) => (
                <Reveal as="li" key={i} delay={i * 90} className="group">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-sand ring-1 ring-ink/5">
                    {m.photo ? (
                      <Image
                        src={m.photo}
                        alt={m.name}
                        fill
                        sizes="(min-width: 1024px) 270px, 50vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        className="absolute inset-0 m-auto h-1/3 w-1/3 text-ink/20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        aria-hidden
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21a8 8 0 0 1 16 0" />
                      </svg>
                    )}
                  </div>
                  <h3 className="mt-5 font-display text-lg font-medium tracking-tight">{m.name}</h3>
                  <p className="mt-1 text-sm font-medium text-accent">{m.role}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{m.previously}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
