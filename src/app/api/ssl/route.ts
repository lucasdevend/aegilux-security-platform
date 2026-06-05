import { NextRequest, NextResponse } from "next/server";
import { getSSLInfo } from "@/lib/ssl";

export async function GET(
    request: NextRequest
) {
    const domain =
        request.nextUrl.searchParams.get("domain");

    if (!domain) {
        return NextResponse.json(
            { error: "Domain required" },
            { status: 400 }
        );
    }

    try {

        const ssl =
            await getSSLInfo(domain);

        return NextResponse.json(ssl);

    } catch {

        return NextResponse.json(
            {
                valid: false,
                issuer: "Unknown",
                validTo: "Unknown",
            }
        );
    }
}