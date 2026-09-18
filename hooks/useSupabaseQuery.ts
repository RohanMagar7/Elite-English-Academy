"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Generic data-fetching hook for Supabase (and other promise-returning)
 * loaders. Standardizes the loading/error/data triad that every public
 * section previously re-implemented with inline `useEffect` + `try/catch`.
 *
 * @example
 * const { data, loading, error, refetch } = useSupabaseQuery(
 *   () => supabase.from("faqs").select("*").eq("is_active", true),
 *   { fallback: DEFAULT_FAQS },
 * );
 */
export function useSupabaseQuery<T>(
	fetcher: () => PromiseLike<{ data: T[] | null; error: { message: string } | null }>,
	options: {
		/** Initial value used while loading and on error (offline-safe). */
		fallback?: T[];
		/** Skip the query entirely (e.g. behind a condition). */
		enabled?: boolean;
	} = {},
) {
	const { fallback = [], enabled = true } = options;
	const [data, setData] = useState<T[]>(fallback);
	const [loading, setLoading] = useState(enabled);
	const [error, setError] = useState<string | null>(null);
	// Latest-value refs (updated in an effect, never during render) let the
	// fetch loop below stay referentially stable across renders.
	const fetcherRef = useRef(fetcher);
	const fallbackRef = useRef(fallback);

	useEffect(() => {
		fetcherRef.current = fetcher;
		fallbackRef.current = fallback;
	});

	const load = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const { data: rows, error: err } = await fetcherRef.current();
			if (err) throw new Error(err.message);
			setData(rows && rows.length > 0 ? rows : fallbackRef.current);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to load data.");
			setData(fallbackRef.current);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (enabled) void load();
	}, [enabled, load]);

	return { data, loading, error, refetch: load };
}
