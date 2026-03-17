import fs from "fs";
import path from "path";

export interface Category {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}

export interface Product {
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
    clicks_count: number;
    is_active: boolean;
    created_at: string;
}

interface DB {
    categories: Category[];
    products: Product[];
}

const DB_PATH = path.join(process.cwd(), "data", "db.json");

function readDB(): DB {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
}

function writeDB(db: DB): void {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

// ---------- Categories ----------

export function getCategories(): Category[] {
    return readDB().categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
    return readDB().categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
    return readDB().categories.find((c) => c.id === id);
}

export function addCategory(cat: Omit<Category, "id" | "created_at">): Category {
    const db = readDB();
    const newCat: Category = {
        ...cat,
        id: `cat-${Date.now()}`,
        created_at: new Date().toISOString(),
    };
    db.categories.push(newCat);
    writeDB(db);
    return newCat;
}

export function updateCategory(id: string, data: Partial<Category>): Category | null {
    const db = readDB();
    const idx = db.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    db.categories[idx] = { ...db.categories[idx], ...data };
    writeDB(db);
    return db.categories[idx];
}

export function deleteCategory(id: string): boolean {
    const db = readDB();
    const len = db.categories.length;
    db.categories = db.categories.filter((c) => c.id !== id);
    if (db.categories.length === len) return false;
    writeDB(db);
    return true;
}

// ---------- Products ----------

export function getProducts(categoryId?: string): Product[] {
    const db = readDB();
    let products = db.products.filter((p) => p.is_active);
    if (categoryId) {
        products = products.filter((p) => p.category_id === categoryId);
    }
    return products.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}

export function getAllProducts(): Product[] {
    return readDB().products.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}

export function getProductBySlug(slug: string): Product | undefined {
    return readDB().products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
    return readDB().products.find((p) => p.id === id);
}

export function addProduct(
    prod: Omit<Product, "id" | "clicks_count" | "created_at">
): Product {
    const db = readDB();
    const newProd: Product = {
        ...prod,
        id: `prod-${Date.now()}`,
        clicks_count: 0,
        created_at: new Date().toISOString(),
    };
    db.products.push(newProd);
    writeDB(db);
    return newProd;
}

export function updateProduct(id: string, data: Partial<Product>): Product | null {
    const db = readDB();
    const idx = db.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    db.products[idx] = { ...db.products[idx], ...data };
    writeDB(db);
    return db.products[idx];
}

export function deleteProduct(id: string): boolean {
    const db = readDB();
    const len = db.products.length;
    db.products = db.products.filter((p) => p.id !== id);
    if (db.products.length === len) return false;
    writeDB(db);
    return true;
}

export function incrementClick(productId: string): number {
    const db = readDB();
    const idx = db.products.findIndex((p) => p.id === productId);
    if (idx === -1) return 0;
    db.products[idx].clicks_count += 1;
    writeDB(db);
    return db.products[idx].clicks_count;
}

export function getTopProducts(limit = 10): Product[] {
    return readDB()
        .products.sort((a, b) => b.clicks_count - a.clicks_count)
        .slice(0, limit);
}

export function getTotalClicks(): number {
    return readDB().products.reduce((sum, p) => sum + p.clicks_count, 0);
}
