import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function LoginLoadingPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30); // Update every 30ms for smooth animation

    // Redirect to home after 1.5 seconds
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="text-center">
        {/* Logo with pulse animation */}
        <div className="w-20 h-20 bg-linear-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg animate-pulse">
          <span className="text-white font-semibold text-3xl">IoT</span>
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center mb-6">
          <Loader2 className="w-12 h-12 text-gray-900 animate-spin" />
        </div>

        {/* Loading Text */}
        <div className="space-y-2 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 animate-pulse">กำลังเข้าสู่ระบบ...</h2>
          <p className="text-gray-500 text-sm">กรุณารอสักครู่</p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-linear-to-r from-gray-900 to-gray-700 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
