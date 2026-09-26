"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/Reveal";

const faqs = [
  {
    question: "How far in advance should we book our wedding shoot?",
    answer:
      "We recommend booking at least 6 to 12 months in advance, especially for popular dates during the wedding season, to ensure our availability.",
  },
  {
    question: "Do you travel for out-of-town or destination weddings?",
    answer:
      "Yes, absolutely! We love traveling and capturing beautiful stories worldwide. Travel and accommodation expenses are generally billed separately based on the location.",
  },
  {
    question: "When can we expect our photos and videos to be delivered?",
    answer:
      "Typically, a sneak peek is provided within a week. The full edited gallery and cinematic videos are delivered within 4 to 8 weeks, depending on the scale of the event.",
  },
  {
    question: "Can we customize our photography package?",
    answer:
      "Yes. We understand that every event is unique. Our packages are fully customizable to meet your specific requirements, number of events, and deliverables.",
  },
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mx-auto mt-32 max-w-[900px] section-padding">
      <Reveal variant="up">
        <div className="text-center">
          <h2 className="font-serif text-3xl md:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-4 text-muted">
            Find answers to common queries about bookings, delivery times, and travel.
          </p>
        </div>
      </Reveal>
      
      <div className="mt-12 divide-y divide-border border-y border-border">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <Reveal key={index} variant="up" delay={index * 100}>
              <div 
                className="group transition-colors duration-300 hover:bg-black/5 dark:hover:bg-white/5"
              >
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between py-6 px-4 md:px-6 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg md:text-xl">{faq.question}</span>
                  <span className={cn(
                    "ml-6 flex-shrink-0 text-accent transition-transform duration-300",
                    isOpen ? "rotate-180" : "rotate-0"
                  )}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </button>
                <div 
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-4 md:px-6 pb-6 text-muted text-sm md:text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
