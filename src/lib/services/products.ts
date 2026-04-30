import { createClient } from "@/lib/supabase/server";
import type { Product, ProductFilters, PaginatedResponse } from "@/types";

export class ProductsService {
  async getProducts(
    filters: ProductFilters = {}
  ): Promise<PaginatedResponse<Product>> {
    const supabase = await createClient();
    const {
      category,
      minPrice,
      maxPrice,
      sizes,
      sortBy = "newest",
      search,
      page = 1,
      pageSize = 20,
      isActive = true,
    } = filters;

    let query = supabase
      .from("products")
      .select(
        `
        *,
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*)
      `,
        { count: "exact" }
      )
      .eq("is_active", isActive);

    if (category) {
      query = query.eq("categories.slug", category);
    }
    if (minPrice !== undefined) {
      query = query.gte("price", minPrice);
    }
    if (maxPrice !== undefined) {
      query = query.lte("price", maxPrice);
    }
    if (search) {
      query = query.ilike("name", `%${search}%`);
    }
    if (sizes && sizes.length > 0) {
      query = query.in("product_variants.size", sizes);
    }

    switch (sortBy) {
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    const from = (page - 1) * pageSize;
    query = query.range(from, from + pageSize - 1);

    const { data, error, count } = await query;

    if (error) throw new Error(error.message);

    return {
      data: (data as Product[]) ?? [],
      total: count ?? 0,
      page,
      pageSize,
      totalPages: Math.ceil((count ?? 0) / pageSize),
    };
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*)
      `
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error) return null;
    return data as Product;
  }

  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        category:categories!inner(*),
        images:product_images(*),
        variants:product_variants(*)
      `
      )
      .eq("categories.slug", categorySlug)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data as Product[]) ?? [];
  }

  async searchProducts(query: string): Promise<Product[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*)
      `
      )
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .eq("is_active", true)
      .limit(20);

    if (error) throw new Error(error.message);
    return (data as Product[]) ?? [];
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*)
      `
      )
      .eq("is_featured", true)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(8);

    if (error) throw new Error(error.message);
    return (data as Product[]) ?? [];
  }

  async getNewArrivals(limit = 8): Promise<Product[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*)
      `
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);
    return (data as Product[]) ?? [];
  }

  async getRelatedProducts(
    productId: string,
    categoryId: string,
    limit = 4
  ): Promise<Product[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*)
      `
      )
      .eq("category_id", categoryId)
      .eq("is_active", true)
      .neq("id", productId)
      .limit(limit);

    if (error) throw new Error(error.message);
    return (data as Product[]) ?? [];
  }
}

export const productsService = new ProductsService();
