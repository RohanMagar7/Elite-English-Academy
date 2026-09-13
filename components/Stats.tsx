"use client";

import { motion } from "framer-motion";
import {
    ArrowUpRight,
    BookOpen,
    GraduationCap,
    Laptop2,
    Sparkles,
} from "lucide-react";

const stats = [
    {
        icon: GraduationCap,
        value: 500,
        suffix: "+",
        label: "Happy Students",
    },
    {
        icon: BookOpen,
        value: 12,
        suffix: "+",
        label: "Years Teaching Experience",
    },
    {
        icon: Laptop2,
        value: 2,
        suffix: "",
        label: "Online & Offline Classes",
    },
    {
        icon: Sparkles,
        value: 100,
        suffix: "%",
        label: "Practical Speaking Focus",
    },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
    return (
        <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-3xl font-black text-blue-950 sm:text-4xl"
        >
            {value}
            {suffix}
        </motion.span>
    );
}

export default function Stats() {
    return (
        <section className="bg-[#F8FBFF] py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {stats.map(({ icon: Icon, value, suffix, label }) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="group rounded-2xl border border-blue-100 bg-white p-6 shadow-[0_20px_50px_rgba(37,99,235,0.08)] transition-transform duration-300 hover:-translate-y-1"
                        >
                            <div className="mb-5 flex items-center justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#2563EB]">
                                    <Icon size={22} strokeWidth={2.2} />
                                </div>
                                <ArrowUpRight className="h-5 w-5 text-blue-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </div>

                            <AnimatedNumber value={value} suffix={suffix} />

                            <p className="mt-3 text-sm font-medium text-slate-600 sm:text-base">
                                {label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
