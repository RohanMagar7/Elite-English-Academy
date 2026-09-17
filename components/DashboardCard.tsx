import { ReactNode } from "react";

interface DashboardCardProps {
    title: string;
    value: string;
    icon: ReactNode;
}

export default function DashboardCard({ title, value, icon }: DashboardCardProps) {
    return (
        <div className="group relative flex min-h-24 items-center justify-between gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-blue/25 hover:shadow-lg hover:shadow-brand-blue/10 sm:p-5 dark:border-white/10 dark:bg-[#101737] dark:hover:border-brand-gold/25">
            <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-slate-600 sm:text-sm dark:text-slate-400">{title}</p>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">{value}</h2>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue/10 to-brand-gold/15 text-brand-blue transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14 [&_svg]:h-6 [&_svg]:w-6 sm:[&_svg]:h-8 sm:[&_svg]:w-8 dark:from-blue-400/15 dark:to-brand-gold/10 dark:text-blue-300">
                {icon}
            </div>
        </div>
    );
}
