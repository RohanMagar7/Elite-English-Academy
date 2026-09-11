"use client";

import { GraduationCap, Users, BookOpen } from "lucide-react";

export default function AboutSection() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-10 items-center">
                <img
                    src="/hero/classroom.jpg"
                    className="rounded-3xl"
                    alt="Classroom"
                />

                <div>
                    <h2 className="text-4xl font-bold text-blue-900 mb-4">
                        About Elite English Academy
                    </h2>

                    <p className="text-gray-600 leading-8 mb-6">
                        Elite English Academy in Georai helps students from Grade 1 to 10 build strong academic foundations through English coaching, scholarship preparation, personal mentorship and teacher training.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 text-center">
                        <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center">
                            <div className="rounded-full bg-accent p-3 text-blue-950">
                                <GraduationCap size={28} />
                            </div>
                            <h3 className="font-extrabold text-3xl text-blue-900 mt-3">500+</h3>
                            <p className="text-sm text-gray-600 mt-1">Students enrolled</p>
                        </div>

                        <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center">
                            <div className="rounded-full bg-accent p-3 text-blue-950">
                                <Users size={28} />
                            </div>
                            <h3 className="font-extrabold text-3xl text-blue-900 mt-3">12+</h3>
                            <p className="text-sm text-gray-600 mt-1">Years of experience</p>
                        </div>

                        <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center">
                            <div className="rounded-full bg-accent p-3 text-blue-950">
                                <BookOpen size={28} />
                            </div>
                            <h3 className="font-extrabold text-3xl text-blue-900 mt-3">4+</h3>
                            <p className="text-sm text-gray-600 mt-1">Courses offered</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}