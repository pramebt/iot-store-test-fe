import { useState, useEffect } from 'react';
import useProductStore from '@/store/productStore';
import { getAllProducts } from '@/services/products.service';

export const useProducts = (options = {}) => {
  const { 
    categoryId = null, 
    search = '', 
    limit = null,
    autoFetch = true 
  } = options;

  const { products, loading, error, setProducts, setLoading, setError } = useProductStore();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [autoFetch]);

  useEffect(() => {
    filterProducts();
  }, [products, categoryId, search, limit]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by category
    if (categoryId) {
      filtered = filtered.filter(p => p.categoryId === categoryId);
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }

    // Limit results
    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    setFilteredProducts(filtered);
  };

  return {
    products: filteredProducts,
    allProducts: products,
    loading,
    error,
    refetch: fetchProducts,
  };
};

export default useProducts;
