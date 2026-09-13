import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NoticeSection from "@/components/NoticeCard";
import { academy } from "@/lib/site";

export default function NoticesPage() {
    return (
        <>
            <Navbar />
            <NoticeSection />

            <section className="bg-[#F8FBFF] py-12 sm:py-16">
                <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-10 xl:px-14">
                    <div className="rounded-[2rem] border border-blue-100 bg-white p-8 shadow-[0_18px_40px_rgba(37,99,235,0.08)]">
                        <h3 className="text-2xl font-black text-blue-950">For Enquiries</h3>
                        <p className="mt-3 text-base text-slate-600">Reach out to our team for admissions, batches, or course guidance.</p>
                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <a href={academy.phoneHref} className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-center text-sm font-semibold text-blue-900 hover:bg-blue-100">
                                {academy.phoneDisplay}
                            </a>
                            <a href={academy.emailHref} className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-center text-sm font-semibold text-blue-900 hover:bg-blue-100">
                                {academy.email}
                            </a>
                            <a href={`${academy.whatsappHref}?text=${encodeURIComponent(academy.whatsappMessage)}`} target="_blank" rel="noreferrer" className="rounded-2xl border border-green-200 bg-green-50 p-4 text-center text-sm font-semibold text-green-800 hover:bg-green-100">
                                WhatsApp Us
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

