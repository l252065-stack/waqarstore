import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types";

export class CategoriesService {
  async getCategories(): Promise<Category[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("categories")
      .select("*, children:categories(*)");

    if (error) throw new Error(error.message);
    return (data as Category[]) ?? [];
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("categories")
      .select("*, children:categories(*)")
      .eq("slug", slug)
      .single();

    if (error) return null;
    return data as Category;
  }

  async getRootCategories(): Promise<Category[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("categories")
      .select("*, children:categories(*)")
      .is("parent_id", null)
      .order("name");

    if (error) throw new Error(error.message);
    return (data as Category[]) ?? [];
  }
}

export const categoriesService = new CategoriesService();
