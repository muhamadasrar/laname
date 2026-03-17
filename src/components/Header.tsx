"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Category {
    id: string;
    name: string;
    slug: string;
}

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetch("/api/categories")
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data)) setCategories(data);
            })
            .catch(() => { });
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-r from-shopee via-[#f53d2d] to-shopee-light shadow-md">
            <div className="max-w-[480px] mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-white text-xl font-extrabold tracking-tight">
                        Laname<span className="text-yellow-300">Store</span>.
                    </span>
                </Link>

                {/* Nav */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="text-white/90 hover:text-white text-sm font-medium hidden sm:block"
                    >
                        Kategori
                    </Link>
                    <Link
                        href="/"
                        className="text-white/90 hover:text-white text-sm font-medium hidden sm:block"
                    >
                        Promo
                    </Link>

                    {/* Hamburger */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-white p-1 sm:hidden"
                        aria-label="Menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile dropdown */}
            {menuOpen && (
                <div className="sm:hidden bg-white border-t border-gray-100 shadow-lg max-w-[480px] mx-auto">
                    <Link
                        href="/"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-50"
                    >
                        🏠 Semua Produk
                    </Link>
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/kategori/${cat.slug}`}
                            onClick={() => setMenuOpen(false)}
                            className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-50"
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}
