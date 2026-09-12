"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Course {
  id: string;
  title: string;
  duration: string;
  fees: number;
  description: string;
  image_url?: string | null;
}

export default function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("courses").select("*");
      setCourses(data || []);
    }
    load();
  }, []);

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">
          Our Courses
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="overflow-hidden rounded-2xl bg-white shadow">
              {course.image_url ? (
                <img
                  src={course.image_url}
                  alt={course.title}
                  className="h-52 w-full object-cover"
                />
              ) : (
                <div className="flex h-52 w-full items-center justify-center bg-blue-100 text-sm font-medium uppercase tracking-wide text-blue-900">
                  Course Image
                </div>
              )}

              <div className="p-6">
                <h3 className="text-2xl font-bold text-blue-900">
                  {course.title}
                </h3>

                <p className="mt-3 text-gray-600">{course.description}</p>

                <div className="mt-6 flex justify-between">
                  <span className="font-semibold">{course.duration}</span>
                  <span className="font-bold text-yellow-600">₹ {course.fees}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}