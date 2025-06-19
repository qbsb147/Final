import { useEffect } from 'react';
const KAKAO_KEY = import.meta.env.VITE_REACT_APP_KAKAO_MAP_KEY;

function KakaoMapLoader() {
  useEffect(() => {
    if (document.getElementById('kakao-map-script')) return;

    const kakaoScript = document.createElement('script');
    kakaoScript.id = 'kakao-map-script';
    kakaoScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&libraries=services`;
    kakaoScript.async = true;
    document.body.appendChild(kakaoScript);
    return () => {
      if (kakaoScript.parentNode) {
        kakaoScript.parentNode.removeChild(kakaoScript);
      }
    };
  }, []);
  return null;
}

export default KakaoMapLoader;
