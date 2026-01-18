import { Link } from 'react-router-dom';
import { ShieldX, Home, LogIn } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function UnauthorizedAccess() {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 rounded-full p-4">
              <ShieldX className="w-12 h-12 text-red-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            ไม่มีสิทธิ์เข้าถึง
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-8">
            {!isAuthenticated || !user
              ? 'คุณต้องเข้าสู่ระบบด้วยบัญชีผู้ดูแลระบบเพื่อเข้าถึงหน้านี้'
              : 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้ หน้านี้สำหรับผู้ดูแลระบบเท่านั้น'}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!isAuthenticated || !user ? (
              <Link
                to="/login"
                className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all font-medium shadow-lg hover:shadow-xl"
              >
                <LogIn className="w-5 h-5" />
                ไปที่หน้าเข้าสู่ระบบ
              </Link>
            ) : (
              <Link
                to="/"
                className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all font-medium shadow-lg hover:shadow-xl"
              >
                <Home className="w-5 h-5" />
                กลับไปหน้าหลัก
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
