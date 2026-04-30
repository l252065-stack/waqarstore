// ─── Enums ───────────────────────────────────────────────────────────────────

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  OUT_FOR_DELIVERY = "out_for_delivery",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export enum PaymentMethod {
  COD = "cod",
  STRIPE = "stripe",
  PAYFAST = "payfast",
  BANK_TRANSFER = "bank_transfer",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum UserRole {
  CUSTOMER = "customer",
  ADMIN = "admin",
}

export enum SupportTicketStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  parent?: Category;
  children?: Category[];
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  position: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string | null;
  sku: string;
  stock_quantity: number;
  price_modifier: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category_id: string;
  category?: Category;
  is_active: boolean;
  is_featured: boolean;
  images?: ProductImage[];
  variants?: ProductVariant[];
  created_at: string;
}

export interface ProductWithDetails extends Product {
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface Cart {
  id: string;
  user_id: string | null;
  items: CartItem[];
  created_at: string;
}

// ─── Wishlist ────────────────────────────────────────────────────────────────

export interface WishlistItem {
  id: string;
  product: Product;
  added_at: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  items: WishlistItem[];
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  variant_id: string;
  variant?: ProductVariant;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  shipping_address: ShippingAddress;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

// ─── Users ───────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
}

export interface AdminUser extends UserProfile {
  role: UserRole.ADMIN;
  email: string;
}

// ─── Support ─────────────────────────────────────────────────────────────────

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  status: SupportTicketStatus;
  messages?: SupportMessage[];
  created_at: string;
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  sender_role: "customer" | "admin";
  content: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// ─── API Responses ───────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Filters ─────────────────────────────────────────────────────────────────

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  sortBy?: "newest" | "price_asc" | "price_desc" | "best_selling";
  search?: string;
  page?: number;
  pageSize?: number;
  featured?: boolean;
  isActive?: boolean;
}

// ─── Payments ────────────────────────────────────────────────────────────────

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: "stripe" | "payfast" | "cod";
  metadata?: Record<string, string>;
}

export interface CreateOrderData {
  items: Array<{
    product_id: string;
    variant_id: string;
    quantity: number;
    unit_price: number;
  }>;
  shipping_address: ShippingAddress;
  payment_method: PaymentMethod;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

// ─── Admin Stats ─────────────────────────────────────────────────────────────

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
}

export interface InventoryItem {
  product_id: string;
  product_name: string;
  variant_id: string;
  size: string;
  color: string | null;
  sku: string;
  stock_quantity: number;
  low_stock_threshold: number;
}
