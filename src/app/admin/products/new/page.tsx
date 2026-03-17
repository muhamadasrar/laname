"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Category {
    id: string;
    name: string;
    slug: string;
}

export default function NewProductPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        title: "",
        image_url: "",
        category_id: "",
        original_price: "",
        discount_price: "",
        affiliate_url: "",
        rating: "4.8",
        sold_count: "0",
        badge: "",
    });

    useEffect(() => {
        fetch("/api/categories")
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data)) setCategories(data);
            })
            .catch(() => { });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...form,
                    original_price: Number(form.original_price),
                    discount_price: Number(form.discount_price),
                    rating: Number(form.rating),
                    sold_count: Number(form.sold_count),
                    is_active: true,
                }),
            });

            if (res.ok) {
                router.push("/admin/products");
            } else {
                const data = await res.json();
                alert(data.error || "Gagal menyimpan produk");
            }
        } catch {
            alert("Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl">
            <h1 className="text-xl font-bold text-gray-800 mb-1">Tambah Produk Baru</h1>
            <div className="h-1 w-16 bg-gradient-to-r from-shopee to-shopee-light rounded-full mb-6" />

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                {/* Nama Produk */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Nama Produk (SEO Friendly)
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Contoh: Sepatu Sneakers Pria Kasual..."
                        required
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-admin-accent focus:ring-1 focus:ring-admin-accent/30 outline-none"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Gunakan nama yang menarik agar pengunjung mau klik.</p>
                </div>

                {/* URL Gambar */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        URL Gambar Produk
                    </label>
                    <input
                        type="url"
                        name="image_url"
                        value={form.image_url}
                        onChange={handleChange}
                        placeholder="https://cf.shopee.co.id/file/..."
                        required
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-admin-accent focus:ring-1 focus:ring-admin-accent/30 outline-none"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Copy Image Address dari Shopee dan paste di sini (hemat storage).</p>
                </div>

                {/* Kategori */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kategori</label>
                    <select
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-admin-accent focus:ring-1 focus:ring-admin-accent/30 outline-none bg-white"
                    >
                        <option value="">Pilih Kategori</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* Harga */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Harga Asli (Coret)
                        </label>
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-admin-accent focus-within:ring-1 focus-within:ring-admin-accent/30">
                            <span className="px-3 py-2.5 bg-gray-50 text-sm text-gray-500 border-r border-gray-200">Rp</span>
                            <input
                                type="number"
                                name="original_price"
                                value={form.original_price}
                                onChange={handleChange}
                                placeholder="250000"
                                required
                                className="flex-1 px-3 py-2.5 text-sm outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Harga Diskon (Tampil)
                        </label>
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-admin-accent focus-within:ring-1 focus-within:ring-admin-accent/30">
                            <span className="px-3 py-2.5 bg-gray-50 text-sm text-gray-500 border-r border-gray-200">Rp</span>
                            <input
                                type="number"
                                name="discount_price"
                                value={form.discount_price}
                                onChange={handleChange}
                                placeholder="99000"
                                required
                                className="flex-1 px-3 py-2.5 text-sm outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Rating & Terjual */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rating</label>
                        <input
                            type="number"
                            name="rating"
                            value={form.rating}
                            onChange={handleChange}
                            step="0.1"
                            min="0"
                            max="5"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-admin-accent focus:ring-1 focus:ring-admin-accent/30 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jumlah Terjual</label>
                        <input
                            type="number"
                            name="sold_count"
                            value={form.sold_count}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-admin-accent focus:ring-1 focus:ring-admin-accent/30 outline-none"
                        />
                    </div>
                </div>

                {/* Link Affiliate */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Link Affiliate Shopee
                    </label>
                    <input
                        type="url"
                        name="affiliate_url"
                        value={form.affiliate_url}
                        onChange={handleChange}
                        placeholder="https://shope.ee/..."
                        required
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-admin-accent focus:ring-1 focus:ring-admin-accent/30 outline-none"
                    />
                </div>

                {/* Badge */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Badge (Opsional)
                    </label>
                    <input
                        type="text"
                        name="badge"
                        value={form.badge}
                        onChange={handleChange}
                        placeholder="Contoh: Diskon 60%, Flash Sale, Best Seller"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-admin-accent focus:ring-1 focus:ring-admin-accent/30 outline-none"
                    />
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 pt-4 flex items-center gap-3 justify-end">
                    <button
                        type="button"
                        onClick={() => router.push("/admin/products")}
                        className="px-4 py-2 text-sm text-gray-500 font-medium hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-shopee text-white text-sm font-semibold rounded-lg hover:bg-shopee-light disabled:opacity-50 transition-colors"
                    >
                        {loading ? "Menyimpan..." : "Simpan & Publish"}
                    </button>
                </div>
            </form>
        </div>
    );
}
