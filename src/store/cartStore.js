import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          // Check if same product with same location exists
          const existingItem = state.items.find((item) => 
            item.id === product.id && 
            item.selectedLocationId === product.selectedLocationId
          );
          
          if (existingItem) {
            // Update quantity if same product and location
            return {
              items: state.items.map((item) =>
                item.id === product.id && item.selectedLocationId === product.selectedLocationId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          
          // Add new item (different product or different location)
          return {
            items: [...state.items, { ...product, quantity }],
          };
        });
      },

      removeItem: (productId, selectedLocationId = null) => {
        set((state) => {
          if (selectedLocationId) {
            // Remove specific item with location
            return {
              items: state.items.filter(
                (item) => !(item.id === productId && item.selectedLocationId === selectedLocationId)
              ),
            };
          }
          // Remove first matching item (backward compatibility)
          return {
            items: state.items.filter((item) => item.id !== productId),
          };
        });
      },

      updateQuantity: (productId, quantity, selectedLocationId = null) => {
        if (quantity <= 0) {
          if (selectedLocationId) {
            get().removeItem(productId, selectedLocationId);
          } else {
            get().removeItem(productId);
          }
          return;
        }
        
        set((state) => {
          // If selectedLocationId is provided, update specific item
          if (selectedLocationId) {
            return {
              items: state.items.map((item) =>
                item.id === productId && item.selectedLocationId === selectedLocationId
                  ? { ...item, quantity }
                  : item
              ),
            };
          }
          
          // Otherwise, update first matching item
          return {
            items: state.items.map((item) =>
              item.id === productId ? { ...item, quantity } : item
            ),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

export { useCartStore };
