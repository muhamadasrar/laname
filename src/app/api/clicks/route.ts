import { NextRequest, NextResponse } from "next/server";
import { incrementClick } from "@/lib/db";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { product_id } = body;

    if (!product_id) {
        return NextResponse.json({ error: "product_id is required" }, { status: 400 });
    }

    const newCount = incrementClick(product_id);
    return NextResponse.json({ clicks_count: newCount });
}
