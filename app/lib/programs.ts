export type JoinStep = { title: string; detail: string; meta: string };

// One block of the program: a session in the bootcamp, a phase in the year-long program
export type Session = {
  label: string;
  format: string;
  title: string;
  summary: string;
  topics: { title: string; detail: string }[];
};

export type Program = {
  eyebrow: string;
  title: string;
  body: string;
  // set to a path in /public; null shows a placeholder
  image: string | null;
  imageAlt: string;
  // the program's own page
  href?: string;
  slug: string;
  number: string;
  duration: string;
  tagline: string;
  // focal point for the tall hero crop, as a CSS object-position
  imagePosition: string;
  facts: { label: string; value: string }[];
  // what the blocks in `sessions` are called
  sessionUnit: "Sessions" | "Phases";
  join: JoinStep[];
  outcomes: string[];
  sessions: Session[];
};

export const PROGRAMS: Program[] = ([
  {
    slug: "startup-bootcamp",
    number: "01",
    duration: "1 day",
    eyebrow: "Program 01 · 1 day",
    title: "Startup Bootcamp",
    tagline: "One day that lights the fuse.",
    body: "Founders walk students through how startups work, then teams come up with an idea and pitch it.",
    image: "https://images.unsplash.com/photo-1758873269320-372f7ad170f0?w=1600&q=80&auto=format&fit=crop",
    imageAlt: "Colleagues collaborating around a table in an office",
    imagePosition: "35% 50%",
    sessionUnit: "Sessions",
    facts: [
      { label: "Duration", value: "One full day" },
      { label: "Where", value: "Your school or IITM Research Park" },
      { label: "Led by", value: "Startup founders" },
      { label: "You leave with", value: "A pitched idea" },
    ],
    join: [
      { title: "Save a seat", detail: "Fill in a short form.", meta: "2 minutes" },
      { title: "We call you", detail: "We answer questions and confirm your seat.", meta: "Within 2 days" },
      { title: "Pick your day", detail: "At your school or a weekend with us.", meta: "School or weekend" },
      { title: "Show up", detail: "No experience needed.", meta: "Day one" },
    ],
    outcomes: [
      "How founders really work",
      "Startup vs. business",
      "Your team's own idea",
      "Your first pitch",
    ],
    sessions: [
      {
        label: "Morning",
        format: "Workshop",
        title: "Startup Fundamentals",
        summary: "What founders do, and why startups are built to grow fast.",
        topics: [
          { title: "Who founders are", detail: "People who fix what's broken." },
          { title: "Spotting problems", detail: "Everyday frustrations are opportunities." },
          { title: "Ideal Customer Profile", detail: "Who you're building for." },
          { title: "Product Market Fit", detail: "Proof people want it." },
          { title: "Business model", detail: "How it makes money." },
        ],
      },
      {
        label: "Midday",
        format: "Founder talk",
        title: "A founder's journey",
        summary: "The real story behind a startup.",
        topics: [
          { title: "The honest version", detail: "Mistakes included." },
          { title: "Ask anything", detail: "Open Q&A with the founder." },
        ],
      },
      {
        label: "Afternoon",
        format: "Ideation & pitch",
        title: "Pitch & Validate",
        summary: "Teams shape an idea and pitch it to founders.",
        topics: [
          { title: "Find the problem", detail: "One your team knows well." },
          { title: "Shape the idea", detail: "Who it's for and what it does." },
          { title: "Pitch", detail: "Three minutes in front of founders." },
          { title: "Feedback", detail: "Honest advice on what's next." },
        ],
      },
    ],
  },
  {
    slug: "becoming-entrepreneurial",
    number: "02",
    duration: "1 year",
    eyebrow: "Program 02 · 1 year",
    title: "Becoming Entrepreneurial",
    tagline: "A year of actually building.",
    body: "A year taking a real startup from idea to Product Market Fit, with a team and a mentor.",
    image: "https://images.unsplash.com/photo-1714976326743-9d2256f53bad?w=1600&q=80&auto=format&fit=crop",
    imageAlt: "A group of people sitting around a table, looking at a laptop together",
    imagePosition: "50% 40%",
    sessionUnit: "Phases",
    facts: [
      { label: "Duration", value: "One academic year" },
      { label: "Where", value: "Your school or IITM Research Park" },
      { label: "Led by", value: "Founders and mentors" },
      { label: "You leave with", value: "A tested product" },
    ],
    join: [
      { title: "Save a seat", detail: "Fill in a short form.", meta: "2 minutes" },
      { title: "Intro call", detail: "We explain how the year works.", meta: "Within a week" },
      { title: "Choose how", detail: "Through school or on weekends.", meta: "School or weekend" },
      { title: "Meet your team", detail: "Your co-founders and mentor.", meta: "Day one" },
    ],
    outcomes: [
      "Co-founders you chose",
      "Real customer conversations",
      "A first product",
      "A path to launch",
    ],
    sessions: [
      {
        label: "Phase 1",
        format: "Idea & team",
        title: "Find an idea worth pursuing",
        summary: "Form a team and pick an idea worth the year.",
        topics: [
          { title: "Founder mindset", detail: "Risk, failure and ownership." },
          { title: "Ideation", detail: "Many ideas, then the best one." },
          { title: "Co-founders", detail: "People who cover your gaps." },
          { title: "Validation", detail: "Is the problem real?" },
          { title: "Ideal Customer Profile", detail: "Who exactly it's for." },
        ],
      },
      {
        label: "Phase 2",
        format: "Customer",
        title: "Talk to customers",
        summary: "Learn what customers need and sharpen your offer.",
        topics: [
          { title: "Discovery interviews", detail: "Questions that reveal real needs." },
          { title: "Value proposition", detail: "Why it's worth paying for." },
          { title: "Resilience", detail: "Handling rejection and pivots." },
        ],
      },
      {
        label: "Phase 3",
        format: "Build & launch",
        title: "Build and launch",
        summary: "Build a first version and take it to market.",
        topics: [
          { title: "MVP", detail: "The smallest version that works." },
          { title: "Product Market Fit", detail: "Improve until people want it." },
          { title: "Go-to-market", detail: "Reach your first customers." },
        ],
      },
    ],
  },
] satisfies Program[]).map((p) => ({ ...p, href: `/programs/${p.slug}` }));

export const getProgram = (slug: string) => PROGRAMS.find((p) => p.slug === slug);
