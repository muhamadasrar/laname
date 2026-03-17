"use client";

import { useState } from "react";
import Link from "next/link";

interface ProductCardProps {
    id: string;
    title: string;
    slug: string;
    image_url: string;
    original_price: number;
    discount_price: number;
    affiliate_url: string;
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


export default function ProductCard({
    id,
    title,
    slug,
    image_url,
    original_price,
    discount_price,
    affiliate_url,
    rating,
    sold_count,
    badge,
}: ProductCardProps) {
    const [imgLoaded, setImgLoaded] = useState(false);

    const handleBuyClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Track click
        try {
            fetch("/api/clicks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product_id: id }),
            });
        } catch { }

        // Fire Meta Pixel InitiateCheckout
        try {
            if (typeof window !== "undefined" && ((window as unknown) as { fbq: (...args: unknown[]) => void }).fbq) {
                ((window as unknown) as { fbq: (...args: unknown[]) => void }).fbq("track", "InitiateCheckout", {
                    content_name: title,
                    value: discount_price,
                    currency: "IDR",
                });
            }
        } catch { }

        // 300ms delay then redirect
        await new Promise((r) => setTimeout(r, 300));
        window.open(affiliate_url, "_blank");
    };

    return (
        <div className="bg-white rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-shadow duration-200">
            {/* Image */}
            <Link href={`/product/${slug}`} className="block relative">
                <div className="aspect-square relative overflow-hidden bg-gray-100">
                    {!imgLoaded && <div className="absolute inset-0 img-shimmer" />}
                    <img
                        src={image_url}
                        alt={title}
                        loading="lazy"
                        onLoad={() => setImgLoaded(true)}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"
                            }`}
                    />
                </div>

                {/* Badge */}
                {badge && (
                    <span className="absolute top-2 left-2 bg-gradient-to-r from-shopee-dark to-shopee text-white text-[10px] font-bold px-2 py-1 rounded">
                        {badge}
                    </span>
                )}
            </Link>

            {/* Content */}
            <div className="px-3 pt-2 pb-2 flex-1 flex flex-col">
                <Link href={`/product/${slug}`}>
                    <h3 className="text-xs font-medium text-[#222] leading-4 line-clamp-2 min-h-[32px] hover:text-shopee transition-colors">
                        {title}
                    </h3>
                </Link>

                {/* Prices */}
                <div className="mt-1.5">
                    {original_price > discount_price && (
                        <p className="text-[10px] text-gray-400 line-through">
                            Rp {formatPrice(original_price)}
                        </p>
                    )}
                    <p className="text-sm font-bold text-shopee">
                        Rp {formatPrice(discount_price)}
                    </p>
                </div>

                {/* Rating & Sold */}
                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-500">
                    <span className="flex items-center gap-0.5">
                        <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                        <span className="font-medium text-gray-600">{rating}</span>
                    </span>
                    <span className="text-gray-300">|</span>
                    <span>Terjual {formatSold(sold_count)}</span>
                </div>
            </div>

            {/* CTA Button */}
            <button
                onClick={handleBuyClick}
                className="w-full py-2.5 bg-shopee hover:bg-shopee-light text-white text-xs font-bold tracking-wide transition-colors duration-150"
            >
                Beli di Shopee
            </button>
        </div>
    );
}
