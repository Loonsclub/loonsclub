// Shared site footer: contact details and social links
export default function SiteFooter() {
  return (
    <footer className="bg-night relative px-5 pb-10 pt-20 text-cream sm:px-8">
      <div aria-hidden className="bg-accent-gradient absolute inset-x-0 top-0 h-px" />
      <div className="mx-auto max-w-6xl">
        {/* <Reveal>
          <p className="font-display text-[clamp(2.25rem,1rem+5vw,5rem)] font-extrabold leading-none tracking-[-0.04em]">
            Build it in <span className="text-gradient-light">Chennai.</span>
          </p>
        </Reveal> */}
        <div className="mt-16 grid gap-12 border-t border-cream/15 pt-12 sm:grid-cols-3">
          <div>
            <p className="flex items-center gap-2.5 font-logo text-xl font-bold tracking-tight lowercase">
              loonsclub
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
              Helping students start something before they graduate.
            </p>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-cream/50">Contact</p>
            <ul className="mt-4 space-y-2 text-cream/70">
              <li>
                <a href="mailto:info@loonsclub.com" className="transition hover:text-cream">
                  info@loonsclub.com
                </a>
              </li>
              <li>
                <a href="tel:+918248367716" className="transition hover:text-cream">
                  +91 82483 67716
                </a>
              </li>
            </ul>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-cream/50">Follow</p>
            <ul className="mt-4 flex gap-3">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/5 text-cream/70 ring-1 ring-cream/20 transition hover:-translate-y-0.5 hover:bg-accent hover:text-white hover:ring-accent"
                  >
                    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      {s.icon}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-2 border-t border-cream/15 pt-6 text-xs text-cream/50 sm:flex-row sm:justify-between">
          <span>© 2026 Loons Club. All rights reserved.</span>
          <span>Made in Chennai</span>
        </div>
      </div>
    </footer>
  );
}

const SOCIALS = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 10v7M8 7v.01M12 17v-7M12 13.5c0-2 1.2-3.5 3-3.5s2 1.5 2 3V17" />
      </>
    ),
  },
  {
    label: "X",
    href: "#",
    icon: <path d="M4 4l16 16M20 4L4 20" />,
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <>
        <rect x="2.5" y="5" width="19" height="14" rx="4" />
        <path d="M10 9.5v5l4.5-2.5L10 9.5z" />
      </>
    ),
  },
];
