import { Package, Edit2, Trash2 } from 'lucide-react'

export default function ProductsTable({ products, onEdit, onDelete, onToggleStatus }) {
  if (products.length === 0) {
    return (
      <div className="px-6 py-8 text-center text-gray-500">
        No products found
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 shrink-0">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="h-10 w-10 rounded object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center text-gray-400">
                        <Package className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.id.slice(0, 8)}...</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {product.category?.name || 'N/A'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                ฿{product.price?.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm">
                <span className={product.stock < 10 ? 'text-red-600 font-medium' : 'text-gray-900'}>
                  {product.stock}
                </span>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onToggleStatus(product)}
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {product.status}
                </button>
              </td>
              <td className="px-6 py-4 text-sm">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit product"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(product)}
                    className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
