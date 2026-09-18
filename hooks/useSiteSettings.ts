/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type SettingsMap = Record<string, string>;

const DEFAULTS: SettingsMap = {
    academy_name: "Elite's English Academy",
    tagline: "Learn English • Teach English • Build Your Career",
    phone_display: "+91 88887 11228",
    phone_href: "tel:+918888711228",
    whatsapp_number: "918888711228",
    email: "elitejamesw182025@gmail.com",
    address: "Near Sai Deep Hospital, Mondha Naka, Georai, Beed, Maharashtra 431127",
    instagram_url: "https://www.instagram.com/eliteenglishacademy",
    facebook_url: "https://facebook.com/eliteenglishacademy",
    youtube_url: "https://youtube.com/@eliteenglishacademy",
    logo_url: "/vercel.png",
    business_hours: "Mon – Sat: 7:00 AM – 9:00 PM",
    footer_about: "Practical English training for speaking, exams and everyday success.",
    copyright_text: "All Rights Reserved.",
    announcement_title: "Admissions Open 2026",
    announcement_text: "Book your free demo class today and start speaking English with confidence!",
    mission_title: "Confident Communicators",
    mission_text:
        "We help every learner speak with ease. You build strong English basics and the confidence to use them in class, at work, and in daily life.",
    vision_title: "Lifelong Success",
    vision_text:
        "We aim to be the most trusted English academy in the region. Here you learn English, find your strengths, and build a career you can be proud of.",
};

export function whatsappLink(number?: string, message?: string) {
    const n = (number || DEFAULTS.whatsapp_number).replace(/\D/g, "");
    const text = message || "Hello Elite's English Academy, I want to know more about your courses.";
    return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}

export function useSiteSettings() {
    const [settings, setSettings] = useState<SettingsMap>(DEFAULTS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const { data } = await supabase.from("settings").select("key, value");
                if (data && data.length > 0) {
                    const map: SettingsMap = { ...DEFAULTS };
                    for (const row of data as { key: string; value: string | null }[]) {
                        if (row.value) map[row.key] = row.value;
                    }
                    setSettings(map);
                }
            } catch {
                // keep defaults offline-safe
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return { settings, loading };
}

export async function uploadSiteImage(file: File, folder = "site"): Promise<string> {
    const buckets = ["site-assets", "logos", "uploads", "gallery", "courses"];
    const clean = file.name.replace(/\s+/g, "-");
    const fileName = `${folder}/${Date.now()}-${clean}`;
    let lastError: Error | null = null;
    for (const bucket of buckets) {
        const { error } = await supabase.storage.from(bucket).upload(fileName, file);
        if (!error) {
            const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
            return data.publicUrl;
        }
        lastError = error as Error;
    }
    throw new Error(lastError?.message || "Image upload failed. Create a public storage bucket first.");
}
