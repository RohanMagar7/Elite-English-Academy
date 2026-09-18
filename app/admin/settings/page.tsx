/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { safeClientMessage } from "@/lib/client-errors";

const KEY_GROUPS: { key: string; label: string; placeholder: string; type?: string; textarea?: boolean }[] = [
    { key: "academy_name", label: "Academy Name", placeholder: "Elite's English Academy" },
    { key: "tagline", label: "Tagline", placeholder: "Learn English • Teach English • Build Your Career" },
    { key: "logo_url", label: "Logo Image URL (upload below or paste URL)", placeholder: "https://..." },
    { key: "phone_display", label: "Phone (display)", placeholder: "+91 88887 11228" },
    { key: "phone_href", label: "Phone Link (tel:)", placeholder: "tel:+918888711228" },
    { key: "whatsapp_number", label: "WhatsApp Number (digits only)", placeholder: "918888711228" },
    { key: "email", label: "Email", placeholder: "elitejamesw182025@gmail.com" },
    { key: "address", label: "Address", placeholder: "Full address" },
    { key: "business_hours", label: "Business Hours", placeholder: "Mon – Sat: 7:00 AM – 9:00 PM" },
    { key: "instagram_url", label: "Instagram URL", placeholder: "https://instagram.com/..." },
    { key: "facebook_url", label: "Facebook URL", placeholder: "https://facebook.com/..." },
    { key: "youtube_url", label: "YouTube URL", placeholder: "https://youtube.com/..." },
    { key: "footer_about", label: "Footer About Text", placeholder: "Short about text in footer" },
    { key: "copyright_text", label: "Copyright Line", placeholder: "All Rights Reserved." },
    { key: "mission_title", label: "Mission Title (About page)", placeholder: "Confident Communicators" },
    { key: "mission_text", label: "Mission Statement (About page)", placeholder: "What the academy aims to do every day…", textarea: true },
    { key: "vision_title", label: "Vision Title (About page)", placeholder: "Lifelong Success" },
    { key: "vision_text", label: "Vision Statement (About page)", placeholder: "The long-term goal of the academy…", textarea: true },
];

export default function SettingsPage() {
    const [values, setValues] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        async function load() {
            const { data } = await supabase.from("settings").select("key, value");
            if (data) {
                const map: Record<string, string> = {};
                data.forEach((row) => {
                    map[row.key] = row.value ?? "";
                });
                setValues(map);
            }
        }
        load();
    }, []);

    function change(key: string, value: string) {
        setValues((prev) => ({ ...prev, [key]: value }));
        setSaved(false);
    }

    async function save(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const rows = KEY_GROUPS.filter((g) => values[g.key]).map((g) => ({
            key: g.key,
            value: values[g.key],
        }));
        if (rows.length > 0) {
            const { error } = await supabase.from("settings").upsert(rows, { onConflict: "key" });
            if (error) {
                setLoading(false);
                alert(safeClientMessage(error, "Save failed. Please try again."));
                return;
            }
        }
        setLoading(false);
        setSaved(true);
        alert("Settings saved!");
    }

    async function uploadLogo(file: File) {
        setUploading(true);
        try {
            const buckets = ["logos", "site-assets", "uploads", "gallery"];
            const name = `logo/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
            let url = "";
            let lastErr = "";
            for (const b of buckets) {
                const { error } = await supabase.storage.from(b).upload(name, file);
                if (!error) {
                    url = supabase.storage.from(b).getPublicUrl(name).data.publicUrl;
                    break;
                }
                lastErr = error.message;
            }
            if (!url) throw new Error(lastErr || "Upload failed");
            change("logo_url", url);
            alert("Logo uploaded! Click Save Settings to apply.");
        } catch (e) {
            alert(safeClientMessage(e, "Upload failed"));
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="max-w-3xl">
            <h2 className="admin-page-title">Site Settings</h2>
            <p className="text-slate-600 mb-6">
                Manage academy-wide details (name, contact, social links, logo, business hours).
            </p>

            <div className="mb-4 rounded-xl bg-white p-6 shadow">
                <p className="mb-2 text-sm font-semibold text-slate-600">Website Logo</p>
                {values.logo_url ? (
                    <img src={values.logo_url} alt="Logo preview" className="mb-3 h-20 w-20 rounded-xl border object-contain bg-white p-1" />
                ) : null}
                <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLogo(f); }}
                    className="input-default" />
                {uploading && <p className="mt-2 text-sm text-blue-700">Uploading logo...</p>}
            </div>

            <form onSubmit={save} className="grid gap-4 rounded-xl bg-white p-6 shadow">
                {KEY_GROUPS.map((g) => (
                    <label key={g.key} className="block">
                        <span className="mb-1 block text-sm font-semibold text-slate-600">{g.label}</span>
                        {g.textarea ? (
                            <textarea
                                value={values[g.key] || ""}
                                onChange={(e) => change(g.key, e.target.value)}
                                placeholder={g.placeholder}
                                rows={4}
                                maxLength={5000}
                                className="input-default"
                            />
                        ) : (
                            <input
                                value={values[g.key] || ""}
                                onChange={(e) => change(g.key, e.target.value)}
                                placeholder={g.placeholder}
                                maxLength={2000}
                                className="input-default"
                            />
                        )}
                    </label>
                ))}

                <button disabled={loading} className="admin-btn-primary w-full sm:w-fit">
                    {loading ? "Saving..." : "Save Settings"}
                </button>
                {saved && (
                    <p className="text-sm font-medium text-green-700">Changes saved!</p>
                )}
            </form>
        </div>
    );
}
