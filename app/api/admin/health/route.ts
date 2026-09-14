import { requireAdminApi } from "@/lib/api-auth";
import { NextResponse } from "next/server";

export async function GET() {
    const { user, response } = await requireAdminApi();

    if (response) {
        return response;
    }

    return NextResponse.json({
        ok: true,
        message: "Admin API is secure and working.",
        user: {
            id: user.id,
            email: user.email,
        },
    });
}