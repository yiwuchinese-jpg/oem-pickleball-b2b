'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { CartItem, Product, ProductSku } from '@/lib/supabase';

// ─── State ────────────────────────────────────────────────────────────────────
interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; sku: ProductSku; quantity?: number }
  | { type: 'REMOVE_ITEM'; skuId: string }
  | { type: 'UPDATE_QTY'; skuId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'HYDRATE'; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.items };

    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.sku.id === action.sku.id);
      const qty = action.quantity ?? 1;
      if (existing) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map((i) =>
            i.sku.id === action.sku.id
              ? { ...i, quantity: Math.min(i.quantity + qty, i.sku.stock_quantity) }
              : i
          ),
        };
      }
      return {
        ...state,
        isOpen: true,
        items: [...state.items, { product: action.product, sku: action.sku, quantity: Math.min(qty, action.sku.stock_quantity) }],
      };
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.sku.id !== action.skuId) };

    case 'UPDATE_QTY': {
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.sku.id !== action.skuId) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.sku.id === action.skuId
            ? { ...i, quantity: Math.min(action.quantity, i.sku.stock_quantity) }
            : i
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'OPEN_CART':
      return { ...state, isOpen: true };

    case 'CLOSE_CART':
      return { ...state, isOpen: false };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, sku: ProductSku, quantity?: number) => void;
  removeItem: (skuId: string) => void;
  updateQty: (skuId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number; // 以分为单位
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'djw_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  // 从 localStorage 恢复购物车（仅客户端）
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: CartItem[] = JSON.parse(raw);
        dispatch({ type: 'HYDRATE', items: parsed });
      }
    } catch {
      // 静默处理解析错误
    }
  }, []);

  // 持久化到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // 静默处理存储错误
    }
  }, [state.items]);

  const addItem = useCallback((product: Product, sku: ProductSku, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', product, sku, quantity });
  }, []);

  const removeItem = useCallback((skuId: string) => {
    dispatch({ type: 'REMOVE_ITEM', skuId });
  }, []);

  const updateQty = useCallback((skuId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QTY', skuId, quantity });
  }, []);

  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);
  const openCart = useCallback(() => dispatch({ type: 'OPEN_CART' }), []);
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), []);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.sku.price_cents * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        openCart,
        closeCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
