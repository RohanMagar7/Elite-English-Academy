"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface GalleryImage {
    id: string;
    title: string;
    category: string;
    image_url: string;
}

export default function GalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    async function getImages() {
        const { data, error } = await supabase
            .from("gallery")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        setImages(data || []);
    }

    useEffect(() => {
        getImages();
    }, []);

    async function uploadImage(e: React.FormEvent) {
        e.preventDefault();

        if (!file) {
            alert("Please select an image.");
            return;
        }

        setLoading(true);

        const fileName = `${Date.now()}-${file.name}`;

        // Upload to Storage
        const { error: uploadError } = await supabase.storage
            .from("gallery")
            .upload(fileName, file);

        if (uploadError) {
            console.error(uploadError);
            alert(uploadError.message);
            setLoading(false);
            return;
        }

        // Get public URL
        const { data } = supabase.storage
            .from("gallery")
            .getPublicUrl(fileName);

        // Save URL in database
        const { error: dbError } = await supabase.from("gallery").insert({
            title,
            category,
            image_url: data.publicUrl,
        });

        if (dbError) {
            console.error(dbError);
            alert(dbError.message);
            setLoading(false);
            return;
        }

        alert("Image Uploaded Successfully!");

        setTitle("");
        setCategory("");
        setFile(null);

        await getImages();
        setLoading(false);
    }

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-blue-900 mb-6">
                Gallery Management
            </h1>

            <form onSubmit={uploadImage} className="bg-white p-6 rounded-xl shadow space-y-4">
                <input
                    type="text"
                    placeholder="Image Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border rounded-lg p-3 text-black"
                    required
                />

                <input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border rounded-lg p-3 text-black"
                    required
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full border rounded-lg p-3 text-black"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-900 text-white px-6 py-3 rounded-lg"
                >
                    {loading ? "Uploading..." : "Upload Image"}
                </button>
            </form>

            <div className="grid md:grid-cols-3 gap-4 mt-8">
                {images.map((img) => (
                    <div key={img.id} className="bg-white rounded-xl shadow overflow-hidden">
                        <img
                            src={img.image_url}
                            alt={img.title}
                            className="w-full h-48 object-cover"
                        />

                        <div className="p-4">
                            <h3 className="font-semibold text-black">{img.title}</h3>
                            <p className="text-gray-500">{img.category}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}