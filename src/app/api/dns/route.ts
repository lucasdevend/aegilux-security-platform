import { NextResponse } from "next/server";
import dns from "dns/promises";

export async function GET(
        request: Request
    ) {
        const { searchParams } = new URL(request.url);

        const domain = searchParams.get("domain");

        if (!domain) {
            return NextResponse.json(
                { error: "Domain required" },
                { status: 400 }
            );
        }

        try {
            const result = await dns.lookup(domain);

            return NextResponse.json({
                domain,
                ip: result.address,
            });

        } catch {
            return NextResponse.json(
                { error: "DNS lookup failed" },
                { status: 500 }
            );
        }
}