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

    async function deleteImage(id: string, imageUrl: string) {
        if (!confirm("Delete this image?")) return;

        setLoading(true);

        // try to remove storage object if we can infer the file name
        try {
            const url = new URL(imageUrl);
            const parts = url.pathname.split("/");
            const fileName = parts[parts.length - 1];

            if (fileName) {
                await supabase.storage.from("gallery").remove([fileName]);
            }
        } catch (err) {
            // ignore storage deletion errors
            console.warn("Could not parse storage file name for deletion", err);
        }

        // delete DB record
        const { error } = await supabase.from("gallery").delete().eq("id", id);

        setLoading(false);

        if (error) return alert(error.message);

        setImages((prev) => prev.filter((i) => i.id !== id));
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
                    className="input-default"
                    required
                />

                <input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input-default"
                    required
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="input-default"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary text-on-primary"
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

                        <div className="p-4 flex items-center justify-between gap-4">
                            <div>
                                <h3 className="font-semibold text-black">{img.title}</h3>
                                <p className="text-gray-500">{img.category}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button onClick={() => deleteImage(img.id, img.image_url)} className="btn-accent">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}