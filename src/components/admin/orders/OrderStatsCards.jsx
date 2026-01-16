export default function OrderStatsCards({ orders }) {
  const stats = [
    {
      label: 'Total Orders',
      value: orders.length,
      color: 'bg-blue-500'
    },
    {
      label: 'Pending',
      value: orders.filter(o => o.status === 'PENDING').length,
      color: 'bg-yellow-500'
    },
    {
      label: 'Shipped',
      value: orders.filter(o => o.status === 'SHIPPED').length,
      color: 'bg-indigo-500'
    },
    {
      label: 'Delivered',
      value: orders.filter(o => o.status === 'DELIVERED').length,
      color: 'bg-green-500'
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">{stat.label}</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1.5">{stat.value}</p>
            </div>
            <div className={`${stat.color} w-11 h-11 rounded-lg`}></div>
          </div>
        </div>
      ))}
    </div>
  )
}
