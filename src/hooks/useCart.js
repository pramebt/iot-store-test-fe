import useCartStore from '@/store/cartStore';
import { toast } from 'react-hot-toast';

export const useCart = () => {
  const { 
    items, 
    addItem, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    getTotal, 
    getItemCount 
  } = useCartStore();

  const handleAddToCart = (product, quantity = 1) => {
    try {
      addItem(product, quantity);
      toast.success(`Added ${product.name} to cart`);
      return true;
    } catch (error) {
      toast.error('Failed to add item to cart');
      return false;
    }
  };

  const handleRemoveFromCart = (productId) => {
    try {
      removeItem(productId);
      toast.success('Item removed from cart');
      return true;
    } catch (error) {
      toast.error('Failed to remove item');
      return false;
    }
  };

  const handleUpdateQuantity = (productId, quantity) => {
    try {
      updateQuantity(productId, quantity);
      return true;
    } catch (error) {
      toast.error('Failed to update quantity');
      return false;
    }
  };

  const handleClearCart = () => {
    try {
      clearCart();
      toast.success('Cart cleared');
      return true;
    } catch (error) {
      toast.error('Failed to clear cart');
      return false;
    }
  };

  return {
    items,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    total: getTotal(),
    itemCount: getItemCount(),
    isEmpty: items.length === 0,
  };
};

export default useCart;
