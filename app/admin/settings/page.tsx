"use client";

import { useState } from "react";

export default function SettingsPage() {
    const [siteTitle, setSiteTitle] = useState("Elite English Academy");

    function save(e: React.FormEvent) {
        e.preventDefault();
        alert("Settings saved (demo). Replace with real settings persistence.");
    }

    return (
        <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Site Settings</h2>

            <form onSubmit={save} className="space-y-4 bg-white p-6 rounded-lg shadow">
                <input value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)} className="input-default" />
                <button className="btn-primary text-on-primary">Save Settings</button>
            </form>
        </div>
    );
}

