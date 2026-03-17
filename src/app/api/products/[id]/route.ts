import { NextRequest, NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct } from "@/lib/db";
import { validateToken } from "@/lib/auth";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const product = getProductById(params.id);
    if (!product) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(product);
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token || !validateToken(token)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const updated = updateProduct(params.id, body);
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

    const deleted = deleteProduct(params.id);
    if (!deleted) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
}
