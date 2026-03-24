import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-body">
      <div className="landing-container">

        {/* 헤더 */}
        <div className="landing-header">
          <div className="landing-logo">
            <div className="landing-logo-icon"></div>
            <span className="landing-logo-text">MediLink</span>
          </div>
          <div className="landing-nav-btns">
            <button className="btn-login" onClick={() => navigate("/app/home")}>로그인</button>
            <button className="btn-signup" onClick={() => navigate("/app/home")}>회원가입</button>
          </div>
        </div>

        {/* 히어로 */}
        <div className="landing-hero">
          <div>
            <h1>내 약을 더 안전하게<br />관리하세요</h1>
            <p>
              MediLink는 복약 일정 관리, 약물 상호작용 알림,<br />
              개인 맞춤 건강 관리를 하나로 제공합니다.
            </p>
            <button className="btn-cta" onClick={() => navigate("/app/home")}>지금 시작하기</button>
          </div>
          <div className="hero-card">
            <h3>주요 기능 미리보기</h3>
            <ul>
              <li>✔ 복약 스케줄 자동 관리</li>
              <li>✔ 병용 금기 알림</li>
              <li>✔ 약 정보 검색</li>
              <li>✔ 복약 이력 기록</li>
            </ul>
          </div>
        </div>

        {/* 기능 */}
        <div className="landing-features">
          <div className="feature-card">
            <div className="feature-icon">💊</div>
            <h4>복약 관리</h4>
            <p>하루 복약 스케줄을 자동으로 관리합니다.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚠️</div>
            <h4>안전 알림</h4>
            <p>약물 상호작용 및 주의사항을 알려줍니다.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h4>약 정보 검색</h4>
            <p>의약품 정보를 쉽게 확인할 수 있습니다.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="landing-cta">
          <h2>지금 MediLink를 시작해보세요</h2>
          <p>간편한 회원가입으로 바로 이용할 수 있습니다.</p>
          <button onClick={() => navigate("/app/home")}>회원가입</button>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
