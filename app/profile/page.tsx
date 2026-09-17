"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type ProfileRow = {
    avatar_url?: string | null;
    full_name?: string | null;
    phone?: string | null;
    role?: string | null;
};

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<ProfileRow | null>(null);

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
        <div className="bg-gray-100 p-4 sm:p-8 min-h-screen">
            <div className="max-w-3xl rounded-xl bg-white p-4 shadow sm:p-6">
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
