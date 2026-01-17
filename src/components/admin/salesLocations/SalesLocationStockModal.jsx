import { useEffect, useState } from 'react'
import { salesLocationsService } from '../../../services/salesLocations.service'
import { productsService } from '../../../services/products.service'
import LoadingSpinner from '../../common/LoadingSpinner'
import { Package, AlertTriangle, Plus, Minus, ArrowRightLeft } from 'lucide-react'

export default function SalesLocationStockModal({ isOpen, salesLocation, onClose }) {
  const [stocks, setStocks] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    lowStock: false,
    page: 1,
    limit: 50,
  })
  const [totalPages, setTotalPages] = useState(1)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [selectedStock, setSelectedStock] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [updateForm, setUpdateForm] = useState({
    quantity: 0,
    action: 'SET', // SET, ADD, SUBTRACT
  })
  const [transferForm, setTransferForm] = useState({
    toSalesLocationId: '',
    quantity: 0,
  })
  const [salesLocations, setSalesLocations] = useState([])
  const [lowStockThreshold, setLowStockThreshold] = useState(10)
  const [addProductForm, setAddProductForm] = useState({
    productId: '',
    stock: 0,
    isAvailable: true,
  })

  useEffect(() => {
    if (isOpen && salesLocation) {
      loadStock()
      loadProducts()
      loadSalesLocations()
    }
  }, [isOpen, salesLocation, filters])

  const loadStock = async () => {
    try {
      setLoading(true)
      const params = {
        ...filters,
        lowStockThreshold,
      }
      const data = await salesLocationsService.getStock(salesLocation.id, params)
      setStocks(data.stocks || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Failed to load stock:', error)
      alert('Failed to load stock')
    } finally {
      setLoading(false)
    }
  }

  const loadSalesLocations = async () => {
    try {
      const data = await salesLocationsService.getAll({ limit: 100 })
      setSalesLocations(data.salesLocations || [])
    } catch (error) {
      console.error('Failed to load sales locations:', error)
    }
  }

  const loadProducts = async () => {
    try {
      const data = await productsService.getAll({ limit: 1000 })
      setProducts(data.products || [])
    } catch (error) {
      console.error('Failed to load products:', error)
    }
  }

  const handleUpdateStock = async () => {
    if (!selectedStock) return

    try {
      await salesLocationsService.updateStock(
        salesLocation.id,
        selectedStock.productId,
        updateForm.quantity,
        updateForm.action
      )
      setShowUpdateModal(false)
      setSelectedStock(null)
      setUpdateForm({ quantity: 0, action: 'SET' })
      loadStock()
    } catch (error) {
      console.error('Failed to update stock:', error)
      alert(error.response?.data?.message || error.message || 'Failed to update stock')
    }
  }

  const openUpdateModal = (stock, action = 'SET') => {
    setSelectedStock(stock)
    setUpdateForm({
      quantity: action === 'SET' ? stock.stock : 0,
      action,
    })
    setShowUpdateModal(true)
  }

  const openTransferModal = (stock) => {
    setSelectedStock(stock)
    setTransferForm({
      toSalesLocationId: '',
      quantity: stock.stock > 0 ? 1 : 0,
    })
    setShowTransferModal(true)
  }

  const handleTransferStock = async () => {
    if (!selectedStock || !transferForm.toSalesLocationId) return

    try {
      await salesLocationsService.transferStock(
        salesLocation.id,
        transferForm.toSalesLocationId,
        selectedStock.productId,
        transferForm.quantity
      )
      setShowTransferModal(false)
      setSelectedStock(null)
      setTransferForm({ toSalesLocationId: '', quantity: 0 })
      loadStock()
    } catch (error) {
      console.error('Failed to transfer stock:', error)
      alert(error.response?.data?.message || error.message || 'Failed to transfer stock')
    }
  }

  const handleAddProduct = async () => {
    if (!addProductForm.productId) {
      alert('Please select a product')
      return
    }

    try {
      await salesLocationsService.addProduct(
        salesLocation.id,
        addProductForm.productId,
        addProductForm.isAvailable,
        addProductForm.stock
      )
      setShowAddProductModal(false)
      setAddProductForm({ productId: '', stock: 0, isAvailable: true })
      setSelectedProduct(null)
      loadStock()
    } catch (error) {
      console.error('Failed to add product:', error)
      alert(error.response?.data?.message || error.message || 'Failed to add product')
    }
  }

  const handleRemoveProduct = async (productId) => {
    if (!confirm('Are you sure you want to remove this product from this sales location?')) {
      return
    }

    try {
      await salesLocationsService.removeProduct(salesLocation.id, productId)
      loadStock()
    } catch (error) {
      console.error('Failed to remove product:', error)
      alert(error.response?.data?.message || error.message || 'Failed to remove product')
    }
  }

  // Get products that are not in sales location yet
  const getAvailableProducts = () => {
    const stockProductIds = stocks.map((s) => s.productId)
    return products.filter((p) => !stockProductIds.includes(p.id) && p.status === 'Active')
  }

  if (!isOpen || !salesLocation) return null

  const lowStockItems = stocks.filter((s) => s.stock < lowStockThreshold)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Stock Management</h2>
              <p className="text-sm text-gray-600 mt-1">
                {salesLocation.name} ({salesLocation.code})
              </p>
              <p className="text-xs text-gray-500 mt-1">
                SalesLocation = สถานที่ขายและเก็บสินค้า (มี stock)
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm"
              >
                + Add Product
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Low Stock Alert */}
          {lowStockItems.length > 0 && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">
                  Low Stock Alert: {lowStockItems.length} product(s) below threshold ({lowStockThreshold})
                </p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="lowStock"
                checked={filters.lowStock}
                onChange={(e) => setFilters({ ...filters, lowStock: e.target.checked, page: 1 })}
                className="w-4 h-4"
              />
              <label htmlFor="lowStock" className="text-sm text-gray-700">
                Low Stock Only
              </label>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Threshold:</label>
              <input
                type="number"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 10)}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                min="1"
              />
            </div>
            <button
              onClick={() => setFilters({ search: '', lowStock: false, page: 1, limit: 50 })}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>

          {/* Stock Table */}
          {loading ? (
            <LoadingSpinner message="Loading stock..." />
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stocks.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                          No products found
                        </td>
                      </tr>
                    ) : (
                      stocks.map((stock) => {
                        const isLowStock = stock.stock < lowStockThreshold
                        return (
                          <tr key={stock.id} className={isLowStock ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {stock.product.imageUrl && (
                                  <img
                                    src={stock.product.imageUrl}
                                    alt={stock.product.name}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                )}
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{stock.product.name}</p>
                                  <p className="text-xs text-gray-500">ID: {stock.product.id.slice(0, 8)}...</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {stock.product.category?.name || 'N/A'}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-sm font-medium ${isLowStock ? 'text-yellow-700' : 'text-gray-900'}`}>
                                {stock.stock}
                              </span>
                              {isLowStock && (
                                <AlertTriangle className="w-4 h-4 text-yellow-600 inline-block ml-2" />
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  stock.isAvailable
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {stock.isAvailable ? 'Available' : 'Unavailable'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openUpdateModal(stock, 'SET')}
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                  title="Set Stock"
                                >
                                  Set
                                </button>
                                <button
                                  onClick={() => openUpdateModal(stock, 'ADD')}
                                  className="text-green-600 hover:text-green-800 text-sm"
                                  title="Add Stock"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => openUpdateModal(stock, 'SUBTRACT')}
                                  className="text-orange-600 hover:text-orange-800 text-sm"
                                  title="Subtract Stock"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                {stock.stock > 0 && (
                                  <button
                                    onClick={() => openTransferModal(stock)}
                                    className="text-purple-600 hover:text-purple-800 text-sm"
                                    title="Transfer Stock"
                                  >
                                    <ArrowRightLeft className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleRemoveProduct(stock.productId)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                  title="Remove Product"
                                >
                                  Remove
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Transfer Stock Modal */}
          {showTransferModal && selectedStock && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
              <div className="bg-white rounded-xl max-w-md w-full p-6">
                <h3 className="text-lg font-semibold mb-4">Transfer Stock</h3>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Product: <span className="font-medium">{selectedStock.product.name}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Available Stock: <span className="font-medium">{selectedStock.stock}</span>
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Sales Location *</label>
                  <select
                    value={transferForm.toSalesLocationId}
                    onChange={(e) => setTransferForm({ ...transferForm, toSalesLocationId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select sales location</option>
                    {salesLocations
                      .filter((sl) => sl.id !== salesLocation.id && sl.status === 'Active')
                      .map((sl) => (
                        <option key={sl.id} value={sl.id}>
                          {sl.name} ({sl.code})
                        </option>
                      ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedStock.stock}
                    value={transferForm.quantity}
                    onChange={(e) =>
                      setTransferForm({ ...transferForm, quantity: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Max: {selectedStock.stock} (After transfer: {selectedStock.stock - transferForm.quantity})
                  </p>
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setShowTransferModal(false)
                      setSelectedStock(null)
                      setTransferForm({ toSalesLocationId: '', quantity: 0 })
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTransferStock}
                    disabled={!transferForm.toSalesLocationId || transferForm.quantity <= 0 || transferForm.quantity > selectedStock.stock}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Transfer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Update Stock Modal */}
          {showUpdateModal && selectedStock && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
              <div className="bg-white rounded-xl max-w-md w-full p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {updateForm.action === 'SET' && 'Set Stock'}
                  {updateForm.action === 'ADD' && 'Add Stock'}
                  {updateForm.action === 'SUBTRACT' && 'Subtract Stock'}
                </h3>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Product: <strong>{selectedStock.product.name}</strong>
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Current Stock: <strong>{selectedStock.stock}</strong>
                  </p>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {updateForm.action === 'SET' && 'New Stock Quantity *'}
                    {updateForm.action === 'ADD' && 'Quantity to Add *'}
                    {updateForm.action === 'SUBTRACT' && 'Quantity to Subtract *'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={updateForm.quantity}
                    onChange={(e) => setUpdateForm({ ...updateForm, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleUpdateStock}
                    className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setShowUpdateModal(false)
                      setSelectedStock(null)
                      setUpdateForm({ quantity: 0, action: 'SET' })
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Product Modal */}
          {showAddProductModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
              <div className="bg-white rounded-xl max-w-md w-full p-6">
                <h3 className="text-lg font-semibold mb-4">Add Product to Sales Location</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Product *</label>
                  <select
                    value={addProductForm.productId}
                    onChange={(e) => {
                      const productId = e.target.value
                      setAddProductForm({ ...addProductForm, productId })
                      const product = products.find((p) => p.id === productId)
                      setSelectedProduct(product)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Choose a product...</option>
                    {getAvailableProducts().map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.category?.name || 'N/A'}
                      </option>
                    ))}
                  </select>
                  {getAvailableProducts().length === 0 && (
                    <p className="text-xs text-gray-500 mt-1">All products are already in this sales location</p>
                  )}
                </div>
                {selectedProduct && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{selectedProduct.name}</p>
                    <p className="text-xs text-gray-500">{selectedProduct.category?.name || 'N/A'}</p>
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock *</label>
                  <input
                    type="number"
                    min="0"
                    value={addProductForm.stock}
                    onChange={(e) => setAddProductForm({ ...addProductForm, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isAvailable"
                      checked={addProductForm.isAvailable}
                      onChange={(e) => setAddProductForm({ ...addProductForm, isAvailable: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="isAvailable" className="text-sm text-gray-700">
                      Available for sale
                    </label>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddProduct}
                    className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                  >
                    Add Product
                  </button>
                  <button
                    onClick={() => {
                      setShowAddProductModal(false)
                      setAddProductForm({ productId: '', stock: 0, isAvailable: true })
                      setSelectedProduct(null)
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
