"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-950 to-blue-700 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-8 py-20 lg:grid-cols-2">
        <div>
          <h1 className="text-5xl font-bold leading-tight">
            Shape Your Future With
            <span className="text-yellow-400"> Elite English Academy</span>
          </h1>

          <p className="mt-6 text-lg text-gray-200">
            Learn English, Scholarship Preparation, Personal Mentorship and Teacher Training.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/admission"
              className="rounded-xl bg-yellow-400 px-6 py-3 font-bold text-blue-950"
            >
              Admission Open
            </Link>

            <a
              href="https://wa.me/918888711228"
              className="rounded-xl border border-white px-6 py-3"
            >
              WhatsApp Us
            </a>
          </div>
        </div>

        <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
          <img
            src="/hero/teacher.png"
            alt="Elite Academy"
            className="rounded-2xl w-full"
          />
        </div>
      </div>
    </section>
  );
}