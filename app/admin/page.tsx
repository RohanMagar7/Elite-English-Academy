"use client";

import DashboardCard from "@/components/DashboardCard";
import { BookOpen, Clock, Image, Bell, Star, CircleHelp, Trophy, UserCheck, Users, User, Images, Menu as MenuIcon, BarChart3, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AdminDashboard() {
    const [counts, setCounts] = useState({
        courses: 0,
        gallery: 0,
        notices: 0,
        testimonials: 0,
        batches: 0,
        faqs: 0,
        successStories: 0,
        trainers: 0,
        admissions: 0,
        nav: 0,
        hero: 0,
        stats: 0,
        features: 0,
        footer: 0,
    });

    useEffect(() => {
        async function loadCounts() {
            try {
                const [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14] = await Promise.all([
                    supabase.from("courses").select("id", { head: true, count: "exact" }),
                    supabase.from("gallery").select("id", { head: true, count: "exact" }),
                    supabase.from("notices").select("id", { head: true, count: "exact" }),
                    supabase.from("testimonials").select("id", { head: true, count: "exact" }),
                    supabase.from("batches").select("id", { head: true, count: "exact" }),
                    supabase.from("faqs").select("id", { head: true, count: "exact" }),
                    supabase.from("success_stories").select("id", { head: true, count: "exact" }),
                    supabase.from("trainers").select("id", { head: true, count: "exact" }),
                    supabase.from("admissions").select("id", { head: true, count: "exact" }),
                    supabase.from("navigation_links").select("id", { head: true, count: "exact" }),
                    supabase.from("hero_slides").select("id", { head: true, count: "exact" }),
                    supabase.from("stats").select("id", { head: true, count: "exact" }),
                    supabase.from("features").select("id", { head: true, count: "exact" }),
                    supabase.from("footer_links").select("id", { head: true, count: "exact" }),
                ]);

                setCounts({
                    courses: (c1.count as number) || 0,
                    gallery: (c2.count as number) || 0,
                    notices: (c3.count as number) || 0,
                    testimonials: (c4.count as number) || 0,
                    batches: (c5.count as number) || 0,
                    faqs: (c6.count as number) || 0,
                    successStories: (c7.count as number) || 0,
                    trainers: (c8.count as number) || 0,
                    admissions: (c9.count as number) || 0,
                    nav: (c10.count as number) || 0,
                    hero: (c11.count as number) || 0,
                    stats: (c12.count as number) || 0,
                    features: (c13.count as number) || 0,
                    footer: (c14.count as number) || 0,
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

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard title="Courses" value={String(counts.courses)} icon={<BookOpen size={36} />} />
                <DashboardCard title="Trainers" value={String(counts.trainers)} icon={<UserCheck size={36} />} />
                <DashboardCard title="Batches" value={String(counts.batches)} icon={<Clock size={36} />} />
                <DashboardCard title="Success Stories" value={String(counts.successStories)} icon={<Trophy size={36} />} />
                <DashboardCard title="Testimonials" value={String(counts.testimonials)} icon={<Star size={36} />} />
                <DashboardCard title="FAQs" value={String(counts.faqs)} icon={<CircleHelp size={36} />} />
                <DashboardCard title="Gallery Images" value={String(counts.gallery)} icon={<Image size={36} />} />
                <DashboardCard title="Notices" value={String(counts.notices)} icon={<Bell size={36} />} />
                <DashboardCard title="Admissions" value={String(counts.admissions)} icon={<Users size={36} />} />
                <DashboardCard title="Menu Links" value={String(counts.nav)} icon={<MenuIcon size={36} />} />
                <DashboardCard title="Hero Banners" value={String(counts.hero)} icon={<Images size={36} />} />
                <DashboardCard title="Stats" value={String(counts.stats)} icon={<BarChart3 size={36} />} />
                <DashboardCard title="Features" value={String(counts.features)} icon={<BookOpen size={36} />} />
                <DashboardCard title="Footer Links" value={String(counts.footer)} icon={<Share2 size={36} />} />
            </div>
        </>
    );
}