"use client";

import { ReactNode } from "react";
import { CartProvider } from "./components/cart/CartProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
