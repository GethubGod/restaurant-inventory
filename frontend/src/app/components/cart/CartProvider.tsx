"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { CartItem, Urgency } from "../../types";

type AddItemInput = Omit<CartItem, "id"> & { id?: string };

interface CartContextValue {
  items: CartItem[];
  totalCount: number;
  addItem: (item: AddItemInput) => void;
  updateQuantity: (id: string, qty: number) => void;
  updateUrgency: (id: string, urgency: Urgency) => void;
  updateLocation: (id: string, location: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const generateId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: AddItemInput) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (entry) =>
          entry.productId === item.productId &&
          entry.location === item.location &&
          entry.source === item.source
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          qty: updated[existingIndex].qty + item.qty,
          urgency: item.urgency ?? updated[existingIndex].urgency,
        };
        return updated;
      }

      return [
        ...prev,
        {
          id: item.id ?? generateId(),
          productId: item.productId,
          item: item.item,
          qty: item.qty,
          source: item.source,
          location: item.location,
          urgency: item.urgency ?? "Normal",
          note: item.note,
        },
      ];
    });
  };

  const updateQuantity = (id: string, qty: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty } : item))
    );
  };

  const updateUrgency = (id: string, urgency: Urgency) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, urgency } : item))
    );
  };

  const updateLocation = (id: string, location: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, location } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);

  const totalCount = useMemo(
    () => items.reduce((acc, item) => acc + item.qty, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      totalCount,
      addItem,
      updateQuantity,
      updateUrgency,
      updateLocation,
      removeItem,
      clearCart,
    }),
    [items, totalCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
