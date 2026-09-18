"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type Profile = {
    full_name?: string;
    avatar_url?: string;
    phone?: string;
    role?: string;
};

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        async function load() {
            const { data: authData } = await supabase.auth.getUser();
            const currentUser = authData.user;
            setUser(currentUser || null);

            if (currentUser) {
                const { data, error } = await supabase.from("profiles").select("*").eq("id", currentUser.id).single();
                if (!error) setProfile(data);
            }
        }

        load();
    }, []);

    if (!user) return <p className="text-gray-600">Not signed in.</p>;

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="max-w-3xl bg-white rounded-xl shadow p-6">
                <h2 className="text-2xl font-bold text-blue-950 mb-4">Profile</h2>

                <div className="flex items-center gap-4">
                    <img src={profile?.avatar_url || user.user_metadata?.avatar_url || "/public/icons/user.svg"} alt="avatar" className="w-20 h-20 rounded-full object-cover" />

                    <div>
                        <p className="text-lg font-semibold">{profile?.full_name || user.user_metadata?.full_name || user.email}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>

                <div className="mt-6 space-y-2">
                    <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p>{profile?.phone || "-"}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <p>{profile?.role || "Admin"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
