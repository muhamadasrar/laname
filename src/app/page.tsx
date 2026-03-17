"use client";

import { useState, useEffect, useMemo } from "react";
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

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ])
      .then(([prods, cats]) => {
        if (Array.isArray(prods)) setProducts(prods);
        if (Array.isArray(cats)) setCategories(cats);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (selectedCategory) {
      result = result.filter((p) => p.category_id === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q));
    }
    return result;
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#E5E7EB]">
      <div className="max-w-[480px] mx-auto bg-[#F5F5F5] min-h-screen shadow-xl">
        <Header />

        <main className="px-3 pt-4 pb-6">
          {/* Search */}
          <div className="mb-4">
            <SearchBar onSearch={setSearchQuery} placeholder="Cari produk di Gudang Diskon..." />
          </div>

          {/* Category Pills */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory("")}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${!selectedCategory
                  ? "bg-shopee text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-shopee hover:text-shopee"
                }`}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCategory === cat.id
                    ? "bg-shopee text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-shopee hover:text-shopee"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Section Header */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-[#222]">
              {selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.name || "Produk"
                : "Rekomendasi Hari Ini"}
            </h2>
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
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">Tidak ada produk ditemukan.</p>
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
