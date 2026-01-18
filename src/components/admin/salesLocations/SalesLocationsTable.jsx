import SalesLocationStockModal from './SalesLocationStockModal';

export default function SalesLocationsTable({
  salesLocations,
  loading,
  onEdit,
  onDelete,
  onManageStock,
  selectedLocationForStock,
  showStockModal,
  setShowStockModal,
  setSelectedLocationForStock
}) {
  if (loading) {
    return null; // Loading handled by parent
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Province</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">District</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {salesLocations.map((location) => (
              <tr key={location.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{location.code}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{location.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{location.province}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{location.district}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      location.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {location.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(location)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedLocationForStock(location);
                        setShowStockModal(true);
                      }}
                      className="text-green-600 hover:text-green-800"
                    >
                      Manage Stock
                    </button>
                    <button
                      onClick={() => onDelete(location.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {salesLocations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No sales locations found</p>
        </div>
      )}

      <SalesLocationStockModal
        isOpen={showStockModal}
        onClose={() => {
          setShowStockModal(false);
          setSelectedLocationForStock(null);
        }}
        location={selectedLocationForStock}
      />
    </>
  );
}
