import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric", weekday: "long"
  });

  return (
    <>
      <div className="topbar">
        <div>
          <div className="greeting-title">안녕하세요, 민지님!</div>
          <div className="greeting-sub">오늘의 복약 일정을 확인하세요</div>
        </div>
        <div className="topbar-right">
          <span className="date-chip">{today}</span>
          <div className="notif-btn">
            <svg viewBox="0 0 16 16" stroke="currentColor" fill="none" strokeWidth="1.2">
              <path d="M8 2C5.8 2 4 3.8 4 6v3l-1.5 1.5h11L12 9V6c0-2.2-1.8-4-4-4Z"/>
              <path d="M6.3 11c0 .9.8 1.7 1.7 1.7s1.7-.8 1.7-1.7"/>
            </svg>
            <div className="notif-dot"></div>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="stat-grid">
          <div className="stat-card green">
            <div className="stat-label">오늘 복약 완료</div>
            <div className="stat-value">2 / 3</div>
            <div className="stat-sub">아침 완료 · 점심 예정</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">복용 중인 약</div>
            <div className="stat-value">4</div>
            <div className="stat-sub">약 3종 · 건기식 1종</div>
          </div>
          <div className="stat-card red">
            <div className="stat-label">경고 알림</div>
            <div className="stat-value">1</div>
            <div className="stat-sub">병용금기 확인 필요</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">이번 주 복약률</div>
            <div className="stat-value">87%</div>
            <div className="stat-sub">지난 주보다 +5%</div>
          </div>
        </div>

        <div className="two-col">
          <div className="left-col">
            <div className="section-card">
              <div className="section-head">
                <span className="section-title">오늘 복약 타임라인</span>
                <a className="section-link" href="#">전체 보기</a>
              </div>
              <div className="tl-item">
                <span className="tl-time">08:00</span>
                <div className="tl-dot done"></div>
                <div className="tl-info">
                  <div className="tl-name">아침 복약</div>
                  <div className="tl-pills">
                    <span className="pill-tag">Tylenol ER 1정</span>
                    <span className="pill-tag">Omega-3 1캡슐</span>
                  </div>
                </div>
                <span className="tl-status done">완료</span>
              </div>
              <div className="tl-item">
                <span className="tl-time">12:30</span>
                <div className="tl-dot now"></div>
                <div className="tl-info">
                  <div className="tl-name">점심 복약</div>
                  <div className="tl-pills">
                    <span className="pill-tag">가스모틴 1정</span>
                    <span className="pill-tag">비타민 C 1정</span>
                  </div>
                </div>
                <span className="tl-status now">복용 시간</span>
              </div>
              <div className="tl-item">
                <span className="tl-time">20:00</span>
                <div className="tl-dot later"></div>
                <div className="tl-info">
                  <div className="tl-name">저녁 복약</div>
                  <div className="tl-pills">
                    <span className="pill-tag">Tylenol ER 1정</span>
                  </div>
                </div>
                <span className="tl-status later">예정</span>
              </div>
            </div>

            <div className="section-card">
              <div className="section-head">
                <span className="section-title">최근 검색한 약</span>
                <a className="section-link" href="#" onClick={(e) => { e.preventDefault(); navigate("/app/search"); }}>검색하러 가기</a>
              </div>
              <div className="recent-item" onClick={() => navigate("/app/search")}>
                <div className="drug-icon"><div className="drug-pill" style={{background:"var(--green6)"}}></div></div>
                <div><div className="recent-name">타이레놀 ER 650mg</div><div className="recent-sub">아세트아미노펜 · 일반의약품</div></div>
                <span className="recent-arr">›</span>
              </div>
              <div className="recent-item" onClick={() => navigate("/app/search")}>
                <div className="drug-icon"><div className="drug-pill" style={{background:"var(--blue6)"}}></div></div>
                <div><div className="recent-name">탁센 연질캡슐</div><div className="recent-sub">이부프로펜 · 일반의약품</div></div>
                <span className="recent-arr">›</span>
              </div>
            </div>
          </div>

          <div>
            <div className="section-card" style={{marginBottom:"14px"}}>
              <div className="section-head">
                <span className="section-title">경고 알림</span>
                <a className="section-link" href="#">전체 보기</a>
              </div>
              <div className="alert-item high">
                <div className="alert-icon">!</div>
                <div>
                  <div className="alert-label">병용금기 주의</div>
                  <div className="alert-desc">탁센 + 타이레놀 ER · 동시 복용 금지</div>
                </div>
              </div>
              <div className="alert-item med">
                <div className="alert-icon">⏱</div>
                <div>
                  <div className="alert-label">복용 간격 권고</div>
                  <div className="alert-desc">칼슘 + 철분 · 4시간 간격 권장</div>
                </div>
              </div>
            </div>

            <div className="section-card">
              <div className="section-head">
                <span className="section-title">복약 현황</span>
              </div>
              <div className="status-item">
                <div><div className="status-name">Tylenol ER</div><div className="status-ingr">아세트아미노펜 650mg</div></div>
                <div><div className="status-tag" style={{color:"var(--green6)"}}>상시 복용</div><div className="status-freq">1일 3회</div></div>
              </div>
              <div className="status-item">
                <div><div className="status-name">가스모틴</div><div className="status-ingr">모사프리드 5mg</div></div>
                <div><div className="status-tag" style={{color:"var(--green6)"}}>상시 복용</div><div className="status-freq">1일 3회</div></div>
              </div>
              <div className="status-item">
                <div><div className="status-name">Omega-3</div><div className="status-ingr">오메가-3 지방산 · 건기식</div></div>
                <div><div className="status-tag" style={{color:"var(--blue7)"}}>건강기능식품</div><div className="status-freq">1일 1회</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
