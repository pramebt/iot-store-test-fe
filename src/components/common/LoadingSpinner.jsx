export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
        <div className="text-gray-500">{message}</div>
      </div>
    </div>
  )
}
