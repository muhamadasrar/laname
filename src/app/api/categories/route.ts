import { NextRequest, NextResponse } from "next/server";
import { getCategories, addCategory } from "@/lib/db";
import { validateToken } from "@/lib/auth";

export async function GET() {
    const categories = getCategories();
    return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token || !validateToken(token)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug } = body;

    if (!name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const category = addCategory({
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    });

    return NextResponse.json(category, { status: 201 });
}
