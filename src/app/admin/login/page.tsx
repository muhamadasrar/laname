"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login gagal");
                return;
            }

            localStorage.setItem("admin_token", data.token);
            router.push("/admin");
        } catch {
            setError("Terjadi kesalahan. Coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-admin-dark flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white">
                        Laname<span className="text-admin-accent">Admin</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Masuk ke panel admin</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg px-3 py-2">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@laname.store"
                                required
                                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-600 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent/30 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-600 focus:border-admin-accent focus:ring-1 focus:ring-admin-accent/30 outline-none transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-admin-accent text-white text-sm font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                        >
                            {loading ? "Memproses..." : "Masuk"}
                        </button>
                    </form>

                    <p className="text-center text-[10px] text-gray-600 mt-4">
                        Default: admin@laname.store / laname2026
                    </p>
                </div>
            </div>
        </div>
    );
}
