"use client";

/**
 * Skeleton loading primitives (premium shimmer).
 * Aria-compliant: parent should set aria-busy="true" while loading.
 */
export function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div
            aria-hidden="true"
            className={`animate-pulse rounded-xl bg-slate-200/80 dark:bg-white/10 ${className}`}
        />
    );
}

export function CardSkeleton() {
    return (
        <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white dark:border-white/10 dark:bg-[#101737]">
            <Skeleton className="aspect-[16/9] w-full rounded-none" />
            <div className="space-y-2.5 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-full" />
                <div className="flex gap-2 pt-1">
                    <Skeleton className="h-9 flex-1" />
                    <Skeleton className="h-9 flex-1" />
                </div>
            </div>
        </div>
    );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Loading content">
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}

export function RowSkeleton() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-white/10 dark:bg-[#101737]">
            <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-1/3" />
                    <Skeleton className="h-3 w-2/3" />
                </div>
            </div>
        </div>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-white/10 dark:bg-[#101737]">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-7 w-1/3" />
                </div>
                <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
        </div>
    );
}
