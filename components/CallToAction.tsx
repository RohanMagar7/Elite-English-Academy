"use client";

import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { useSiteSettings, whatsappLink } from "@/hooks/useSiteSettings";

export default function CallToAction() {
    const { settings } = useSiteSettings();
    return (
        <section className="py-10 md:py-14">
            <div className="text-center-container">
                <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#0F172A] via-[#1D4ED8] to-[#2563EB] p-5 shadow-[0_25px_60px_rgba(37,99,235,0.35)] sm:p-6 lg:p-8">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-2xl text-white text-center">
                            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                                Start today
                            </span>
                            <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                                Ready to Speak English with Confidence?
                            </h2>
                            <p className="mt-3 max-w-xl text-base text-blue-100 sm:text-lg">
                                Learn to speak English with expert teachers. You get daily practice, personal support, and fast growth.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row justify-center">
                            <Link
                                href={whatsappLink(settings.whatsapp_number)}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-accent w-full sm:w-auto"
                            >
                                <MessageCircle className="h-4 w-4" />
                                WhatsApp Now
                            </Link>

                            <Link
                                href={settings.phone_href}
                                className="btn-ghost w-full sm:w-auto"
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
