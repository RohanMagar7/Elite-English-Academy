"use client";

import Link from "next/link";

export default function Hero() {
    return (
        <section className="bg-hero-gradient text-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-8 py-20 lg:grid-cols-2">
                <div className="flex flex-col justify-center">
                    <h1 className="text-5xl font-bold leading-tight">
                        Shape Your Future With
                        <span className="text-accent"> Elite English Academy</span>
                    </h1>

                    <p className="mt-6 text-lg text-gray-200">
                        Learn English, Scholarship Preparation, Personal Mentorship and Teacher Training.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <Link
                            href="/admission"
                            className="inline-flex items-center justify-center h-12 rounded-xl btn-accent px-6 font-bold"
                        >
                            Admission Open
                        </Link>

                        <a
                            href="https://wa.me/918888711228"
                            className="inline-flex items-center justify-center h-12 rounded-xl border border-white px-6 text-white"
                        >
                            WhatsApp Us
                        </a>
                    </div>
                </div>

                <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
                    <img
                        src="/hero/Teacher.jpeg"
                        alt="Elite Academy"
                        className="rounded-2xl w-full"
                    />
                </div>
            </div>
        </section>
    );
}