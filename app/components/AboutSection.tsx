import Image from "next/image";
import Reveal from "./Reveal";

// To change the picture, put a file in /public and update IMAGE_SRC.
const IMAGE_SRC = "/about.jpg";
const IMAGE_ALT = "Students working on their startup ideas";

// Text on the left; a framed photo on the right. Both sides line up with the
// max-w-6xl column used by "What we offer" below.
export default function AboutSection() {
  return (
    // @container lets the copy's left padding be measured against the section's width (cqw),
    // so it lines up with the max-w-6xl column used by "What we offer" below.
    <section
      id="about"
      className="@container relative grid scroll-mt-4 gap-12 overflow-hidden bg-white py-20 sm:py-24 lg:gap-0 lg:grid-cols-[auto_minmax(0,1fr)]"
    >
      {/* Left: copy, with a soft violet glow echoing the hero */}
      <div className="relative flex items-center px-5 sm:px-8 lg:pr-12 lg:pl-[max(2rem,calc((100cqw-72rem)/2))] xl:pr-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_45%_50%,rgba(124,58,237,0.06),transparent_75%)]"
        />
        <Reveal className="relative w-full max-w-xl">
          <h2 className="section-title">
            About <span className="text-gradient">Us</span>
          </h2>
          <div className="mt-10 space-y-6 border-l-2 border-accent/20 pl-6 text-lg leading-relaxed text-muted sm:pl-8 sm:text-xl sm:leading-relaxed">
            <p className="text-ink">
              Loonsclub is an{" "}
              <span className="text-gradient font-semibold">
                entrepreneurship community
              </span>{" "}
              for school students.
            </p>
            <p>
              We are a team of{" "}
              <span className="font-medium text-ink">
                Founders, Investors, and Professors
              </span>{" "}
              with multiple decades of experience in the startup ecosystem.
            </p>
            <p>
              Aimed at developing an entrepreneurial mindset, we nurture ideas
              that challenge the status quo, grow them into viable solutions and
              take them to the market.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Right: the photo in a thin white frame, its right edge lined up with the max-w-6xl column */}
      <div className="flex items-center px-5 sm:px-8 lg:pl-0 lg:pr-[max(2rem,calc((100cqw-72rem)/2))]">
        {/* Subtle reveal: the frame fades up like the text, and the photo inside settles from a slight zoom */}
        <Reveal delay={150} className="w-full">
          <div className="w-full rounded-2xl bg-white p-1.5 shadow-[0_30px_60px_-30px_rgba(29,23,41,0.45)] ring-1 ring-ink/8">
            {/* 4:3 frame trims a little off each side of the 3:2 photo so it stands taller */}
            <div className="relative aspect-4/3 overflow-hidden rounded-xl">
              <Image
                src={IMAGE_SRC}
                alt={IMAGE_ALT}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="scale-[1.06] object-cover transition-transform duration-[1600ms] ease-out motion-reduce:scale-100 [.is-visible_&]:scale-100"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
