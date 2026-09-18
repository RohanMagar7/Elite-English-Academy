/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

import { ReactNode } from "react";

interface DashboardCardProps {
    title: string;
    value: string;
    icon: ReactNode;
}

export default function DashboardCard({ title, value, icon }: DashboardCardProps) {
    return (
        <div className="flex min-h-24 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
            <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-slate-600 sm:text-sm">{title}</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{value}</h2>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-950/5 text-blue-950 sm:h-14 sm:w-14 [&_svg]:h-6 [&_svg]:w-6 sm:[&_svg]:h-8 sm:[&_svg]:w-8">{icon}</div>
        </div>
    );
}