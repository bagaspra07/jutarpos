import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, CartState } from '../types';

interface CartActions {
  addItem: (item: Omit<CartItem, 'quantity' | 'note'>) => void;
  removeItem: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  updateNote: (menuItemId: number, note: string) => void;
  setOrderNote: (note: string) => void;
  setSession: (sessionId: string, tableId: number, tableName: string) => void;
  setCustomerName: (name: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set) => ({
      items: [],
      orderNote: null,
      sessionId: null,
      tableId: null,
      tableName: null,
      customerName: null,

      addItem: (newItem) => set((state) => {
        const existingItem = state.items.find((i) => i.menuItemId === newItem.menuItemId);
        if (existingItem) {
          return {
            items: state.items.map((i) =>
              i.menuItemId === newItem.menuItemId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          };
        }
        return {
          items: [...state.items, { ...newItem, quantity: 1, note: null }],
        };
      }),

      removeItem: (menuItemId) => set((state) => ({
        items: state.items.filter((i) => i.menuItemId !== menuItemId),
      })),

      updateQuantity: (menuItemId, quantity) => set((state) => {
        if (quantity <= 0) {
          return { items: state.items.filter((i) => i.menuItemId !== menuItemId) };
        }
        return {
          items: state.items.map((i) =>
            i.menuItemId === menuItemId ? { ...i, quantity } : i
          ),
        };
      }),

      updateNote: (menuItemId, note) => set((state) => ({
        items: state.items.map((i) =>
          i.menuItemId === menuItemId ? { ...i, note } : i
        ),
      })),

      setOrderNote: (orderNote) => set({ orderNote }),

      setSession: (sessionId, tableId, tableName) => set({ sessionId, tableId, tableName }),

      setCustomerName: (customerName) => set({ customerName }),

      clearCart: () => set({ items: [], orderNote: null }),
    }),
    {
      name: 'jutar-cart-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
