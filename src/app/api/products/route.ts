import { NextRequest, NextResponse } from "next/server";
import { getProducts, addProduct, getAllProducts } from "@/lib/db";
import { validateToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("category_id") || undefined;
    const all = searchParams.get("all");

    const products = all === "true" ? getAllProducts() : getProducts(categoryId);
    return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token || !validateToken(token)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, image_url, original_price, discount_price, affiliate_url, category_id, rating, sold_count, badge, is_active } = body;

    if (!title || !image_url || !affiliate_url) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = addProduct({
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        image_url,
        original_price: Number(original_price) || 0,
        discount_price: Number(discount_price) || 0,
        affiliate_url,
        category_id: category_id || "",
        rating: Number(rating) || 0,
        sold_count: Number(sold_count) || 0,
        badge: badge || "",
        is_active: is_active !== false,
    });

    return NextResponse.json(product, { status: 201 });
}
