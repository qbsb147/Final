import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const loginUser = useAuthStore((state) => state.loginUser);
  const autoFetchUserInfo = useAuthStore((state) => state.autoFetchUserInfo);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 새로고침 시 자동으로 사용자 정보 불러오기
        await autoFetchUserInfo();
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        // 토큰이 유효하지 않은 경우 로그인 페이지로 이동
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [autoFetchUserInfo, navigate]);

  useEffect(() => {
    if (!isLoading && !loginUser) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    
    if (!isLoading && loginUser && allowedRoles.length > 0 && !allowedRoles.includes(loginUser.role)) {
      alert('권한이 없습니다.');
      navigate(-1);
    }
  }, [loginUser, allowedRoles, navigate, isLoading]);

  // 로딩 중이거나 사용자가 없거나 권한이 없는 경우 렌더링하지 않음
  if (isLoading) return null;
  if (!loginUser) return null;
  if (allowedRoles.length > 0 && !allowedRoles.includes(loginUser.role)) return null;
  
  return children;
};

export default ProtectedRoute; 