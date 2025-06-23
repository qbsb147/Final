'use client';

import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        {/* 404 Number */}
        <div className="error-number-section">
          <h1 className="error-number">404</h1>
          <div className="error-divider"></div>
        </div>

        {/* Error Message */}
        <div className="error-message-section">
          <h2 className="error-title">페이지를 찾을 수 없습니다</h2>
          <p className="error-description">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            <br />
            홈페이지로 돌아가서 다시 시도해보세요.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <Link to="/" className="home-button">
            <Home size={20} />
            홈으로 돌아가기
          </Link>
          <button onClick={() => window.history.back()} className="back-button">
            <ArrowLeft size={20} />
            이전 페이지로
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="decorative-elements">
          <div className="decoration decoration-1"></div>
          <div className="decoration decoration-2"></div>
          <div className="decoration decoration-3"></div>
        </div>
      </div>
    </div>
  );
}
