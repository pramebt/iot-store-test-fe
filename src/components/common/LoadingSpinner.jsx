import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading...', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <Loader2 className={`${sizeClasses[size]} text-slate-400 animate-spin mx-auto mb-4`} />
        <div className="text-slate-600 font-light">{message}</div>
      </div>
    </div>
  )
}
