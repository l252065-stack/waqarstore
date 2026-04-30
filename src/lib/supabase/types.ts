// Minimal Database type shim.
// For a production app, generate this from your Supabase project with:
//   npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          role: "customer" | "admin";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          parent_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["categories"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          compare_at_price: number | null;
          category_id: string;
          is_active: boolean;
          is_featured: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          size: string;
          color: string | null;
          sku: string;
          stock_quantity: number;
          price_modifier: number;
        };
        Insert: Omit<Database["public"]["Tables"]["product_variants"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["product_variants"]["Insert"]>;
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt_text: string | null;
          position: number;
          is_primary: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["product_images"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["product_images"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: string;
          subtotal: number;
          discount: number;
          shipping: number;
          total: number;
          shipping_address: Record<string, unknown>;
          payment_method: string;
          payment_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          variant_id: string;
          quantity: number;
          unit_price: number;
        };
        Insert: Omit<Database["public"]["Tables"]["order_items"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
      };
    };
  };
};
