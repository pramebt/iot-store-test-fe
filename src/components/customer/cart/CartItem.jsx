export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-200">
      <img
        src={item.product.imageUrl || 'https://via.placeholder.com/100'}
        alt={item.product.name}
        className="w-20 h-20 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
        <p className="text-sm text-gray-500">{item.product.category?.name}</p>
        <p className="text-lg font-semibold text-blue-600 mt-1">
          ฿{item.product.price.toLocaleString()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
          className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span className="w-12 text-center font-medium">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
          className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
          disabled={item.quantity >= item.product.stock}
        >
          +
        </button>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900">
          ฿{(item.product.price * item.quantity).toLocaleString()}
        </p>
        <button
          onClick={() => onRemove(item.product.id)}
          className="text-sm text-red-600 hover:text-red-700 mt-1"
        >
          Remove
        </button>
      </div>
    </div>
  )
}
