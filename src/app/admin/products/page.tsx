"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
    id: string;
    title: string;
    slug: string;
    image_url: string;
    original_price: number;
    discount_price: number;
    affiliate_url: string;
    category_id: string;
    clicks_count: number;
    is_active: boolean;
}

interface Category {
    id: string;
    name: string;
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat("id-ID").format(price);
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchData = () => {
        setLoading(true);
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
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getCategoryName = (id: string) => {
        return categories.find((c) => c.id === id)?.name || "-";
    };

    const handleToggle = async (product: Product) => {
        const token = localStorage.getItem("admin_token");
        await fetch(`/api/products/${product.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ is_active: !product.is_active }),
        });
        fetchData();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Hapus produk ini?")) return;
        const token = localStorage.getItem("admin_token");
        await fetch(`/api/products/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchData();
    };

    const filtered = products.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-800">Produk</h1>
                <Link
                    href="/admin/products/new"
                    className="bg-admin-accent text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1.5"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Produk
                </Link>
            </div>

            {/* Search */}
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari produk..."
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-admin-accent focus:ring-1 focus:ring-admin-accent/30 outline-none"
            />

            {/* Product List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-sm text-gray-400">Memuat...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-400">
                        {search ? "Tidak ada produk ditemukan." : "Belum ada produk. Tambah produk pertama!"}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {filtered.map((product) => (
                            <div key={product.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                                <img
                                    src={product.image_url}
                                    alt={product.title}
                                    className="w-12 h-12 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                                />

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{product.title}</p>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                                        <span>{getCategoryName(product.category_id)}</span>
                                        <span>·</span>
                                        <span>Rp {formatPrice(product.discount_price)}</span>
                                        <span>·</span>
                                        <span>{product.clicks_count} klik</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {/* Toggle */}
                                    <button
                                        onClick={() => handleToggle(product)}
                                        className={`text-[10px] font-medium px-2 py-1 rounded-full ${product.is_active
                                                ? "bg-green-50 text-green-600 hover:bg-green-100"
                                                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                            }`}
                                    >
                                        {product.is_active ? "Aktif" : "Off"}
                                    </button>

                                    {/* Edit */}
                                    <Link
                                        href={`/admin/products/${product.id}/edit`}
                                        className="text-gray-400 hover:text-admin-accent p-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </Link>

                                    {/* Delete */}
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="text-gray-400 hover:text-red-500 p-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
