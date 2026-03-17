import { NextRequest, NextResponse } from "next/server";
import { updateCategory, deleteCategory } from "@/lib/db";
import { validateToken } from "@/lib/auth";

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token || !validateToken(token)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const updated = updateCategory(params.id, body);
    if (!updated) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token || !validateToken(token)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleted = deleteCategory(params.id);
    if (!deleted) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
}
