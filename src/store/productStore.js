import { create } from 'zustand';

const useProductStore = create((set) => ({
  products: [],
  categories: [],
  loading: false,
  error: null,

  setProducts: (products) => set({ products }),
  
  setCategories: (categories) => set({ categories }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),

  addProduct: (product) => {
    set((state) => ({
      products: [...state.products, product],
    }));
  },

  updateProduct: (productId, updatedData) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId ? { ...product, ...updatedData } : product
      ),
    }));
  },

  deleteProduct: (productId) => {
    set((state) => ({
      products: state.products.filter((product) => product.id !== productId),
    }));
  },
}));

export default useProductStore;
