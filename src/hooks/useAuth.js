import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import { loginUser, registerUser, getCurrentUser } from '@/services/auth.service';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, login, logout: logoutStore, updateUser } = useAuthStore();

  const handleLogin = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      login(response.user, response.token);
      return { success: true, user: response.user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const handleRegister = async (userData) => {
    try {
      const response = await registerUser(userData);
      login(response.user, response.token);
      return { success: true, user: response.user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const handleLogout = () => {
    logoutStore();
    navigate('/');
  };

  const refreshUser = async () => {
    if (!token) return;
    
    try {
      const userData = await getCurrentUser();
      updateUser(userData);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshUser,
    isAdmin: user?.role === 'ADMIN',
  };
};

export default useAuth;
