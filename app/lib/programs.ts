export type JoinStep = { title: string; detail: string; meta: string };

export type OutcomeIconName =
  | "compass"
  | "growth"
  | "idea"
  | "pitch"
  | "mentor"
  | "layers"
  | "mindset"
  | "product"
  | "network"
  | "rocket";

export type Session = {
  label: string;
  format: string;
  title: string;
  summary: string;
  topics: { title: string; detail: string }[];
  review?: { title: string; detail: string };
};

type ProgramData = Omit<Program, "number" | "eyebrow" | "href">;

export type Program = {
  active: boolean;
  eyebrow: string;
  title: string;
  body: string;
  image: string | null;
  imageAlt: string;
  href: string;
  slug: string;
  number: string;
  duration: string;
  tagline: string;
  imagePosition: string;
  facts: { label: string; value: string }[];
  sessionUnit: "Sessions" | "Phases";
  join: JoinStep[];
  outcomes: { icon: OutcomeIconName; title: string; detail: string }[];
  sessions: Session[];
};

const ALL_PROGRAMS: ProgramData[] = [
  {
    //Change active to 'true'
    active: false,
    slug: "startup-bootcamp",
    duration: "1 day",
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
      { label: "You leave with", value: "A validated idea" },
    ],
    join: [
      { title: "Save a seat", detail: "Fill in a short form.", meta: "2 minutes" },
      { title: "We call you", detail: "We answer questions and confirm your seat.", meta: "Within 2 days" },
      { title: "Pick your day", detail: "At your school or a weekend with us.", meta: "School or weekend" },
      { title: "Show up", detail: "No experience needed.", meta: "Day one" },
    ],
    outcomes: [
      { icon: "compass", title: "How founders really work", detail: "What founders actually do, day to day." },
      { icon: "growth", title: "Startup vs. business", detail: "Why startups are built to grow fast." },
      { icon: "idea", title: "Your team's own idea", detail: "A real problem, shaped into a solution." },
      { icon: "pitch", title: "Your first pitch", detail: "Three minutes in front of founders." },
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
    active: true,
    slug: "becoming-entrepreneurial",
    duration: "1 year",
    title: "Becoming Entrepreneurial",
    tagline: "A year of actually building.",
    body: "A year taking a real startup from idea to Product Market Fit, with a team and a mentor.",
    image: "https://images.unsplash.com/photo-1714976326743-9d2256f53bad?w=1600&q=80&auto=format&fit=crop",
    imageAlt: "A group of people sitting around a table, looking at a laptop together",
    imagePosition: "50% 40%",
    sessionUnit: "Phases",
    facts: [
      { label: "Duration", value: "10-Months" },
      { label: "Where", value: "Your school or IITM Research Park" },
      { label: "Led by", value: "Founders and mentors" },
      { label: "You leave with", value: "Real-world Startup Experience" },
    ],
    join: [
      { title: "Save a seat", detail: "Fill in a short form.", meta: "2 minutes" },
      { title: "Intro call", detail: "We explain how the year works, and the admission process.", meta: "Within a week" },
      { title: "Apply", detail: "Go through the admission process.", meta: "Application" },
      { title: "Meet your team", detail: "Your co-founders and mentor.", meta: "Day one" },
    ],
    outcomes: [
      { icon: "mentor", title: "Personalised mentorship", detail: "A mentor who guides your team all year." },
      { icon: "layers", title: "Startup fundamentals", detail: "Value proposition and the Business Model Canvas." },
      { icon: "mindset", title: "Entrepreneurial mindset", detail: "Own problems, take risks, learn from failure." },
      { icon: "product", title: "Product development", detail: "Take an idea all the way to a working product." },
      { icon: "network", title: "Startup exposure", detail: "Time with founders and the startup ecosystem." },
      { icon: "rocket", title: "Startup building experience", detail: "A full year building a real startup as a team." },
    ],
    sessions: [
      {
        label: "Phase 1",
        format: "Idea & team",
        title: "Find an idea worth pursuing",
        summary: "Learn the fundamentals, form a team and pick a problem worth the year.",
        topics: [
          { title: "Orientation", detail: "How the year works, and what it asks of you." },
          { title: "Startup Fundamentals", detail: "Value proposition and the Business Model Canvas." },
          { title: "Founder Mindset - I", detail: "Resourcefulness, value proposition and risk." },
          { title: "Idea Generation", detail: "Spot real problems and choose one worth solving." },
        ],
        review: { title: "Q1 Customer Discovery review", detail: "Show who your customer is and what you learned from them." },
      },
      {
        label: "Phase 2",
        format: "MVP & fit",
        title: "Build the MVP",
        summary: "Build the smallest product that tests your idea, and find out if people want it.",
        topics: [
          { title: "Thinking Styles", detail: "Explore Creative, Design, and Systems Thinking" },
          { title: "Building a Minimum Viable Product", detail: "The smallest version that tests your idea." },
          { title: "Founder Mindset - II", detail: "Psychological capital: hope, resilience and confidence." },
          { title: "Product Market Fit", detail: "Signs that people truly want what you built." },
        ],
        review: { title: "Q2 PMF review", detail: "Present the evidence that your product fits its market." },
      },
      {
        label: "Phase 3",
        format: "Build & Launch",
        title: "Go-to-Market",
        summary: "Sharpen the product, plan the money and take it to market.",
        topics: [
          { title: "MVP iteration", detail: "Improve the product from real user feedback." },
          { title: "Startup Finance", detail: "Costs, pricing and how the numbers add up." },
          { title: "What is Marketing", detail: "How to reach and win your first customers." },
          { title: "GTM Plan", detail: "Your plan for launching to market." },
        ],
        review: { title: "Q3 Demo day", detail: "Showcase your startup to Mentors, Investors, and Public." },
      },
    ],
  },
];

const active = ALL_PROGRAMS.filter((p) => p.active);

export const PROGRAMS: Program[] = active.map((p, i) => {
  const number = String(i + 1).padStart(2, "0");
  return {
    ...p,
    number,
    eyebrow: active.length > 1 ? `Program ${number} · ${p.duration}` : `${p.duration.replace(" ", "-")} program`,
    href: `/programs/${p.slug}`,
  };
});

export const getProgram = (slug: string) => PROGRAMS.find((p) => p.slug === slug);
