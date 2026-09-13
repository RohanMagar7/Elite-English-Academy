"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface GalleryImage {
    id: string;
    title: string;
    image_url: string;
    created_at?: string;
}

const imageHeights = ["h-48", "h-64", "h-80", "h-56", "h-72", "h-60"];

export default function GallerySection() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        async function load() {
            const { data } = await supabase
                .from("gallery")
                .select("*")
                .limit(6)
                .order("created_at", { ascending: false });

            setImages(data || []);
        }

        load();
    }, []);

    return (
        <section className="bg-[#F8FBFF] py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-14">
                <div className="mb-10 flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
                    <div>
                        <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-[#2563EB]">
                            Gallery Preview
                        </span>
                        <h2 className="mt-4 text-3xl font-black tracking-tight text-blue-950 sm:text-4xl">
                            Campus Moments & Learning Spirit
                        </h2>
                    </div>

                    <Link
                        href="/gallery"
                        className="inline-flex items-center justify-center rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        View Full Gallery
                    </Link>
                </div>

                <div className="columns-1 gap-5 sm:columns-2 xl:columns-3">
                    {images.map((img, index) => (
                        <motion.div
                            key={img.id}
                            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: shouldReduceMotion ? 0 : index * 0.04 }}
                            whileHover={shouldReduceMotion ? undefined : { y: -6 }}
                            className="group mb-5 overflow-hidden rounded-[1.5rem]"
                        >
                            <div className={`relative overflow-hidden rounded-[1.5rem] ${imageHeights[index % imageHeights.length]}`}>
                                <Image
                                    src={img.image_url}
                                    alt={img.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                    loading="lazy"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}