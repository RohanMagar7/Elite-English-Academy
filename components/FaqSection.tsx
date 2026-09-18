/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useSafeReducedMotion } from "@/hooks/useMounted";
import { supabase } from "@/lib/supabase";
import SectionHeading from "@/components/home/SectionHeading";

interface Faq {
  id: string;
  question: string;
  answer: string;
  sort_order?: number;
  is_active?: boolean;
}

const DEFAULT_FAQS: Faq[] = [
  {
    id: "demo",
    question: "Do you offer a free demo class?",
    answer:
      "Yes! We offer a free demo class so you can experience our teaching methodology before enrolling.",
  },
  {
    id: "fees",
    question: "What are the course fees?",
    answer:
      "Fees vary by course and batch. Contact us for the latest fee structure and offers.",
  },
  {
    id: "batch",
    question: "How do I join a batch?",
    answer:
      "Fill out the admission form or contact us via WhatsApp or phone. We'll guide you through the process.",
  },
  {
    id: "level",
    question: "Are there classes for beginners?",
    answer:
      "Yes. We have batches for beginners, intermediate learners, and advanced speakers.",
  },
  {
    id: "mode",
    question: "Are classes available online or offline?",
    answer:
      "We offer both online and offline batches to suit your schedule.",
  },
  {
    id: "certificate",
    question: "Will I get a certificate after completing a course?",
    answer:
      "Yes. Every successful student receives a course completion certificate.",
  },
];

export default function FaqSection() {
  const [faqs, setFaqs] = useState<Faq[]>(DEFAULT_FAQS);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useSafeReducedMotion();

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (!error && data?.length) setFaqs(data);
    }

    load();
  }, []);

  return (
    <section id="faqs" className="bg-white py-4 sm:py-6">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          description="Got questions about admissions, fees, batches, and courses? Find your answers below."
        />

        <div className="mt-3 space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={faq.id}
                initial={
                  reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.35,
                  delay: reduceMotion ? 0 : index * 0.03,
                }}
                className={`overflow-hidden rounded-xl border transition-all duration-300 ${
                  isOpen
                    ? "border-blue-300 bg-blue-50/30 shadow-sm"
                    : "border-blue-100 bg-white hover:border-blue-200"
                }`}
              >
                <button
                  type="button"
                  id={`faq-question-${index}`}
                  aria-controls={`faq-answer-${index}`}
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                >
                  <span className="text-sm sm:text-base font-semibold text-blue-950 leading-6">
                    {faq.question}
                  </span>

                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-blue-700 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  aria-hidden={!isOpen}
                  inert={!isOpen}
                  className={`grid overflow-hidden transition-all duration-300 ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-4 pb-3 pt-0 text-[13px] sm:text-sm leading-6 text-slate-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}