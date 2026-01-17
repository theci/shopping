import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { LocalCartItem } from '../types';

interface CartState {
  items: LocalCartItem[];

  // Getters
  totalItems: () => number;
  totalAmount: () => number;
  selectedItems: () => LocalCartItem[];
  selectedTotalAmount: () => number;

  // Actions
  addItem: (item: Omit<LocalCartItem, 'addedAt' | 'selected'>) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  toggleSelection: (productId: number) => void;
  toggleAllSelection: (selected: boolean) => void;
  removeSelectedItems: () => void;
  clearCart: () => void;

  // Sync with server cart after login
  syncWithServerCart: (serverItems: LocalCartItem[]) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      totalAmount: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      selectedItems: () => {
        return get().items.filter((item) => item.selected);
      },

      selectedTotalAmount: () => {
        return get()
          .items.filter((item) => item.selected)
          .reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.productId === item.productId);

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }

          return {
            items: [
              ...state.items,
              { ...item, selected: true, addedAt: new Date().toISOString() },
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        }));
      },

      toggleSelection: (productId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, selected: !item.selected } : item
          ),
        }));
      },

      toggleAllSelection: (selected) => {
        set((state) => ({
          items: state.items.map((item) => ({ ...item, selected })),
        }));
      },

      removeSelectedItems: () => {
        set((state) => ({
          items: state.items.filter((item) => !item.selected),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      syncWithServerCart: (serverItems) => {
        set({ items: serverItems });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
