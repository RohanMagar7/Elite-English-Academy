"use client";

import DashboardCard from "@/components/DashboardCard";
import { BookOpen, Image, Bell, Star, User } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AdminDashboard() {
    const [counts, setCounts] = useState({ courses: 0, gallery: 0, notices: 0, testimonials: 0 });

    useEffect(() => {
        async function loadCounts() {
            try {
                const [c1, c2, c3, c4] = await Promise.all([
                    supabase.from("courses").select("id", { head: true, count: "exact" }),
                    supabase.from("gallery").select("id", { head: true, count: "exact" }),
                    supabase.from("notices").select("id", { head: true, count: "exact" }),
                    supabase.from("testimonials").select("id", { head: true, count: "exact" }),
                ]);

                setCounts({
                    courses: (c1.count as number) || 0,
                    gallery: (c2.count as number) || 0,
                    notices: (c3.count as number) || 0,
                    testimonials: (c4.count as number) || 0,
                });
            } catch (err) {
                console.error("Failed to load dashboard counts", err);
            }
        }

        loadCounts();
    }, []);

    return (
        <>
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-blue-900 mb-2">Dashboard</h1>
                    <p className="text-gray-600 mb-8">Overview of site content and activity.</p>
                </div>

                <div>
                    <Link href="/profile" className="inline-flex items-center gap-2 btn-accent">
                        <User size={16} /> Profile
                    </Link>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                <DashboardCard title="Courses" value={String(counts.courses)} icon={<BookOpen size={36} />} />
                <DashboardCard title="Gallery Images" value={String(counts.gallery)} icon={<Image size={36} />} />
                <DashboardCard title="Notices" value={String(counts.notices)} icon={<Bell size={36} />} />
                <DashboardCard title="Testimonials" value={String(counts.testimonials)} icon={<Star size={36} />} />
            </div>
        </>
    );
}