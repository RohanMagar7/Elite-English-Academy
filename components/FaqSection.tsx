"use client";

import { useRef, useState, useEffect } from "react";
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
            "Yes! We offer a free demo class so you can experience our teaching methodology and batch environment before enrolling. Simply book your demo through the form or WhatsApp.",
    },
    {
        id: "fees",
        question: "What are the course fees?",
        answer:
            "Fees vary by course and batch. Visit the Courses section for details or contact us on phone/WhatsApp for the latest fee structure and any ongoing offers.",
    },
    {
        id: "batch",
        question: "How do I join a batch?",
        answer:
            "You can join via the admission enquiry form, or contact us directly by phone or WhatsApp. Our team will guide you on batch availability and next steps.",
    },
    {
        id: "level",
        question: "Are there classes for beginners?",
        answer:
            "Absolutely. We welcome learners at every level — from absolute beginners to advanced speakers — and place you in the batch that matches your current level.",
    },
    {
        id: "mode",
        question: "Are classes available online or offline?",
        answer:
            "We offer both online and offline batches. Choose the mode that works best for your schedule; the learning quality stays the same.",
    },
    {
        id: "certificate",
        question: "Will I get a certificate after completing a course?",
        answer:
            "Yes, you receive a certificate after successfully completing your course, which reflects your growth and commitment.",
    },
];

export default function FaqSection() {
    const [faqs, setFaqs] = useState<Faq[]>(DEFAULT_FAQS);
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    // SSR-safe: false during SSR + first client render, so markup matches.
    const reduceMotion = useSafeReducedMotion();
    const contentRefs = useRef<Array<HTMLDivElement | null>>([]);

    useEffect(() => {
        async function load() {
            const { data, error } = await supabase
                .from("faqs")
                .select("*")
                .eq("is_active", true)
                .order("sort_order", { ascending: true });

            if (!error && data && data.length > 0) {
                setFaqs(data);
            }
        }

        load();
    }, []);

    return (
        <section className="bg-white py-8 sm:py-10" id="faqs">
            <div className="mx-auto max-w-4xl px-5 sm:px-8 lg:px-10 xl:px-14">
                <SectionHeading
                    eyebrow="FAQ"
                    title="Frequently Asked Questions"
                    description="Got questions about admissions, fees, batches, and courses? Find your answers below."
                />
<div className="mt-10 space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <motion.div
                                key={faq.id || `${faq.question}-${index}`}
                                initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{
                                    duration: reduceMotion ? 0 : 0.4,
                                    delay: reduceMotion ? 0 : index * 0.04,
                                }}
                                className={`overflow-hidden rounded-2xl border bg-white transition-colors ${
                                    isOpen
                                        ? "border-blue-300 shadow-[0_14px_40px_rgba(37,99,235,0.12)]"
                                        : "border-blue-100 hover:border-blue-200"
                                }`}
                            >
                                <button
                                    type="button"
                                    aria-expanded={isOpen}
                                    onClick={() =>
                                        setOpenIndex(isOpen ? null : index)
                                    }
                                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                                >
                                    <span className="text-base font-semibold text-blue-950 sm:text-lg">
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        className={`h-5 w-5 shrink-0 text-[#2563EB] transition-transform duration-300 ${
                                            isOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                <div
                                    ref={(el) => {
                                        contentRefs.current[index] = el;
                                    }}
                                    className={`grid transition-all duration-300 ease-in-out ${
                                        isOpen
                                            ? "grid-rows-[1fr] opacity-100"
                                            : "grid-rows-[0fr] opacity-0"
                                    }`}
                                >
                                    <div className="overflow-hidden">
                                        <p className="px-5 pb-5 text-sm leading-7 text-slate-600 sm:px-6 sm:text-base">
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