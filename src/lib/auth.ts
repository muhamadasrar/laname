// Simple auth helper for admin panel
// In production, use Supabase Auth or similar

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@laname.store";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "laname2026";
const AUTH_TOKEN = process.env.AUTH_TOKEN || "laname-admin-token-secret";

export function validateCredentials(email: string, password: string): boolean {
    return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export function validateToken(token: string): boolean {
    return token === AUTH_TOKEN;
}

export function getAuthToken(): string {
    return AUTH_TOKEN;
}
