"use client";

import { useState } from "react";

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Cari produk..." }: SearchBarProps) {
    const [query, setQuery] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
    };

    const handleClear = () => {
        setQuery("");
        onSearch("");
    };

    return (
        <div className="relative">
            <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden focus-within:border-shopee focus-within:ring-1 focus-within:ring-shopee/30 transition-all">
                <svg
                    className="w-4 h-4 text-gray-400 ml-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="flex-1 px-3 py-2.5 text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-400"
                />
                {query && (
                    <button
                        onClick={handleClear}
                        className="px-3 text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
