"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";

interface Product {
    id: string;
    title: string;
    slug: string;
    image_url: string;
    original_price: number;
    discount_price: number;
    affiliate_url: string;
    category_id: string;
    rating: number;
    sold_count: number;
    badge: string;
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

export default function CategoryPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch("/api/products").then((r) => r.json()),
            fetch("/api/categories").then((r) => r.json()),
        ])
            .then(([prods, cats]) => {
                if (Array.isArray(cats)) {
                    const cat = cats.find((c: Category) => c.slug === slug);
                    setCategory(cat || null);
                    if (cat && Array.isArray(prods)) {
                        setProducts(prods.filter((p: Product) => p.category_id === cat.id));
                    }
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [slug]);

    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return products;
        const q = searchQuery.toLowerCase();
        return products.filter((p) => p.title.toLowerCase().includes(q));
    }, [products, searchQuery]);

    return (
        <div className="min-h-screen bg-[#E5E7EB]">
            <div className="max-w-[480px] mx-auto bg-[#F5F5F5] min-h-screen shadow-xl">
                <Header />

                <main className="px-3 pt-4 pb-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                        <a href="/" className="hover:text-shopee">Home</a>
                        <span>/</span>
                        <span className="text-gray-600 font-medium">{category?.name || slug}</span>
                    </div>

                    {/* Search */}
                    <div className="mb-4">
                        <SearchBar onSearch={setSearchQuery} placeholder={`Cari di ${category?.name || "kategori"}...`} />
                    </div>

                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-3">
                        <h1 className="text-base font-bold text-[#222]">
                            {category?.name || "Kategori"}
                        </h1>
                        <span className="text-xs text-shopee font-medium">
                            {filteredProducts.length} produk
                        </span>
                    </div>

                    {/* Product Grid */}
                    {loading ? (
                        <div className="grid grid-cols-2 gap-2.5">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                                    <div className="aspect-square img-shimmer" />
                                    <div className="p-3 space-y-2">
                                        <div className="h-3 bg-gray-200 rounded w-full" />
                                        <div className="h-3 bg-gray-200 rounded w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-sm">Belum ada produk di kategori ini.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2.5">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} {...product} />
                            ))}
                        </div>
                    )}
                </main>

                <Footer />
            </div>
        </div>
    );
}
