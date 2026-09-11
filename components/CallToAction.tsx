"use client";

import Link from "next/link";

export default function CallToAction() {
    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-8">
                <div className="rounded-3xl bg-primary-dark p-10 text-on-primary shadow-lg lg:flex lg:items-center lg:justify-between">
                    <div className="mb-6 lg:mb-0">
                        <h2 className="text-3xl font-extrabold">Ready to join Elite English Academy?</h2>
                        <p className="mt-2 text-on-primary/90">Admissions open now — limited seats for scholarship preparation and mentorship programs.</p>
                    </div>

                    <div className="flex gap-4 items-center">
                        <Link href="/admission" className="inline-flex items-center justify-center h-12 rounded-xl btn-accent px-6 font-bold">Apply Now</Link>
                        <Link href="/contact" className="inline-flex items-center justify-center h-12 rounded-xl border border-on-primary/20 px-6 text-on-primary">Contact Us</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
