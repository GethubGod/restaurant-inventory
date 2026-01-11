export type OrderStatus = "Pending" | "Completed" | "Cancelled";
export type Urgency = "Normal" | "Rush";

export interface Product {
  id: number;
  name: string;
  current_stock: number;
  min_stock_threshold: number;
  image?: string | null;
  category: string;
  supplier: string;
  location: string;
  restock_interval_days: number;
  last_ordered_at: string | null;
  days_since_last_order?: number | null;
}

export interface OrderRecord {
  id: number;
  product: number;
  product_name?: string;
  category?: string;
  user_name?: string | null;
  quantity: number;
  source: string;
  location: string;
  status: OrderStatus;
  urgency: Urgency;
  note?: string;
  created_at: string;
  updated_at: string;
  user?: number | null;
}

export interface Suggestion {
  id: number;
  item: string;
  source: string;
  reason: string;
  productId: number;
  location: string;
}

export interface OrderItem {
  id: number;
  item: string;
  qty: number;
  source: string;
  location: string;
  orderedBy: string;
  status: OrderStatus;
  date: string;
  urgency: Urgency;
}

export interface LocationOption {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface RecentOrder {
  id: number;
  item: string;
  qty: number;
  location: string;
  source: string;
  date: string;
  productId: number;
}

export interface CartItem {
  id: string;
  productId: number;
  item: string;
  qty: number;
  source: string;
  location: string;
  urgency: Urgency;
  note?: string;
}
