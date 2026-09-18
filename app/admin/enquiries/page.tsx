/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { safeClientMessage } from "@/lib/client-errors";
import { useConfirmDelete } from "@/hooks/useConfirmDelete";
import { TableHead, TableBody, TableRow, Th, Td, Pagination } from "@/components/ui";
import { PAGE_SIZE } from "@/lib/constants";

interface Enquiry {
    id: string;
    full_name: string;
    phone: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    created_at: string;
}

const STATUSES = ["New", "Contacted", "Closed"];

function formatDateTime(value: string) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function EnquiriesPage() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("All");
    const [selected, setSelected] = useState<Enquiry | null>(null);

    async function getEnquiries() {
        setLoading(true);
        const { data } = await supabase
            .from("enquiries")
            .select("*")
            .order("created_at", { ascending: false });
        setEnquiries(data || []);
        setLoading(false);
    }

    useEffect(() => {
        getEnquiries();
        const channel = supabase
            .channel("admin-enquiries")
            .on("postgres_changes", { event: "*", schema: "public", table: "enquiries" }, () => {
                getEnquiries();
            })
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    useEffect(() => {
        if (!selected) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelected(null);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [selected]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return enquiries.filter((enquiry) => {
            const matchesStatus = statusFilter === "All" || enquiry.status === statusFilter;
            if (!matchesStatus) return false;
            if (!q) return true;
            return [enquiry.full_name, enquiry.phone, enquiry.email, enquiry.subject]
                .filter(Boolean)
                .some((field) => field.toLowerCase().includes(q));
        });
    }, [enquiries, search, statusFilter]);

    // Client-side pagination over the filtered rows (no extra fetches).
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const pagedEnquiries = filtered.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE,
    );

    async function updateStatus(id: string, status: string) {
        const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
        if (error) {
            alert(safeClientMessage(error, "Save failed. Please try again."));
            return;
        }
        setEnquiries((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
        setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
    }

    const { requestDelete, dialog } = useConfirmDelete<string>(
        async (id) => {
        const { error } = await supabase.from("enquiries").delete().eq("id", id);
        if (error) {
            alert(safeClientMessage(error, "Save failed. Please try again."));
            return;
        }
        setEnquiries((prev) => prev.filter((item) => item.id !== id));
        setSelected((prev) => (prev && prev.id === id ? null : prev));
        },
        "Delete this enquiry?",
    );
    return (
        <div className="admin-page">
            {dialog}
            <div className="admin-header-row">
                <div className="min-w-0">
                    <h1 className="admin-page-title">Enquiries</h1>
                    <p className="admin-page-sub">Messages submitted from the contact form, newest first.</p>
                </div>
                <span className="admin-badge admin-badge-gray shrink-0">
                    {filtered.length} of {enquiries.length}
                </span>
            </div>
            <div className="admin-card">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, phone, email, or subject..."
                        className="input-default"
                        aria-label="Search enquiries"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input-default sm:w-44"
                        aria-label="Filter by status"
                    >
                        <option value="All">All statuses</option>
                        {STATUSES.map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="admin-table-wrap">
                <table className="admin-table">
                    <TableHead>
                        <tr>
                            <Th>Name</Th>
                            <Th>Contact</Th>
                            <Th>Subject</Th>
                            <Th>Submitted</Th>
                            <Th>Status</Th>
                            <Th className="admin-tcenter">Actions</Th>
                        </tr>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <Td colSpan={6} className="p-6 text-center text-slate-600">Loading enquiries...</Td>
                            </TableRow>
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <Td colSpan={6} className="p-6 text-center text-slate-600">No enquiries found.</Td>
                            </TableRow>
                        ) : (
                            pagedEnquiries.map((enquiry) => (
                                <TableRow key={enquiry.id}>
                                    <Td>
                                        <div className="admin-cell-main">{enquiry.full_name}</div>
                                        <div className="admin-cell-sub">{enquiry.email}</div>
                                    </Td>
                                    <Td>{enquiry.phone}</Td>
                                    <Td><span className="line-clamp-2 max-w-52">{enquiry.subject}</span></Td>
                                    <Td className="whitespace-nowrap">{formatDateTime(enquiry.created_at)}</Td>
                                    <Td>
                                        <select
                                            value={enquiry.status}
                                            onChange={(e) => updateStatus(enquiry.id, e.target.value)}
                                            className="admin-select"
                                            aria-label="Status"
                                        >
                                            {STATUSES.map((status) => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </Td>
                                    <Td>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            <button onClick={() => setSelected(enquiry)} className="admin-btn-sm bg-blue-950 text-white hover:bg-blue-900">View</button>
                                            <button onClick={() => requestDelete(enquiry.id)} className="admin-btn-danger">Delete</button>
                                        </div>
                                    </Td>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </table>
            </div>
            <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
            {selected && (
                <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Enquiry details">
                    <div className="absolute inset-0 bg-blue-950/60" onClick={() => setSelected(null)} aria-hidden="true" />
                    <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl">
                        <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-5">
                            <div className="min-w-0">
                                <h2 className="truncate text-lg font-bold text-slate-900">{selected.full_name}</h2>
                                <p className="mt-0.5 text-sm text-slate-600">Submitted {formatDateTime(selected.created_at)}</p>
                            </div>
                            <button onClick={() => setSelected(null)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" aria-label="Close enquiry details">X</button>
                        </div>
                        <div className="flex-1 space-y-4 overflow-y-auto p-5">
                            <div>
                                <p className="admin-label">Status</p>
                                <select value={selected.status} onChange={(e) => updateStatus(selected.id, e.target.value)} className="input-default">
                                    {STATUSES.map((status) => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <p className="admin-label">Phone</p>
                                <a href={"tel:" + selected.phone} className="text-sm font-medium text-blue-700 hover:underline">{selected.phone}</a>
                            </div>
                            <div>
                                <p className="admin-label">Email</p>
                                <a href={"mailto:" + selected.email} className="break-all text-sm font-medium text-blue-700 hover:underline">{selected.email}</a>
                            </div>
                            <div>
                                <p className="admin-label">Subject</p>
                                <p className="text-sm leading-6 text-slate-800">{selected.subject}</p>
                            </div>
                            <div>
                                <p className="admin-label">Message</p>
                                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-800">{selected.message}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2.5 border-t border-slate-200 p-5 sm:flex-row">
                            <button onClick={() => setSelected(null)} className="admin-btn-accent flex-1">Close</button>
                            <button onClick={() => requestDelete(selected.id)} className="admin-btn-danger flex-1">Delete enquiry</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
