"use client";

import { useState, type ReactNode } from "react";
import EnrollForm from "./EnrollForm";
import PartnerForm from "./PartnerForm";
import Popup from "./Popup";

type TriggerProps = { className?: string; children: ReactNode };

// A button that opens the enrollment form in a popup. Pass `program` from a program page to tag the enrollment.
export function EnrollPopup({ program, className, children }: TriggerProps & { program?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" aria-haspopup="dialog" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      <Popup
        open={open}
        onClose={() => setOpen(false)}
        eyebrow="Enroll"
        title={
          <>
            Save a <span className="text-gradient-light">seat</span>.
          </>
        }
        intro="Spots are limited so every team gets real time with a mentor."
        points={[
          "Fill in this form.",
          "We will call you back within 24 hours.",
          "Confirm your availability and we fix a date",
          "Show up curious. No experience needed.",
        ]}
        badge={program}
      >
        <EnrollForm program={program} bare />
      </Popup>
    </>
  );
}

// A button that opens the school partnership enquiry in a popup
export function PartnerPopup({ className, children }: TriggerProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" aria-haspopup="dialog" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      <Popup
        open={open}
        onClose={() => setOpen(false)}
        eyebrow="Partner with us"
        title={
          <>
            Build the Next Generation of Founders at your <span className="text-gradient-light">Campus</span>.
          </>
        }
        points={[
          "Share your school details.",
          "Pick the bootcamp, the year-long program, or both.",
          "Founders and mentors run every session on campus.",
        ]}
      >
        <PartnerForm />
      </Popup>
    </>
  );
}
