"use client";

import { useState } from "react";
import { faqs } from "@/data/services";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-24 md:py-32" id="faq">
      <div className="section-padding mx-auto max-w-3xl">
        <Reveal>
          <div className="text-center mb-16 md:mb-24">
            <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Clarifications
            </span>
            <SectionHeading title="COMMON QUESTIONS" align="center" />
          </div>
        </Reveal>

        <div className="flex flex-col">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <Reveal key={faq.id} delay={index * 50} variant="up">
                <div className="border-b border-border/60 group">
                  <button
                    className="flex w-full items-center justify-between py-8 text-left transition-colors duration-300 hover:text-accent focus:outline-none"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                  >
                    <span className={`font-serif text-[clamp(1.1rem,2vw,1.4rem)] pr-8 transition-colors duration-300 ${isOpen ? 'text-accent' : 'text-foreground'}`}>
                      {faq.question}
                    </span>
                    <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                      <span className={`absolute h-[1.5px] w-4 bg-current transition-transform duration-500 ease-in-out ${isOpen ? 'rotate-180 bg-accent' : ''}`} />
                      <span className={`absolute h-[1.5px] w-4 bg-current transition-transform duration-500 ease-in-out ${isOpen ? 'rotate-180 bg-accent' : 'rotate-90'}`} />
                    </span>
                  </button>
                  
                  <div 
                    id={`faq-answer-${faq.id}`}
                    className={`grid transition-all duration-500 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100 pb-8" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-muted leading-relaxed text-sm md:text-base pr-12">
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
    </section>
  );
}
