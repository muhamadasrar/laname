"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

function formatPrice(price: number): string {
    return new Intl.NumberFormat("id-ID").format(price);
}

function formatSold(count: number): string {
    if (count >= 1000) {
        return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}rb+`;
    }
    return `${count}+`;
}

function getDiscountPercent(original: number, discount: number): number {
    if (original <= 0) return 0;
    return Math.round(((original - discount) / original) * 100);
}

export default function ProductDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [imgLoaded, setImgLoaded] = useState(false);

    useEffect(() => {
        fetch("/api/products")
            .then((r) => r.json())
            .then((prods) => {
                if (Array.isArray(prods)) {
                    const found = prods.find((p: Product) => p.slug === slug);
                    setProduct(found || null);
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [slug]);

    // Fire ViewContent pixel
    useEffect(() => {
        if (product && typeof window !== "undefined" && ((window as unknown) as { fbq: (...args: unknown[]) => void }).fbq) {
            ((window as unknown) as { fbq: (...args: unknown[]) => void }).fbq("track", "ViewContent", {
                content_name: product.title,
                value: product.discount_price,
                currency: "IDR",
            });
        }
    }, [product]);

    const handleBuyClick = async () => {
        if (!product) return;

        // Track click
        try {
            fetch("/api/clicks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product_id: product.id }),
            });
        } catch { }

        // Fire InitiateCheckout
        try {
            if (typeof window !== "undefined" && ((window as unknown) as { fbq: (...args: unknown[]) => void }).fbq) {
                ((window as unknown) as { fbq: (...args: unknown[]) => void }).fbq("track", "InitiateCheckout", {
                    content_name: product.title,
                    value: product.discount_price,
                    currency: "IDR",
                });
            }
        } catch { }

        await new Promise((r) => setTimeout(r, 300));
        window.open(product.affiliate_url, "_blank");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#E5E7EB]">
                <div className="max-w-[480px] mx-auto bg-[#F5F5F5] min-h-screen shadow-xl">
                    <Header />
                    <div className="p-4 space-y-4">
                        <div className="aspect-square img-shimmer rounded-lg" />
                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                        <div className="h-8 bg-gray-200 rounded w-1/2" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#E5E7EB]">
                <div className="max-w-[480px] mx-auto bg-[#F5F5F5] min-h-screen shadow-xl">
                    <Header />
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg mb-2">😕</p>
                        <p className="text-gray-500 text-sm">Produk tidak ditemukan.</p>
                        <a href="/" className="text-shopee text-sm font-medium mt-4 inline-block hover:underline">
                            ← Kembali ke Home
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const discountPercent = getDiscountPercent(product.original_price, product.discount_price);

    return (
        <div className="min-h-screen bg-[#E5E7EB]">
            <div className="max-w-[480px] mx-auto bg-[#F5F5F5] min-h-screen shadow-xl">
                <Header />

                {/* Back nav */}
                <div className="px-4 py-2 bg-white border-b border-gray-100">
                    <a href="/" className="text-xs text-gray-400 hover:text-shopee flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali
                    </a>
                </div>

                {/* Product Image */}
                <div className="relative bg-white">
                    <div className="aspect-square relative overflow-hidden">
                        {!imgLoaded && <div className="absolute inset-0 img-shimmer" />}
                        <img
                            src={product.image_url}
                            alt={product.title}
                            onLoad={() => setImgLoaded(true)}
                            className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"
                                }`}
                        />
                    </div>

                    {/* Badge */}
                    {product.badge && (
                        <span className="absolute top-3 left-3 bg-gradient-to-r from-shopee-dark to-shopee text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-lg">
                            {product.badge}
                        </span>
                    )}
                </div>

                {/* Product Info */}
                <div className="bg-white px-4 py-4 border-t border-gray-50">
                    {/* Price section */}
                    <div className="bg-gradient-to-r from-shopee/5 to-shopee-light/5 rounded-lg p-3 mb-3">
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-extrabold text-shopee">
                                Rp {formatPrice(product.discount_price)}
                            </span>
                            {discountPercent > 0 && (
                                <span className="bg-shopee text-white text-xs font-bold px-2 py-0.5 rounded mb-1">
                                    -{discountPercent}%
                                </span>
                            )}
                        </div>
                        {product.original_price > product.discount_price && (
                            <p className="text-sm text-gray-400 line-through mt-0.5">
                                Rp {formatPrice(product.original_price)}
                            </p>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-sm font-semibold text-[#222] leading-5 mb-3">
                        {product.title}
                    </h1>

                    {/* Rating & Sold */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                            <span className="font-semibold text-gray-700">{product.rating}</span>
                        </span>
                        <span className="text-gray-300">|</span>
                        <span>Terjual {formatSold(product.sold_count)}</span>
                    </div>

                    {/* Info badges */}
                    <div className="flex gap-2 mb-4">
                        <div className="flex items-center gap-1.5 bg-gray-50 rounded-md px-2.5 py-1.5">
                            <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-[10px] text-gray-600 font-medium">100% Original</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 rounded-md px-2.5 py-1.5">
                            <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span className="text-[10px] text-gray-600 font-medium">Belanja Aman</span>
                        </div>
                    </div>
                </div>

                {/* Sticky CTA */}
                <div className="sticky bottom-0 bg-white border-t border-gray-100 p-3 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
                    <button
                        onClick={handleBuyClick}
                        className="w-full py-3.5 bg-gradient-to-r from-shopee to-shopee-light text-white font-bold text-sm rounded-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Beli di Shopee
                    </button>
                </div>

                <Footer />
            </div>
        </div>
    );
}
