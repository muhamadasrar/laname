"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface Category { id: string; name: string; slug: string; }

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        title: "", image_url: "", category_id: "", original_price: "",
        discount_price: "", affiliate_url: "", rating: "", sold_count: "",
        badge: "", is_active: true,
    });

    useEffect(() => {
        Promise.all([
            fetch(`/api/products/${productId}`).then((r) => r.json()),
            fetch("/api/categories").then((r) => r.json()),
        ]).then(([product, cats]) => {
            if (product && !product.error) {
                setForm({
                    title: product.title || "", image_url: product.image_url || "",
                    category_id: product.category_id || "",
                    original_price: String(product.original_price || ""),
                    discount_price: String(product.discount_price || ""),
                    affiliate_url: product.affiliate_url || "",
                    rating: String(product.rating || ""), sold_count: String(product.sold_count || ""),
                    badge: product.badge || "", is_active: product.is_active !== false,
                });
            }
            if (Array.isArray(cats)) setCategories(cats);
        }).catch(() => { }).finally(() => setLoading(false));
    }, [productId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
        else setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const token = localStorage.getItem("admin_token");
        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    ...form,
                    slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                    original_price: Number(form.original_price), discount_price: Number(form.discount_price),
                    rating: Number(form.rating), sold_count: Number(form.sold_count),
                }),
            });
            if (res.ok) router.push("/admin/products");
            else { const data = await res.json(); alert(data.error || "Gagal menyimpan"); }
        } catch { alert("Terjadi kesalahan"); } finally { setSaving(false); }
    };

    if (loading) return (
        <div className="max-w-xl">
            <h1 className="text-xl font-bold text-gray-800 mb-6">Edit Produk</h1>
            <div className="bg-white rounded-2xl p-6 animate-pulse space-y-4">
                {[...Array(6)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-lg" />)}
            </div>
        </div>
    );

    return (
        <div className="max-w-xl">
            <h1 className="text-xl font-bold text-gray-800 mb-1">Edit Produk</h1>
            <div className="h-1 w-16 bg-gradient-to-r from-admin-accent to-blue-400 rounded-full mb-6" />
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-300 peer-focus:ring-2 peer-focus:ring-admin-accent/30 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-admin-accent" />
                    </label>
                    <span className="text-sm text-gray-600 font-medium">{form.is_active ? "Produk Aktif" : "Produk Nonaktif"}</span>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Produk</label>
                    <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-admin-accent focus:ring-1 focus:ring-admin-accent/30 outline-none" />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">URL Gambar</label>
                    <input type="url" name="image_url" value={form.image_url} onChange={handleChange} required className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-admin-accent focus:ring-1 focus:ring-admin-accent/30 outline-none" />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kategori</label>
                    <select name="category_id" value={form.category_id} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-admin-accent outline-none bg-white">
                        <option value="">Pilih Kategori</option>
                        {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Harga Asli</label>
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <span className="px-3 py-2.5 bg-gray-50 text-sm text-gray-500 border-r">Rp</span>
                            <input type="number" name="original_price" value={form.original_price} onChange={handleChange} required className="flex-1 px-3 py-2.5 text-sm outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Harga Diskon</label>
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <span className="px-3 py-2.5 bg-gray-50 text-sm text-gray-500 border-r">Rp</span>
                            <input type="number" name="discount_price" value={form.discount_price} onChange={handleChange} required className="flex-1 px-3 py-2.5 text-sm outline-none" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rating</label>
                        <input type="number" name="rating" value={form.rating} onChange={handleChange} step="0.1" min="0" max="5" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Terjual</label>
                        <input type="number" name="sold_count" value={form.sold_count} onChange={handleChange} min="0" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Link Affiliate</label>
                    <input type="url" name="affiliate_url" value={form.affiliate_url} onChange={handleChange} required className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none" />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Badge</label>
                    <input type="text" name="badge" value={form.badge} onChange={handleChange} placeholder="Diskon 60%, Flash Sale, dll" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none" />
                </div>

                <div className="border-t border-gray-100 pt-4 flex items-center gap-3 justify-end">
                    <button type="button" onClick={() => router.push("/admin/products")} className="px-4 py-2 text-sm text-gray-500 font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Batal</button>
                    <button type="submit" disabled={saving} className="px-6 py-2 bg-admin-accent text-white text-sm font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors">
                        {saving ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </div>
            </form>
        </div>
    );
}
