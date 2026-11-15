"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { EnrollFormPopup, OPEN_COHORT } from "./FormPopups";

export type NavItem = { href: string; label: string };

const EASE = [0.22, 1, 0.36, 1] as const;

// `program` tags the Apply form; it defaults to the cohort that is open now
export default function SiteNav({ items, program = OPEN_COHORT }: { items: NavItem[]; program?: string }) {
  const reduceMotion = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    if (Math.abs(y - prev) > 4) setHidden(y > prev && y > 320);
  });

  // The section under the middle of the screen. Links that share a section (Schools / Students)
  // resolve to whichever was clicked last.
  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.4;
      const hits = items.filter((item) => {
        if (!item.href.startsWith("#")) return false;
        const el = document.getElementById(item.href.slice(1));
        const box = (el?.closest("section") ?? el)?.getBoundingClientRect();
        return !!box && box.top <= line && box.bottom > line;
      });
      setActive(hits.find((h) => h.href === picked)?.href ?? hits[0]?.href ?? null);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items, picked]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const pill = hovered ?? active;
  const condensed = scrolled || menuOpen;
  const ctaClass =
    "group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-linear-to-r from-ink via-ink-soft to-accent px-5 py-2.5 text-sm font-medium text-white transition hover:shadow-[0_12px_28px_-10px_rgba(124,58,237,0.75)]";
  const ctaInner = (
    <>
      {/* gradient wash slides in from the left on hover */}
      <span
        aria-hidden
        className="bg-accent-gradient absolute inset-0 -translate-x-full transition-transform duration-500 ease-out group-hover:translate-x-0"
      />
      <span className="relative">Apply</span>
      <span aria-hidden className="relative transition-transform duration-300 group-hover:translate-x-0.5">
        →
      </span>
    </>
  );

  return (
    <>
      {/* holds the bar's place in the page flow */}
      <div aria-hidden className="h-18 sm:h-22" />

      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-3 sm:px-5"
        initial={false}
        animate={{ y: hidden && !menuOpen ? "-120%" : "0%" }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.45, ease: EASE }}
      >
        <nav
          aria-label="Main"
          className={`relative mx-auto flex items-center justify-between transition-[max-width,height,margin,padding,background-color,box-shadow,border-radius] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            condensed
              ? "mt-3 h-14 max-w-5xl rounded-full bg-white/75 pl-4 pr-1.5 shadow-[0_18px_50px_-24px_rgba(36,18,74,0.45)] ring-1 ring-ink/8 backdrop-blur-xl backdrop-saturate-150"
              : "mt-0 h-18 max-w-6xl rounded-none bg-transparent px-2 sm:h-22 sm:px-3"
          }`}
        >
          <Logo href={program ? "/" : "#"} />

          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center md:flex" onMouseLeave={() => setHovered(null)}>
            {items.map((item) => {
              const on = pill === item.href;
              const isActive = active === item.href;
              return (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    onMouseEnter={() => setHovered(item.href)}
                    onClick={() => setPicked(item.href)}
                    aria-current={isActive ? "location" : undefined}
                    className={`relative block rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                      on ? "text-ink" : "text-ink/60 hover:text-ink"
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId="nav-pill"
                        aria-hidden
                        className="absolute inset-0 rounded-full bg-accent/8 ring-1 ring-accent/15"
                        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-dot"
                        aria-hidden
                        className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent"
                        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                      />
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1.5">
            <button type="button" aria-haspopup="dialog" onClick={() => setApplyOpen(true)} className={ctaClass}>
              {ctaInner}
            </button>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:bg-ink/5 md:hidden"
            >
              <span
                aria-hidden
                className={`absolute h-[1.5px] w-5 rounded-full bg-current transition-transform duration-300 ${menuOpen ? "rotate-45" : "-translate-y-1"}`}
              />
              <span
                aria-hidden
                className={`absolute h-[1.5px] w-5 rounded-full bg-current transition-transform duration-300 ${menuOpen ? "-rotate-45" : "translate-y-1"}`}
              />
            </button>
          </div>

          {/* reading progress along the capsule's lower edge */}
          {condensed && !reduceMotion && (
            <div aria-hidden className="pointer-events-none absolute inset-x-6 -bottom-px h-px overflow-hidden rounded-full">
              <motion.div className="bg-accent-gradient h-full origin-left" style={{ scaleX: scrollYProgress }} />
            </div>
          )}
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              className="mx-auto mt-2 max-w-5xl overflow-hidden rounded-3xl bg-white/90 p-3 shadow-[0_30px_60px_-30px_rgba(36,18,74,0.5)] ring-1 ring-ink/8 backdrop-blur-xl md:hidden"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <motion.ul initial="hidden" animate="shown" transition={{ staggerChildren: 0.05, delayChildren: 0.05 }}>
                {items.map((item, i) => (
                  <motion.li
                    key={item.href}
                    variants={{ hidden: { opacity: 0, y: 8 }, shown: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } } }}
                  >
                    <NavLink
                      href={item.href}
                      onClick={() => {
                        setPicked(item.href);
                        setMenuOpen(false);
                      }}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3.5 transition ${
                        active === item.href ? "bg-accent/8 text-ink" : "text-ink/75 hover:bg-ink/4 hover:text-ink"
                      }`}
                    >
                      <span className="font-display text-lg font-semibold tracking-tight">{item.label}</span>
                      <span className="font-display text-xs font-semibold text-ink/30">{String(i + 1).padStart(2, "0")}</span>
                    </NavLink>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* the student enrollment form, opened by Apply: the same one the winter card opens */}
      <EnrollFormPopup open={applyOpen} onClose={() => setApplyOpen(false)} program={program} />
    </>
  );
}

// Hash links stay plain anchors so smooth scrolling handles them; page links go through the router
function NavLink({ href, ...props }: React.ComponentProps<"a"> & { href: string }) {
  return href.startsWith("#") ? <a href={href} {...props} /> : <Link href={href} {...props} />;
}

function Logo({ href }: { href: string }) {
  return (
    <NavLink href={href} aria-label="Loons Club home" className="group flex items-center gap-2.5 font-logo text-xl font-bold lowercase tracking-wide">
      {/* a crescent: the club's moon, turning a little on hover */}
      loonsclub
    </NavLink>
  );
}
