export default function DeliveryAddressesTable({ deliveryAddresses, onEdit, onDelete }) {
  return (
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
          {deliveryAddresses.map((deliveryAddress) => (
            <tr key={deliveryAddress.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{deliveryAddress.code}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{deliveryAddress.name}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{deliveryAddress.province}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{deliveryAddress.district}</td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    deliveryAddress.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {deliveryAddress.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(deliveryAddress)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(deliveryAddress.id)}
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
      {deliveryAddresses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No delivery addresses found</p>
        </div>
      )}
    </div>
  );
}
