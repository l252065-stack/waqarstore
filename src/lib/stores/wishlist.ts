import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WishlistItem, Product } from "@/types";

interface WishlistState {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggle: (product: Product) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (get().isInWishlist(product.id)) return;
        set((state) => ({
          items: [
            ...state.items,
            {
              id: product.id,
              product,
              added_at: new Date().toISOString(),
            },
          ],
        }));
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      isInWishlist: (productId) =>
        get().items.some((item) => item.product.id === productId),

      toggle: (product) => {
        if (get().isInWishlist(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },
    }),
    {
      name: "waqarstore-wishlist",
    }
  )
);
