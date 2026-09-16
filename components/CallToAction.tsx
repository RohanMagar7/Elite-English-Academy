"use client";

import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { useSiteSettings, whatsappLink } from "@/hooks/useSiteSettings";

export default function CallToAction() {
    const { settings } = useSiteSettings();
    return (
        <section className="py-8 sm:py-10">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-14">
                <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#0F172A] via-[#1D4ED8] to-[#2563EB] p-6 shadow-[0_25px_60px_rgba(37,99,235,0.35)] sm:p-8 lg:p-12">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-2xl text-white">
                            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-50">
                                Start today
                            </span>
                            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                                Ready to Speak English with Confidence?
                            </h2>
                            <p className="mt-4 max-w-xl text-base text-blue-100 sm:text-lg">
                                Join expert-led speaking classes, practical communication training, and a supportive learning environment designed to help you grow fast.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                            <Link
                                href={whatsappLink(settings.whatsapp_number)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1D4ED8] shadow-lg transition hover:bg-blue-50"
                            >
                                <MessageCircle className="h-4 w-4" />
                                WhatsApp Now
                            </Link>

                            <Link
                                href={settings.phone_href}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
                            >
                                <Phone className="h-4 w-4" />
                                Call Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
