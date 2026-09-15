"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const KEY_GROUPS: { key: string; label: string; placeholder: string }[] = [
    { key: "academy_name", label: "Academy Name", placeholder: "Elite's English Academy" },
    { key: "tagline", label: "Tagline", placeholder: "Learn English • Teach English • Build Your Career" },
    { key: "phone", label: "Phone (display)", placeholder: "+91 88887 11228" },
    { key: "email", label: "Email", placeholder: "elitejamesw182025@gmail.com" },
    { key: "whatsapp", label: "WhatsApp Number", placeholder: "+91 88887 11228" },
    { key: "address", label: "Address", placeholder: "Full address" },
    { key: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/..." },
    { key: "facebook", label: "Facebook URL", placeholder: "https://facebook.com/..." },
    { key: "youtube", label: "YouTube URL", placeholder: "https://youtube.com/..." },
    { key: "logo_url", label: "Logo Image URL", placeholder: "https://..." },
    { key: "business_hours", label: "Business Hours", placeholder: "Mon – Sat: 7:00 AM – 9:00 PM" },
];

export default function SettingsPage() {
    const [values, setValues] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
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
                alert(error.message);
                return;
            }
        }
        setLoading(false);
        setSaved(true);
        alert("Settings saved!");
    }

    return (
        <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-blue-900 mb-1">Site Settings</h2>
            <p className="text-gray-600 mb-6">
                Manage academy-wide details (name, contact, social links, logo, business hours).
            </p>

            <form onSubmit={save} className="grid gap-4 rounded-xl bg-white p-6 shadow">
                {KEY_GROUPS.map((g) => (
                    <label key={g.key} className="block">
                        <span className="mb-1 block text-sm font-semibold text-slate-700">{g.label}</span>
                        <input
                            value={values[g.key] || ""}
                            onChange={(e) => change(g.key, e.target.value)}
                            placeholder={g.placeholder}
                            className="input-default"
                        />
                    </label>
                ))}

                <button disabled={loading} className="btn-primary text-on-primary w-fit">
                    {loading ? "Saving..." : "Save Settings"}
                </button>
                {saved && (
                    <p className="text-sm font-medium text-green-700">Changes saved!</p>
                )}
            </form>
        </div>
    );
}

