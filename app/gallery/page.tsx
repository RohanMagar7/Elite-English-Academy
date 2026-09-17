"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GallerySection from "@/components/GalleryCard";
import { useSiteSettings, whatsappLink } from "@/hooks/useSiteSettings";

export default function GalleryPage() {
    const { settings } = useSiteSettings();
    return (
        <>
            <Navbar />
            <GallerySection />

            <section className="bg-white py-6 sm:py-8">
                <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-10 xl:px-14">
                    <div className="rounded-[2rem] bg-gradient-to-r from-[#0F172A] via-[#1D4ED8] to-[#2563EB] p-8 text-center text-white shadow-[0_25px_60px_rgba(37,99,235,0.35)] sm:p-10">
                        <h2 className="text-3xl font-black text-white sm:text-4xl">Want to Join {settings.academy_name}?</h2>
                        <p className="mt-3 text-base text-blue-100">Start your journey with expert guidance and practical English learning.</p>
                        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                            <a
                                href={whatsappLink(settings.whatsapp_number)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#1D4ED8] transition hover:bg-blue-50"
                            >
                                WhatsApp Us
                            </a>
                            <a
                                href={settings.phone_href}
                                className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                            >
                                Book Free Demo
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

