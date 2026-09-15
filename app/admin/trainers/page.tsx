"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Trainer {
    id: string;
    name: string;
    qualification: string;
    experience: string;
    specialization: string;
    role?: string | null;
    photo_url?: string | null;
    is_active?: boolean;
}

const EMPTY = {
    name: "",
    qualification: "",
    experience: "",
    specialization: "",
    role: "",
    photo_url: "",
    is_active: true,
};

export default function TrainersAdmin() {
    const [items, setItems] = useState<Trainer[]>([]);
    const [form, setForm] = useState(EMPTY);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState<string | null>(null);

    async function load() {
        const { data } = await supabase.from("trainers").select("*").order("created_at", { ascending: true });
        setItems(data || []);
    }

    useEffect(() => {
        load();
    }, []);

    function change(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const target = e.target as HTMLInputElement;
        const val = target.type === "checkbox" ? target.checked : target.value;
        setForm({ ...form, [e.target.name]: val });
    }

    async function uploadPhoto(selectedFile: File): Promise<string> {
        const buckets = ["trainers", "courses", "gallery"];
        let lastError: Error | null = null;
        for (const bucket of buckets) {
            const fileName = `${Date.now()}-${selectedFile.name.replace(/\s+/g, "-")}`;
            const { error } = await supabase.storage.from(bucket).upload(fileName, selectedFile);
            if (!error) {
                const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
                return data.publicUrl;
            }
            lastError = error;
        }
        throw new Error(lastError?.message || "Unable to upload trainer photo.");
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.name || !form.qualification) {
            alert("Please provide the trainer name and qualification.");
            return;
        }
        setLoading(true);
        try {
            let photoUrl = form.photo_url.trim() || null;
            if (file) {
                photoUrl = await uploadPhoto(file);
            }
            const payload = {
                name: form.name,
                qualification: form.qualification,
                experience: form.experience,
                specialization: form.specialization,
                role: form.role || null,
                photo_url: photoUrl,
                is_active: form.is_active,
            };
            const { error } = editing
                ? await supabase.from("trainers").update(payload).eq("id", editing)
                : await supabase.from("trainers").insert([payload]);
            if (error) return alert(error.message);
            alert(editing ? "Trainer updated." : "Trainer added.");
            setForm(EMPTY);
            setFile(null);
            setEditing(null);
            load();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Upload failed.");
        } finally {
            setLoading(false);
        }
    }

    function startEdit(trainer: Trainer) {
        setEditing(trainer.id);
        setForm({
            name: trainer.name,
            qualification: trainer.qualification,
            experience: trainer.experience,
            specialization: trainer.specialization,
            role: trainer.role || "",
            photo_url: trainer.photo_url || "",
            is_active: trainer.is_active ?? true,
        });
    }

    async function toggle(id: string, active: boolean) {
        await supabase.from("trainers").update({ is_active: !active }).eq("id", id);
        load();
    }

    async function remove(id: string) {
        if (!confirm("Delete this trainer?")) return;
        await supabase.from("trainers").delete().eq("id", id);
        load();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-blue-900">Trainers / Faculty</h1>

            <form onSubmit={submit} className="grid gap-4 rounded-xl bg-white p-6 shadow md:grid-cols-2">
                <input name="name" placeholder="Trainer Name" value={form.name} onChange={change} className="input-default" required />
                <input name="role" placeholder="Role (e.g., Founder & Principal Trainer)" value={form.role} onChange={change} className="input-default" />
                <input name="qualification" placeholder="Qualification (e.g., M.A. English | MH-SET)" value={form.qualification} onChange={change} className="input-default" required />
                <input name="experience" placeholder="Experience (e.g., 12+ Years)" value={form.experience} onChange={change} className="input-default" />
                <textarea name="specialization" placeholder="Specialization (e.g., Spoken English • IELTS)" value={form.specialization} onChange={change} className="input-default md:col-span-2" />
                <input name="photo_url" placeholder="Photo URL (optional)" value={form.photo_url} onChange={change} className="input-default" />
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="input-default file:mr-4 file:rounded file:border-0 file:bg-blue-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white" />
                <label className="flex items-center gap-3 md:col-span-2">
                    <input type="checkbox" name="is_active" checked={form.is_active} onChange={change} /> Active
                </label>
                <div className="flex gap-3 md:col-span-2">
                    <button disabled={loading} className="btn-primary text-on-primary">
                        {loading ? "Saving..." : editing ? "Update Trainer" : "Add Trainer"}
                    </button>
                    {editing && (
                        <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); setFile(null); }} className="btn-accent text-blue-950">Cancel</button>
                    )}
                </div>
            </form>

            <div className="grid gap-4 md:grid-cols-2">
                {items.map((trainer) => (
                    <div key={trainer.id} className="rounded-xl border bg-white p-4 shadow">
                        <div className="flex items-center gap-3">
                            {trainer.photo_url ? (
                                <img src={trainer.photo_url} alt={trainer.name} className="h-14 w-14 rounded-lg object-cover" />
                            ) : (
                                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-100 text-xs font-semibold text-blue-900">PHOTO</div>
                            )}
                            <div className="min-w-0">
                                <h3 className="truncate font-semibold text-blue-900">{trainer.name}</h3>
                                <p className="truncate text-sm text-gray-600">{trainer.qualification}</p>
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-black">{trainer.experience}</p>
                        <p className="mt-1 text-sm text-black">{trainer.specialization}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <button onClick={() => startEdit(trainer)} className="btn-accent text-blue-950">Edit</button>
                            <button onClick={() => toggle(trainer.id, !!trainer.is_active)} className="rounded-lg bg-yellow-400 px-3 py-2 text-sm font-semibold text-blue-950">
                                {trainer.is_active ? "Deactivate" : "Activate"}
                            </button>
                            <button onClick={() => remove(trainer.id)} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="rounded-xl border border-dashed border-blue-200 bg-white p-8 text-center text-gray-500 md:col-span-2">No trainers yet. Add your first trainer above.</div>
                )}
            </div>
        </div>
    );
}