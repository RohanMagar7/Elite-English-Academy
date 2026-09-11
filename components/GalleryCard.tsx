"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function GallerySection() {
    const [images, setImages] = useState<any[]>([]);

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
        <section className="py-20 bg-gray-100">
            <div className="max-w-7xl mx-auto px-8">
                <h2 className="text-center text-4xl font-bold text-blue-900 mb-10">
                    Academy Gallery
                </h2>

                <div className="grid md:grid-cols-3 gap-5">
                    {images.map((img) => (
                        <img
                            key={img.id}
                            src={img.image_url}
                            alt={img.title}
                            className="rounded-2xl h-64 w-full object-cover"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}