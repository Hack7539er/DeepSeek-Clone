import { NextResponse } from "next/server";

export async function POST(request) {
    console.log("🔥 CLERK WEBHOOK HIT");

    const body = await request.text();

    console.log("📦 BODY:", body);

    return NextResponse.json({
        success: true,
        message: "Webhook reached Next.js",
    });
}
