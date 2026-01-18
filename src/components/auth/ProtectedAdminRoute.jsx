import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { USER_ROLES } from '../../utils/constants';
import UnauthorizedAccess from '../../pages/UnauthorizedAccess';

export default function ProtectedAdminRoute() {
  const { user, isAuthenticated } = useAuthStore();

  // If not authenticated, show unauthorized page
  if (!isAuthenticated || !user) {
    return <UnauthorizedAccess />;
  }

  // If authenticated but not admin, show unauthorized page
  if (user.role !== USER_ROLES.ADMIN) {
    return <UnauthorizedAccess />;
  }

  // If admin, allow access
  return <Outlet />;
}
