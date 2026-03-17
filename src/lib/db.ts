import { supabase } from "./supabase";

// ============ Types ============
export interface Product {
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
    category_id: string;
    clicks_count: number;
    is_active: boolean;
    created_at: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
}

// ============ Products ============

export async function getProducts(categorySlug?: string): Promise<Product[]> {
    let query = supabase
        .from("products")
        .select("*, categories(slug)")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    if (categorySlug) {
        // Join with categories table and filter by slug
        const { data: cat } = await supabase
            .from("categories")
            .select("id")
            .eq("slug", categorySlug)
            .single();

        if (cat) {
            query = query.eq("category_id", cat.id);
        } else {
            return [];
        }
    }

    const { data, error } = await query;
    if (error) {
        console.error("Error fetching products:", error);
        return [];
    }
    return (data as Product[]) || [];
}

export async function getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching all products:", error);
        return [];
    }
    return (data as Product[]) || [];
}

export async function getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching product:", error);
        return null;
    }
    return data as Product;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error) {
        console.error("Error fetching product by slug:", error);
        return null;
    }
    return data as Product;
}

export async function addProduct(
    product: Omit<Product, "id" | "clicks_count" | "created_at">
): Promise<Product | null> {
    const { data, error } = await supabase
        .from("products")
        .insert({
            title: product.title,
            slug: product.slug,
            image_url: product.image_url,
            original_price: product.original_price,
            discount_price: product.discount_price,
            affiliate_url: product.affiliate_url,
            rating: product.rating,
            sold_count: product.sold_count,
            badge: product.badge || "",
            category_id: product.category_id || null,
            is_active: product.is_active ?? true,
            clicks_count: 0,
        })
        .select()
        .single();

    if (error) {
        console.error("Error adding product:", error);
        return null;
    }
    return data as Product;
}

export async function updateProduct(
    id: string,
    updates: Partial<Product>
): Promise<Product | null> {
    // Remove fields that shouldn't be updated directly
    const { id: _id, created_at: _ca, ...cleanUpdates } = updates;
    void _id;
    void _ca;

    const { data, error } = await supabase
        .from("products")
        .update(cleanUpdates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating product:", error);
        return null;
    }
    return data as Product;
}

export async function deleteProduct(id: string): Promise<boolean> {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
        console.error("Error deleting product:", error);
        return false;
    }
    return true;
}

export async function incrementClicks(productId: string): Promise<boolean> {
    // First get current clicks
    const { data: product } = await supabase
        .from("products")
        .select("clicks_count")
        .eq("id", productId)
        .single();

    if (!product) return false;

    const { error } = await supabase
        .from("products")
        .update({ clicks_count: (product.clicks_count || 0) + 1 })
        .eq("id", productId);

    if (error) {
        console.error("Error incrementing clicks:", error);
        return false;
    }
    return true;
}

// ============ Categories ============

export async function getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
    return (data as Category[]) || [];
}

export async function getCategoryBySlug(
    slug: string
): Promise<Category | null> {
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error) return null;
    return data as Category;
}

export async function addCategory(
    category: Omit<Category, "id">
): Promise<Category | null> {
    const { data, error } = await supabase
        .from("categories")
        .insert({
            name: category.name,
            slug: category.slug,
        })
        .select()
        .single();

    if (error) {
        console.error("Error adding category:", error);
        return null;
    }
    return data as Category;
}

export async function updateCategory(
    id: string,
    updates: Partial<Category>
): Promise<Category | null> {
    const { data, error } = await supabase
        .from("categories")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating category:", error);
        return null;
    }
    return data as Category;
}

export async function deleteCategory(id: string): Promise<boolean> {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
        console.error("Error deleting category:", error);
        return false;
    }
    return true;
}
