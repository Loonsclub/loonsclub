import localFont from "next/font/local";

// Script face for "Crazy Ones", applied by class so it never depends on a Tailwind theme rebuild
export const moonlit = localFont({
  src: "../../public/moonlit-flow.italic.otf",
  display: "swap",
});
