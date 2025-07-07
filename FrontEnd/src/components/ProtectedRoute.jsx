import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const loginUser = useAuthStore((state) => state.loginUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (loginUser && !allowedRoles.includes(loginUser.role)) {
      alert('권한이 없습니다.');
      navigate(-1);
    }
  }, [loginUser, allowedRoles, navigate]);

  if (loginUser && !allowedRoles.includes(loginUser.role)) {
    return null;
  }
  return children;
};

export default ProtectedRoute; 