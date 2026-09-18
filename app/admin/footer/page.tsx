"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { safeClientMessage } from "@/lib/client-errors";
import { useConfirmDelete } from "@/hooks/useConfirmDelete";
import { EmptyState } from "@/components/ui";

type FooterLink = { id: string; group_name: string; label: string; href: string; sort_order: number; is_active: boolean };
type Social = { id: string; platform: string; label: string | null; url: string; sort_order: number; is_active: boolean };

const EMPTY_LINK = { group_name: "quick_links", label: "", href: "#", sort_order: 0, is_active: true };
const EMPTY_SOCIAL = { platform: "", label: "", url: "", sort_order: 0, is_active: true };

export default function FooterAdmin() {
    const [links, setLinks] = useState<FooterLink[]>([]);
    const [socials, setSocials] = useState<Social[]>([]);
    const [linkForm, setLinkForm] = useState(EMPTY_LINK);
    const [socialForm, setSocialForm] = useState(EMPTY_SOCIAL);
    const [editingLink, setEditingLink] = useState<string | null>(null);
    const [editingSocial, setEditingSocial] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function load() {
        const [l, s] = await Promise.all([
            supabase.from("footer_links").select("*").order("sort_order"),
            supabase.from("social_links").select("*").order("sort_order"),
        ]);
        setLinks((l.data as FooterLink[]) || []);
        setSocials((s.data as Social[]) || []);
    }
    useEffect(() => { load(); }, []);
    const { requestDelete: requestLinkDelete, dialog: linkDialog } = useConfirmDelete<string>(
        async (id) => { await supabase.from("footer_links").delete().eq("id", id); load(); },
        "Delete this footer link?",
    );
    const { requestDelete: requestSocialDelete, dialog: socialDialog } = useConfirmDelete<string>(
        async (id) => { await supabase.from("social_links").delete().eq("id", id); load(); },
        "Delete this social link?",
    );

    function changeLink(e: React.ChangeEvent<HTMLInputElement>) {
        const t = e.target as HTMLInputElement;
        setLinkForm({ ...linkForm, [e.target.name]: t.type === "checkbox" ? t.checked : t.value });
    }
    function changeSocial(e: React.ChangeEvent<HTMLInputElement>) {
        const t = e.target as HTMLInputElement;
        setSocialForm({ ...socialForm, [e.target.name]: t.type === "checkbox" ? t.checked : t.value });
    }

    async function submitLink(e: React.FormEvent) {
        e.preventDefault();
        if (!linkForm.label) return alert("Label required");
        setLoading(true);
        const payload = { group_name: linkForm.group_name || "quick_links", label: linkForm.label, href: linkForm.href || "#", sort_order: Number(linkForm.sort_order) || 0, is_active: linkForm.is_active };
        const { error } = editingLink ? await supabase.from("footer_links").update(payload).eq("id", editingLink) : await supabase.from("footer_links").insert([payload]);
        setLoading(false);
        if (error) return alert(safeClientMessage(error, "Save failed. Please try again."));
        setLinkForm(EMPTY_LINK); setEditingLink(null); load();
    }

    async function submitSocial(e: React.FormEvent) {
        e.preventDefault();
        if (!socialForm.platform || !socialForm.url) return alert("Platform and URL required");
        setLoading(true);
        const payload = { platform: socialForm.platform, label: socialForm.label || socialForm.platform, url: socialForm.url, sort_order: Number(socialForm.sort_order) || 0, is_active: socialForm.is_active };
        const { error } = editingSocial ? await supabase.from("social_links").update(payload).eq("id", editingSocial) : await supabase.from("social_links").insert([payload]);
        setLoading(false);
        if (error) return alert(safeClientMessage(error, "Save failed. Please try again."));
        setSocialForm(EMPTY_SOCIAL); setEditingSocial(null); load();
    }
    return (
        <div className="space-y-10">
            <div>
                <h1 className="admin-page-title">Footer & Social Links</h1>
                <p className="text-slate-600">Manage footer link columns and social media links.</p>
            </div>

            <div>
                <h2 className="mb-3 text-xl font-bold text-blue-950">Footer Links</h2>
                <form onSubmit={submitLink} className="admin-card admin-form-grid">
                    <input name="group_name" placeholder="Group (quick_links / courses / legal)" value={linkForm.group_name} onChange={changeLink} className="input-default" />
                    <input name="label" placeholder="Label" value={linkForm.label} onChange={changeLink} className="input-default" required />
                    <input name="href" placeholder="Link" value={linkForm.href} onChange={changeLink} className="input-default" />
                    <input name="sort_order" type="number" placeholder="Order" value={linkForm.sort_order} onChange={changeLink} className="input-default" />
                    <label className="flex items-center gap-3"><input type="checkbox" name="is_active" checked={linkForm.is_active} onChange={changeLink} /> Active</label>
                    <div className="flex gap-3 md:col-span-2">
                        <button disabled={loading} className="admin-btn-primary w-full sm:w-auto">{loading ? "Saving..." : editingLink ? "Update Link" : "Add Link"}</button>
                        {editingLink && <button type="button" onClick={() => { setEditingLink(null); setLinkForm(EMPTY_LINK); }} className="admin-btn-accent w-full sm:w-auto">Cancel</button>}
                    </div>
                </form>
                <div className="mt-4 space-y-3">
                    {links.map((l) => (
                        <div key={l.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4 shadow">
                            <div><p className="font-semibold text-blue-950">{l.label}</p><p className="text-sm text-slate-600">{l.group_name} • {l.href}</p></div>
                            <div className="flex gap-2">
                                <button onClick={() => { setEditingLink(l.id); setLinkForm({ group_name: l.group_name, label: l.label, href: l.href || "#", sort_order: l.sort_order || 0, is_active: l.is_active ?? true }); }} className="admin-btn-accent w-full sm:w-auto">Edit</button>
                                <button onClick={async () => { await supabase.from("footer_links").update({ is_active: !l.is_active }).eq("id", l.id); load(); }} className="admin-btn-sm bg-yellow-400 text-blue-950 hover:bg-yellow-300">{l.is_active ? "Hide" : "Show"}</button>
                                <button onClick={() => requestLinkDelete(l.id)} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white">Delete</button>
                            </div>
                        </div>
                    ))}
                    {links.length === 0 && <EmptyState title="" className="p" />}
                </div>
            </div>
            <div>
                <h2 className="mb-3 text-xl font-bold text-blue-950">Social Media Links</h2>
                <form onSubmit={submitSocial} className="admin-card admin-form-grid">
                    <input name="platform" placeholder="Platform (WhatsApp / Instagram / Facebook / YouTube)" value={socialForm.platform} onChange={changeSocial} className="input-default" required />
                    <input name="label" placeholder="Label (optional)" value={socialForm.label} onChange={changeSocial} className="input-default" />
                    <input name="url" placeholder="URL" value={socialForm.url} onChange={changeSocial} className="input-default md:col-span-2" required />
                    <input name="sort_order" type="number" placeholder="Order" value={socialForm.sort_order} onChange={changeSocial} className="input-default" />
                    <label className="flex items-center gap-3"><input type="checkbox" name="is_active" checked={socialForm.is_active} onChange={changeSocial} /> Active</label>
                    <div className="flex gap-3 md:col-span-2">
                        <button disabled={loading} className="admin-btn-primary w-full sm:w-auto">{loading ? "Saving..." : editingSocial ? "Update Social Link" : "Add Social Link"}</button>
                        {editingSocial && <button type="button" onClick={() => { setEditingSocial(null); setSocialForm(EMPTY_SOCIAL); }} className="admin-btn-accent w-full sm:w-auto">Cancel</button>}
                    </div>
                </form>
                <div className="mt-4 space-y-3">
                    {socials.map((s) => (
                        <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4 shadow">
                            <div><p className="font-semibold text-blue-950">{s.platform}</p><p className="text-sm text-slate-600 break-all">{s.url}</p></div>
                            <div className="flex gap-2">
                                <button onClick={() => { setEditingSocial(s.id); setSocialForm({ platform: s.platform, label: s.label || "", url: s.url, sort_order: s.sort_order || 0, is_active: s.is_active ?? true }); }} className="admin-btn-accent w-full sm:w-auto">Edit</button>
                                <button onClick={async () => { await supabase.from("social_links").update({ is_active: !s.is_active }).eq("id", s.id); load(); }} className="admin-btn-sm bg-yellow-400 text-blue-950 hover:bg-yellow-300">{s.is_active ? "Hide" : "Show"}</button>
                                <button onClick={() => requestSocialDelete(s.id)} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white">Delete</button>
                            </div>
                        </div>
                    ))}
                    {socials.length === 0 && <EmptyState title="" className="p" />}
                </div>
            </div>

        </div>
    );
}