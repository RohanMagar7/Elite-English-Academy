"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { safeClientMessage } from "@/lib/client-errors";
import { useConfirmDelete } from "@/hooks/useConfirmDelete";
import { EmptyState } from "@/components/ui";

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
            if (error) return alert(safeClientMessage(error, "Save failed. Please try again."));
            alert(editing ? "Trainer updated." : "Trainer added.");
            setForm(EMPTY);
            setFile(null);
            setEditing(null);
            load();
        } catch (err) {
            alert(safeClientMessage(err, "Upload failed."));
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

    const { requestDelete, dialog } = useConfirmDelete<string>(
        async (id) => {
        await supabase.from("trainers").delete().eq("id", id);
        load();
        },
        "Delete this trainer?",
    );

    return (
        <div className="admin-page">
            {dialog}
            <h1 className="admin-page-title">Trainers / Faculty</h1>

            <form onSubmit={submit} className="admin-card admin-form-grid">
                <input name="name" placeholder="Trainer Name" value={form.name} onChange={change} className="input-default" required />
                <input name="role" placeholder="Role (e.g., Founder & Principal Trainer)" value={form.role} onChange={change} className="input-default" />
                <input name="qualification" placeholder="Qualification (e.g., M.A. English | MH-SET)" value={form.qualification} onChange={change} className="input-default" required />
                <input name="experience" placeholder="Experience (e.g., 12+ Years)" value={form.experience} onChange={change} className="input-default" />
                <textarea name="specialization" placeholder="Specialization (e.g., Spoken English • IELTS)" value={form.specialization} onChange={change} className="input-default md:col-span-2" />
                <input name="photo_url" placeholder="Photo URL (optional)" value={form.photo_url} onChange={change} className="input-default" />
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="input-default" />
                <label className="admin-check-row md:col-span-2">
                    <input type="checkbox" name="is_active" checked={form.is_active} onChange={change} /> Active
                </label>
                <div className="flex gap-3 md:col-span-2">
                    <button disabled={loading} className="admin-btn-primary w-full sm:w-auto">
                        {loading ? "Saving..." : editing ? "Update Trainer" : "Add Trainer"}
                    </button>
                    {editing && (
                        <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); setFile(null); }} className="admin-btn-accent w-full sm:w-auto">Cancel</button>
                    )}
                </div>
            </form>

            <div className="grid grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-2">
                {items.map((trainer) => (
                    <div key={trainer.id} className="admin-card">
                        <div className="flex items-center gap-3">
                            {trainer.photo_url ? (
                                <img src={trainer.photo_url} alt={trainer.name} className="h-14 w-14 rounded-lg object-cover" />
                            ) : (
                                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-100 text-xs font-semibold text-blue-950">PHOTO</div>
                            )}
                            <div className="min-w-0">
                                <h3 className="truncate font-semibold text-blue-950">{trainer.name}</h3>
                                <p className="truncate text-sm text-slate-600">{trainer.qualification}</p>
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-slate-900">{trainer.experience}</p>
                        <p className="mt-1 text-sm text-slate-900">{trainer.specialization}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <button onClick={() => startEdit(trainer)} className="admin-btn-accent w-full sm:w-auto">Edit</button>
                            <button onClick={() => toggle(trainer.id, !!trainer.is_active)} className="admin-btn-sm bg-yellow-400 text-blue-950 hover:bg-yellow-300">
                                {trainer.is_active ? "Deactivate" : "Activate"}
                            </button>
                            <button onClick={() => requestDelete(trainer.id)} className="admin-btn-sm bg-red-600 text-white hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <EmptyState title="md:col-span-2" className="div" />
                )}
            </div>
        </div>
    );
}