import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GallerySection from "@/components/GalleryCard";
import { academy } from "@/lib/site";

export default function GalleryPage() {
    return (
        <>
            <Navbar />
            <GallerySection />

            <section className="bg-white py-8 sm:py-10">
                <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-10 xl:px-14">
                    <div className="rounded-[2rem] bg-gradient-to-r from-[#0F172A] via-[#1D4ED8] to-[#2563EB] p-8 text-center text-white shadow-[0_25px_60px_rgba(37,99,235,0.35)] sm:p-10">
                        <h2 className="text-3xl font-black sm:text-4xl">Want to Join Elite English Academy?</h2>
                        <p className="mt-3 text-base text-blue-100">Start your journey with expert guidance and practical English learning.</p>
                        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                            <a
                                href={`${academy.whatsappHref}?text=${encodeURIComponent(academy.whatsappMessage)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#1D4ED8] transition hover:bg-blue-50"
                            >
                                WhatsApp Us
                            </a>
                            <a
                                href={academy.phoneHref}
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

