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

          <div className="grid grid-cols-3 gap-6 mt-8 text-center">
            <div>
              <GraduationCap className="mx-auto text-yellow-500" size={36} />
              <h3 className="font-bold mt-2">500+</h3>
              <p className="text-sm text-gray-500">Students</p>
            </div>

            <div>
              <Users className="mx-auto text-yellow-500" size={36} />
              <h3 className="font-bold mt-2">12+</h3>
              <p className="text-sm text-gray-500">Years Experience</p>
            </div>

            <div>
              <BookOpen className="mx-auto text-yellow-500" size={36} />
              <h3 className="font-bold mt-2">4+</h3>
              <p className="text-sm text-gray-500">Courses</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}