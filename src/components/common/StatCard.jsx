export default function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs text-gray-600 mb-1 sm:mb-1.5 truncate">{title}</p>
          <p className="text-lg sm:text-2xl font-semibold text-gray-900 truncate">{value}</p>
        </div>
        <div className={`${color} w-9 h-9 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center flex-shrink-0 ml-2`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
