import { NextRequest, NextResponse } from "next/server";
import { validateCredentials, getAuthToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    if (!validateCredentials(email, password)) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ token: getAuthToken() });
}
