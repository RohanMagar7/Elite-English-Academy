"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface GalleryImage {
    id: string;
    title: string;
    category: string;
    image_url: string;
    sort_order?: number;
    is_active?: boolean;
}

export default function GalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [editing, setEditing] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    async function getImages() {
        const { data, error } = await supabase
            .from("gallery")
            .select("*")
            .order("sort_order", { ascending: true })
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

        if (!editing && !file) {
            alert("Please select an image.");
            return;
        }

        setLoading(true);

        try {
            let imageUrl: string | null = null;

            if (file) {
                const fileName = `${Date.now()}-${file.name}`;
                const { error: uploadError } = await supabase.storage
                    .from("gallery")
                    .upload(fileName, file);

                if (uploadError) {
                    console.error(uploadError);
                    alert(uploadError.message);
                    return;
                }
                imageUrl = supabase.storage.from("gallery").getPublicUrl(fileName).data.publicUrl;
            }

            const payload = {
                title,
                category,
                sort_order: Number(sortOrder) || 0,
                is_active: isActive,
                ...(imageUrl ? { image_url: imageUrl } : {}),
            };

            const { error: dbError } = editing
                ? await supabase.from("gallery").update(payload).eq("id", editing)
                : await supabase.from("gallery").insert({ ...payload, image_url: imageUrl || "" });

            if (dbError) {
                console.error(dbError);
                alert(dbError.message);
                return;
            }

            alert(editing ? "Image updated!" : "Image Uploaded Successfully!");

            setTitle("");
            setCategory("");
            setSortOrder("");
            setIsActive(true);
            setFile(null);
            setEditing(null);

            await getImages();
        } finally {
            setLoading(false);
        }
    }

    function startEdit(img: GalleryImage) {
        setEditing(img.id);
        setTitle(img.title);
        setCategory(img.category || "");
        setSortOrder(String(img.sort_order ?? 0));
        setIsActive(img.is_active ?? true);
        setFile(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function cancelEdit() {
        setEditing(null);
        setTitle("");
        setCategory("");
        setSortOrder("");
        setIsActive(true);
        setFile(null);
    }

    async function toggleImage(id: string, active: boolean) {
        await supabase.from("gallery").update({ is_active: !active }).eq("id", id);
        getImages();
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
        <div className="admin-page">
            <h1 className="admin-page-title mb-6">
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
                    type="number"
                    placeholder="Sort Order"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="input-default"
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="input-default"
                    required={!editing}
                />

                <label className="flex items-center gap-3 text-sm font-medium text-slate-800">
                    <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                    Active (visible on website)
                </label>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="admin-btn-primary w-full sm:w-auto"
                    >
                        {loading ? "Saving..." : editing ? "Update Image" : "Upload Image"}
                    </button>
                    {editing && (
                        <button type="button" onClick={cancelEdit} className="admin-btn-accent w-full sm:w-auto">
                            Cancel
                        </button>
                    )}
                </div>
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
                                <h3 className="font-semibold text-slate-900">{img.title}</h3>
                                <p className="text-slate-600">{img.category}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 p-4 pt-0">
                            <button onClick={() => startEdit(img)} className="admin-btn-accent w-full sm:w-auto">Edit</button>
                            <button onClick={() => toggleImage(img.id, !!img.is_active)} className={`rounded-lg px-3 py-2 text-sm font-semibold text-white ${img.is_active ? "bg-green-600" : "bg-slate-500"}`}>
                                {img.is_active ? "Hide" : "Show"}
                            </button>
                            <button onClick={() => deleteImage(img.id, img.image_url)} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}