"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { loginIdSchema } from "@/lib/validation";

function LoginForm() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/admin";

    function change(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const rawIdentifier = form.email.trim();
        const rawPassword = form.password;
        // STRICT client check with the same rules the server enforces.
        if (!loginIdSchema.safeParse(rawIdentifier).success || typeof rawPassword !== "string" || rawPassword.length === 0 || rawPassword.length > 128) {
            setLoading(false);
            setError("Please enter a valid login id and password.");
            return;
        }

        // allow login by email or by admin login id/username
        let emailToUse = rawIdentifier;

        if (!emailToUse.includes("@")) {
            const idCheck = loginIdSchema.safeParse(emailToUse);
            if (!idCheck.success) {
                setLoading(false);
                setError("Unknown login id");
                return;
            }
            // try to look up admin email by login id in common admin table columns
            try {
                const { data: adminData, error: adminErr } = await supabase
                    .from("admins")
                    .select("email")
                    .or(`username.eq.${emailToUse},login.eq.${emailToUse},id.eq.${emailToUse}`)
                    .limit(1)
                    .maybeSingle();

                if (adminErr) {
                    // ignore and proceed to attempt sign-in using provided value as email
                } else if (adminData && (adminData as any).email) {
                    emailToUse = (adminData as any).email;
                } else {
                    setLoading(false);
                    setError("Unknown login id");
                    return;
                }
            } catch (err) {
                setLoading(false);
                setError("Unable to resolve login id");
                return;
            }
        }

        // Route through the server-side login API so the strict per-IP +
        // per-account rate limit with exponential backoff is enforced.
        // HTTP 429 responses carry a Retry-After header.
        let data: { error?: string };
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailToUse, password: form.password }),
            });
            data = await res.json();
            if (!res.ok) {
                if (res.status === 429) {
                    const retry = res.headers.get("Retry-After");
                    setError(data.error ?? "Too many attempts." + (retry ? ` Try again in ${retry}s.` : ""));
                } else {
                    setError(data.error ?? "Login failed");
                }
                setLoading(false);
                return;
            }
        } catch {
            setLoading(false);
            setError("Unable to reach the login service");
            return;
        }

        setLoading(false);

        // On successful sign in, navigate to the originally requested page (or /admin)
        router.push(redirectTo);
    }

    return (
        <>
            <Navbar />

            <div className="min-h-screen flex items-center justify-center p-8 bg-blue-50">
                <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow">
                    <h2 className="text-2xl font-bold text-blue-950 mb-4">Admin Login</h2>

                    {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-red-700">{error}</div>}

                    <form onSubmit={submit} className="space-y-4">
                        <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} className="w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" required />
                        <input name="password" type="password" placeholder="Password" value={form.password} onChange={change} className="w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" required />

                        <button type="submit" className="w-full bg-primary-dark text-on-primary p-3 rounded-lg font-semibold" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}