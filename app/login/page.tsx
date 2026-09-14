"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

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

        // allow login by email or by admin login id/username
        let emailToUse = form.email;

        if (!emailToUse.includes("@")) {
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

        const { data, error } = await supabase.auth.signInWithPassword({
            email: emailToUse,
            password: form.password,
        });

        setLoading(false);

        if (error) {
            setError(error.message);
            return;
        }

        // On successful sign in, navigate to the originally requested page (or /admin)
        router.push(redirectTo);
    }

    return (
        <>
            <Navbar />

            <div className="min-h-screen flex items-center justify-center p-8 bg-blue-50">
                <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow">
                    <h1 className="text-2xl font-bold text-blue-900 mb-4">Admin Login</h1>

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