/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

/**
 * Typed fetch wrapper for the app's own API routes.
 *
 * Guarantees:
 * - Always parses JSON (or throws a normalized ApiError).
 * - Surfaces only user-safe error messages (the API already curates them;
 *   anything unexpected falls back to a generic message).
 * - No credentials/headers bookkeeping at call sites.
 */

const GENERIC_ERROR = "Something went wrong. Please try again.";

export class ApiError extends Error {
	readonly status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
}

type ApiResult<T> = T;

interface RequestOptions extends Omit<RequestInit, "body"> {
	body?: unknown;
	/** AbortSignal.timeout() ms budget; 15s covers most form submissions. */
	timeoutMs?: number;
}

export async function apiFetch<T = unknown>(
	url: string,
	options: RequestOptions = {},
): Promise<ApiResult<T>> {
	const { body, timeoutMs = 15_000, headers, ...rest } = options;

	let response: Response;
	try {
		response = await fetch(url, {
			...rest,
			headers: {
				...(body !== undefined ? { "Content-Type": "application/json" } : {}),
				...headers,
			},
			body: body !== undefined ? JSON.stringify(body) : undefined,
			signal: rest.signal ?? AbortSignal.timeout(timeoutMs),
		});
	} catch (err) {
		if (err instanceof DOMException && err.name === "TimeoutError") {
			throw new ApiError("The request timed out. Please try again.", 408);
		}
		throw new ApiError("Network error. Please check your connection.", 0);
	}

	const payload: unknown = await response.json().catch(() => null);

	if (!response.ok) {
		const message =
			typeof payload === "object" &&
			payload !== null &&
			"error" in payload &&
			typeof (payload as { error: unknown }).error === "string"
				? (payload as { error: string }).error
				: GENERIC_ERROR;
		throw new ApiError(message, response.status);
	}

	return payload as ApiResult<T>;
}
