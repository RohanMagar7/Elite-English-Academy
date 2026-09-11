"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });

    function change(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        alert("This demo login is not active in the local environment.");
    }

    return (
        <>
            <Navbar />

            <div className="min-h-screen flex items-center justify-center p-8 bg-blue-50">
                <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow">
                    <h1 className="text-2xl font-bold text-blue-900 mb-4">Admin Login</h1>
                    <form onSubmit={submit} className="space-y-4">
                        <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} className="w-full border p-3 rounded" />
                        <input name="password" type="password" placeholder="Password" value={form.password} onChange={change} className="w-full border p-3 rounded" />
                        <button className="w-full bg-blue-900 text-white p-3 rounded">Sign In</button>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    );
}

