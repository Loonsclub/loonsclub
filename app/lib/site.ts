// One place for the facts search engines and social cards read about the site.
// Set NEXT_PUBLIC_SITE_URL in each environment; the fallback is the production domain.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://loonsclub.com").replace(/\/$/, "");

export const SITE = {
  name: "Loons Club",
  shortName: "loonsclub",
  title: "Loons Club — Entrepreneurship Program for School Students in Chennai",
  description:
    "Loons Club is a year-long entrepreneurship program for school students (Class 6 to 12) in Chennai. Students find a real problem, build an MVP and take a startup to market, mentored by founders and IIT faculty.",
  tagline: "Helping students start something before they graduate.",
  email: "info@loonsclub.com",
  phone: "+91-82483-67716",
  locale: "en_IN",
  city: "Chennai",
  region: "Tamil Nadu",
  country: "IN",
  venue: "IITM Research Park",
  keywords: [
    "entrepreneurship program for school students",
    "startup program for students",
    "entrepreneurship for kids",
    "young entrepreneurs program",
    "student startup program Chennai",
    "entrepreneurship classes Chennai",
    "school entrepreneurship program India",
    "startup bootcamp for school students",
    "entrepreneurship course for teenagers",
    "Class 6 to 12 entrepreneurship",
    "IITM Research Park",
    "MVP building for students",
    "startup mentorship for students",
    "after-school entrepreneurship program",
    "weekend program for students Chennai",
  ],
} as const;

export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

// Serialises structured data for a <script type="application/ld+json">, escaping "<" so content can't close the tag
export const jsonLd = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export const organizationSchema = {
  "@type": "EducationalOrganization",
  "@id": ORGANIZATION_ID,
  name: SITE.name,
  alternateName: SITE.shortName,
  url: SITE_URL,
  description: SITE.description,
  email: SITE.email,
  telephone: SITE.phone,
  slogan: SITE.tagline,
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.city,
    addressRegion: SITE.region,
    addressCountry: SITE.country,
  },
  areaServed: { "@type": "City", name: SITE.city },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "admissions",
    email: SITE.email,
    telephone: SITE.phone,
    areaServed: SITE.country,
    availableLanguage: ["English"],
  },
  // Add `logo` (a square image, 112px+) and the Instagram / LinkedIn / YouTube URLs in `sameAs` once they exist
  // sameAs: [],
};
