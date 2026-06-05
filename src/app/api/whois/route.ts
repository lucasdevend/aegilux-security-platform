import { NextRequest, NextResponse } from "next/server";
import { getWhoisData } from "@/lib/whois";

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

    const whois = await getWhoisData(domain);

        return NextResponse.json({
        domain,
        ...whois,
    });
}