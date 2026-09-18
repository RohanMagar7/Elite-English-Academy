/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useSafeReducedMotion } from "@/hooks/useMounted";
import { supabase } from "@/lib/supabase";

interface GalleryImage {
    id: string;
    title: string;
    image_url: string;
    created_at?: string;
    is_active?: boolean;
}

const imageHeights = ["h-48", "h-64", "h-80", "h-56", "h-72", "h-60"];

export default function GallerySection() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const reduceMotion = useSafeReducedMotion();

    useEffect(() => {
        async function load() {
            const { data } = await supabase
                .from("gallery")
                .select("*")
                .eq("is_active", true)
                .limit(6)
                .order("sort_order", { ascending: true })
                .order("created_at", { ascending: false });

            setImages(data || []);
        }

        load();
    }, []);

    const closeLightbox = useCallback(() => setLightboxIndex(null), []);

    const showPrev = useCallback(() => {
        setLightboxIndex((i) =>
            i === null ? null : (i - 1 + images.length) % images.length
        );
    }, [images.length]);

    const showNext = useCallback(() => {
        setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length));
    }, [images.length]);

    // Close on Escape + lock body scroll while the lightbox is open.
    useEffect(() => {
        if (lightboxIndex === null) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") showPrev();
            if (e.key === "ArrowRight") showNext();
        };

        document.addEventListener("keydown", onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [lightboxIndex, closeLightbox, showPrev, showNext]);

    const lightboxImage = lightboxIndex === null ? null : images[lightboxIndex];

    const formatDate = (value?: string) => {
        if (!value) return null;
        try {
            return new Date(value).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
        } catch {
            return null;
        }
    };


    return (
        <section className="bg-[#F8FBFF] py-6 sm:py-8">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-14">
                <div className="mb-6 flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
                    <div>
                        <span className="badge-text inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 font-semibold text-secondary">
                            Gallery Preview
                        </span>
                        <h2 className="mt-3 font-section font-black text-primary sm:text-4xl">
                            Campus Moments & Learning Spirit
                        </h2>
                    </div>

                    <Link
                        href="/gallery"
                                className="btn-primary"
                    >
                        View Full Gallery
                    </Link>
                </div>

                <div className="columns-1 gap-5 sm:columns-2 xl:columns-3">
                    {images.map((img, index) => (
                        <motion.div
                            key={img.id}
                            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : index * 0.04 }}
                            whileHover={reduceMotion ? undefined : { y: -6 }}
                            className="group mb-5 overflow-hidden rounded-[1.5rem]"
                        >
                            <button
                                type="button"
                                onClick={() => setLightboxIndex(index)}
                                aria-label={`Open image: ${img.title}`}
                                className="relative block w-full cursor-zoom-in overflow-hidden rounded-[1.5rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-blue-950/90 p-4 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-label={lightboxImage.title}
                    onClick={closeLightbox}
                >
                    {/* Close */}
                    <button
                        type="button"
                        onClick={closeLightbox}
                        aria-label="Close"
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    {/* Prev */}
                    {images.length > 1 && (
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); showPrev(); }}
                            aria-label="Previous image"
                            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                    )}

                    {/* Next */}
                    {images.length > 1 && (
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); showNext(); }}
                            aria-label="Next image"
                            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    )}

                    {/* Image + Details */}
                    <figure
                        className="max-h-full w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative flex max-h-[70vh] items-center justify-center bg-blue-50">
                            <img
                                src={lightboxImage.image_url}
                                alt={lightboxImage.title}
                                className="max-h-[70vh] w-auto max-w-full object-contain"
                            />
                        </div>

                        <figcaption className="flex flex-wrap items-center justify-between gap-2 p-4 sm:p-5">
                            <div>
                                <p className="text-base font-bold text-blue-950">
                                    {lightboxImage.title}
                                </p>
                                {formatDate(lightboxImage.created_at) && (
                                    <p className="mt-0.5 text-xs font-medium text-slate-500">
                                        {formatDate(lightboxImage.created_at)}
                                    </p>
                                )}
                            </div>

                            {images.length > 1 && (
                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                    {lightboxIndex! + 1} / {images.length}
                                </span>
                            )}
                        </figcaption>
                    </figure>
                </div>
            )}
        </section>
    );
}