"use client";

import { useState, useEffect } from "react";

interface Product {
    id: string;
    title: string;
    image_url: string;
    clicks_count: number;
    discount_price: number;
    is_active: boolean;
}

interface Category {
    id: string;
    name: string;
}

const RANK_BADGES = ["🥇", "🥈", "🥉"];

function formatPrice(price: number): string {
    return new Intl.NumberFormat("id-ID").format(price);
}

export default function AdminDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch("/api/products?all=true").then((r) => r.json()),
            fetch("/api/categories").then((r) => r.json()),
        ])
            .then(([prods, cats]) => {
                if (Array.isArray(prods)) setProducts(prods);
                if (Array.isArray(cats)) setCategories(cats);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const totalClicks = products.reduce((sum, p) => sum + p.clicks_count, 0);
    const activeProducts = products.filter((p) => p.is_active).length;
    const topProducts = [...products].sort((a, b) => b.clicks_count - a.clicks_count).slice(0, 10);

    const stats = [
        {
            label: "Total Produk",
            value: products.length,
            icon: "📦",
            color: "from-blue-500 to-blue-600",
        },
        {
            label: "Produk Aktif",
            value: activeProducts,
            icon: "✅",
            color: "from-green-500 to-green-600",
        },
        {
            label: "Kategori",
            value: categories.length,
            icon: "🏷️",
            color: "from-purple-500 to-purple-600",
        },
        {
            label: "Total Klik",
            value: totalClicks,
            icon: "👆",
            color: "from-orange-500 to-orange-600",
        },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 h-24 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r ${stat.color} text-white`}>
                                {stat.value}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                        <p className="text-xl font-bold text-gray-800 mt-0.5">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-sm font-bold text-gray-800">Top 10 Produk (Klik Terbanyak)</h2>
                </div>

                {topProducts.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-400">
                        Belum ada data produk.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {topProducts.map((product, idx) => (
                            <div key={product.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                                {/* Rank */}
                                <span className="w-8 text-center text-sm font-bold">
                                    {idx < 3 ? RANK_BADGES[idx] : (
                                        <span className="text-gray-400">{idx + 1}</span>
                                    )}
                                </span>

                                {/* Image */}
                                <img
                                    src={product.image_url}
                                    alt={product.title}
                                    className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                                />

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-700 truncate">{product.title}</p>
                                    <p className="text-[10px] text-gray-400">Rp {formatPrice(product.discount_price)}</p>
                                </div>

                                {/* Clicks */}
                                <div className="flex items-center gap-1 bg-blue-50 text-blue-600 rounded-full px-2.5 py-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <span className="text-[10px] font-bold">{product.clicks_count}</span>
                                </div>

                                {/* Status */}
                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${product.is_active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
                                    }`}>
                                    {product.is_active ? "Aktif" : "Nonaktif"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
