"use client";

import { useState, useEffect } from "react";

interface Category { id: string; name: string; slug: string; }

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [saving, setSaving] = useState(false);

    const fetchCategories = () => {
        setLoading(true);
        fetch("/api/categories").then((r) => r.json())
            .then((data) => { if (Array.isArray(data)) setCategories(data); })
            .catch(() => { }).finally(() => setLoading(false));
    };

    useEffect(() => { fetchCategories(); }, []);

    const token = () => localStorage.getItem("admin_token") || "";

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;
        setSaving(true);
        await fetch("/api/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
            body: JSON.stringify({ name: newName.trim() }),
        });
        setNewName("");
        setSaving(false);
        fetchCategories();
    };

    const handleUpdate = async (id: string) => {
        if (!editName.trim()) return;
        await fetch(`/api/categories/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
            body: JSON.stringify({ name: editName.trim(), slug: editName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") }),
        });
        setEditingId(null);
        fetchCategories();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Hapus kategori ini?")) return;
        await fetch(`/api/categories/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token()}` },
        });
        fetchCategories();
    };

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-bold text-gray-800">Kategori</h1>

            {/* Add Form */}
            <form onSubmit={handleAdd} className="flex gap-2">
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nama kategori baru..." className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-admin-accent focus:ring-1 focus:ring-admin-accent/30 outline-none" />
                <button type="submit" disabled={saving} className="px-4 py-2.5 bg-admin-accent text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Tambah
                </button>
            </form>

            {/* List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-sm text-gray-400">Memuat...</div>
                ) : categories.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-400">Belum ada kategori.</div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {categories.map((cat) => (
                            <div key={cat.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                                <div className="w-8 h-8 rounded-lg bg-admin-accent/10 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-admin-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                </div>

                                {editingId === cat.id ? (
                                    <div className="flex-1 flex gap-2">
                                        <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm outline-none focus:border-admin-accent" autoFocus />
                                        <button onClick={() => handleUpdate(cat.id)} className="text-xs text-admin-accent font-medium hover:underline">Simpan</button>
                                        <button onClick={() => setEditingId(null)} className="text-xs text-gray-400 hover:underline">Batal</button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800">{cat.name}</p>
                                            <p className="text-[10px] text-gray-400">/{cat.slug}</p>
                                        </div>
                                        <button onClick={() => { setEditingId(cat.id); setEditName(cat.name); }} className="text-gray-400 hover:text-admin-accent p-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                        <button onClick={() => handleDelete(cat.id)} className="text-gray-400 hover:text-red-500 p-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
