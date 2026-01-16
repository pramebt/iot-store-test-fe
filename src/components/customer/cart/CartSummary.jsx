export default function CartSummary({ items, onCheckout }) {
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const shipping = 0 // Free shipping
  const total = subtotal + shipping

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>฿{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : `฿${shipping.toLocaleString()}`}</span>
        </div>
        <div className="border-t border-gray-300 pt-2 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-blue-600">฿{total.toLocaleString()}</span>
        </div>
      </div>
      <button
        onClick={onCheckout}
        disabled={items.length === 0}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Proceed to Checkout
      </button>
    </div>
  )
}
