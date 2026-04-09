import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ───────── 커스텀 커서 훅 ───────── */
function useCursor() {
  const [cursor, setCursor] = useState({ x: -200, y: -200 });
  const [ring, setRing] = useState({ x: -200, y: -200 });
  const ringPos = useRef({ x: -200, y: -200 });
  const raf = useRef(null);
  useEffect(() => {
    const onMove = (e) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  useEffect(() => {
    const tick = () => {
      ringPos.current.x += (cursor.x - ringPos.current.x) * 0.14;
      ringPos.current.y += (cursor.y - ringPos.current.y) * 0.14;
      setRing({ x: ringPos.current.x, y: ringPos.current.y });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [cursor]);
  return { cursor, ring };
}

/* ───────── 약 목록 데이터 ───────── */
const DRUGS = [
  {
    id: 1,
    icon: "🟠",
    name: "타이레놀정500mg",
    company: "한국존슨앤드존슨",
    tags: [{ label: "일반의약품", color: "purple" }, { label: "진통제", color: "red" }],
    dose: "성인 1회 1정, 1일 3~4회 (필요시)",
    detail: {
      effect: "해열·진통 (두통, 치통, 생리통, 발열 등)",
      dose: "성인 1회 1정, 1일 3~4회 (필요시)",
      cautions: ["이 약에 과민증이 있는 환자 금기", "간장질환 환자 주의", "정해진 용법·용량을 지키주세요"],
      storage: "실온(1~30°C) 보관, 직사광선 피하기",
    },
  },
  {
    id: 2,
    icon: "💙",
    name: "아스피린프로텍트정100mg",
    company: "바이엘코리아(주)",
    tags: [{ label: "일반의약품", color: "purple" }, { label: "혈관 건강", color: "blue" }],
    dose: "성인 1회 1정, 1일 1회 (식후)",
    detail: {
      effect: "혈전 예방, 혈액 순환 개선",
      dose: "성인 1회 1정, 1일 1회 (식후)",
      cautions: ["출혈 경향이 있는 환자 주의", "위궤양 환자 금기", "장기 복용 시 의사 상담"],
      storage: "실온(1~30°C) 보관, 습기 피하기",
    },
  },
  {
    id: 3,
    icon: "🟠",
    name: "타이레놀8시간이알서방정650mg",
    company: "한국존슨앤드존슨",
    tags: [{ label: "일반의약품", color: "purple" }, { label: "해열진통제", color: "orange" }],
    dose: "성인 1회 1정, 1일 2회 (필요시)",
    detail: {
      effect: "해열·진통 (두통, 치통, 근육통, 발열 등)",
      dose: "성인 1회 1정, 1일 2회 (필요시)",
      cautions: ["씹거나 쪼개지 말고 통째로 삼키세요", "간장질환 환자 주의", "알코올 섭취 시 주의"],
      storage: "실온(1~30°C) 보관, 직사광선 피하기",
    },
  },
  {
    id: 4,
    icon: "🖤",
    name: "오메가3파워업·TG서큐온캡슐1g",
    company: "종근당건강(주)",
    tags: [{ label: "건강기능식품", color: "green" }, { label: "혈행 개선", color: "blue" }],
    dose: "성인 1회 1정, 1일 1캡슐 (식후)",
    detail: {
      effect: "혈행 개선, 중성지방 감소",
      dose: "성인 1회 1정, 1일 1캡슐 (식후)",
      cautions: ["항응고제 복용 시 의사 상담", "어류 알레르기 주의", "어린이 손이 닿지 않는 곳 보관"],
      storage: "실온(1~30°C) 보관, 개봉 후 냉장 권장",
    },
  },
  {
    id: 5,
    icon: "💜",
    name: "달슘한판코네슘정",
    company: "동아제약(주)",
    tags: [{ label: "일반의약품", color: "purple" }, { label: "근육·관절", color: "teal" }],
    dose: "1회 1정, 1일 2회 (식후)",
    detail: {
      effect: "칼슘·마그네슘 보충, 근육 경련 완화",
      dose: "1회 1정, 1일 2회 (식후)",
      cautions: ["신장 질환 환자 주의", "다른 칼슘제와 병용 주의", "변비가 생길 수 있음"],
      storage: "실온(1~30°C) 보관, 습기 피하기",
    },
  },
  {
    id: 6,
    icon: "🔴",
    name: "이부프로펜정400mg",
    company: "삼진제약(주)",
    tags: [{ label: "일반의약품", color: "purple" }, { label: "해열·진통", color: "red" }],
    dose: "1회 1정, 1일 3회 (필요시)",
    detail: {
      effect: "소염·진통·해열 (관절염, 두통, 생리통 등)",
      dose: "1회 1정, 1일 3회 (필요시)",
      cautions: ["위장 장애 환자 주의", "임산부 복용 금지", "식후 복용 권장"],
      storage: "실온(1~30°C) 보관, 직사광선 피하기",
    },
  },
];

/* ───────── 태그 색상 맵 ───────── */
const TAG_STYLES = {
  purple: { background: "#ede9fe", color: "#7c3aed", border: "1.5px solid #7c3aed" },
  blue:   { background: "#dbeafe", color: "#1d4ed8", border: "1.5px solid #1d4ed8" },
  red:    { background: "#fee2e2", color: "#b91c1c", border: "1.5px solid #b91c1c" },
  green:  { background: "#dcfce7", color: "#166534", border: "1.5px solid #166534" },
  orange: { background: "#ffedd5", color: "#c2410c", border: "1.5px solid #c2410c" },
  teal:   { background: "#ccfbf1", color: "#0f766e", border: "1.5px solid #0f766e" },
};

/* ───────── 사이드바 메뉴 ───────── */
const NAV_ITEMS = [
  { icon: "🏠", label: "홈", path: "/app/home" },
  { icon: "🔍", label: "약 검색", path: "/app/search" },
  { icon: "❤️", label: "내 약함", path: "/app/cabinet", active: true },
  { icon: "🕐", label: "병용 확인", path: "/app/check" },
];
const MANAGE_ITEMS = [
  { icon: "🔔", label: "알림", path: "/app/notifications", badge: 2 },
  { icon: "🔗", label: "의료진 공유", path: "share" },
  { icon: "⚙️", label: "설정", path: "/app/setting" },
];

export default function MediPocketCabinet() {
  const navigate = useNavigate();
  const { cursor, ring } = useCursor();
  const [drugs, setDrugs] = useState(DRUGS);
  const [selectedDrug, setSelectedDrug] = useState(DRUGS[0]);
  const [hoveredId, setHoveredId] = useState(null);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setDrugs((prev) => {
      const next = prev.filter((d) => d.id !== id);
      if (selectedDrug?.id === id) setSelectedDrug(next[0] || null);
      return next;
    });
  };

  const handleDeleteAll = () => {
    setDrugs([]);
    setSelectedDrug(null);
  };

  return (
    <>
      <style>{CSS}</style>
      {/* 커스텀 커서 */}
      <div className="mp-cursor"      style={{ left: cursor.x, top: cursor.y }} />
      <div className="mp-cursor-ring" style={{ left: ring.x,   top: ring.y   }} />

      <div className="mp-root">

        {/* ── 왼쪽 사이드바 (고정) ── */}
        <aside className="mp-sidebar">
          <div className="mp-sb-logo">
            <div className="mp-sb-logo-icon">💊</div>
            <span className="mp-sb-logo-text">MediPocket</span>
          </div>

          <div className="mp-sb-section-label">메인</div>
          <nav className="mp-sb-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.path} onClick={() => navigate(item.path)}
                className={`mp-sb-item${item.active ? " active" : "" }` }
              >
                <span className="mp-sb-item-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mp-sb-section-label">관리</div>
          <nav className="mp-sb-nav">
            {MANAGE_ITEMS.map((item) => (
              <button key={item.path} className="mp-sb-item"  onClick={() => navigate(item.path)}>
                <span className="mp-sb-item-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && <span className="mp-sb-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>

          <div className="mp-sb-spacer" />
          <div className="mp-sb-user">
            <div className="mp-sb-avatar">민지</div>
            <div>
              <div className="mp-sb-user-name">김민지</div>
              <div className="mp-sb-user-role">일반 사용자</div>
            </div>
          </div>
        </aside>

        {/* ── 메인 스크롤 영역 ── */}
        <main className="mp-main">
          {/* 헤더 */}
          <div className="mp-header">
            <div className="mp-header-left">
              <div className="mp-header-icon">🧡</div>
              <div>
                <div className="mp-header-title">담은 약</div>
                <div className="mp-header-sub">내가 담은 약을 한눈에 확인하고 관리해보세요.</div>
              </div>
            </div>
            <div className="mp-header-right">
              <span className="mp-count-txt">총 {drugs.length}개</span>
              <button className="mp-btn-delete-all" onClick={handleDeleteAll}>전체 삭제</button>
            </div>
          </div>

          {/* 주의 배너 */}
          <div className="mp-notice">
            <span className="mp-notice-icon">🛡</span>
            <div>
              <div className="mp-notice-title">복용 전 확인하세요</div>
              <div className="mp-notice-sub">담은 약은 저장된 목록입니다. 복용 전 약사 또는 의사와 상담하세요.</div>
            </div>
          </div>

          {/* 약 목록 */}
          <div className="mp-list">
            {drugs.length === 0 && (
              <div className="mp-empty">담은 약이 없습니다.</div>
            )}
            {drugs.map((drug) => (
              <div
                key={drug.id}
                className={`mp-item${selectedDrug?.id === drug.id ? " selected" : ""}${hoveredId === drug.id ? " hovered" : ""}`}
                onClick={() => setSelectedDrug(drug)}
                onMouseEnter={() => setHoveredId(drug.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="mp-item-icon-wrap">
                  <span className="mp-item-emoji">{drug.icon}</span>
                </div>
                <div className="mp-item-body">
                  <div className="mp-item-name">{drug.name}</div>
                  <div className="mp-item-company">{drug.company}</div>
                  <div className="mp-item-tags">
                    {drug.tags.map((tag) => (
                      <span
                        key={tag.label}
                        className="mp-tag"
                        style={TAG_STYLES[tag.color] || TAG_STYLES.purple}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mp-item-dose-col">
                  <div className="mp-dose-label">복용법</div>
                  <div className="mp-dose-val">{drug.dose}</div>
                  <div className="mp-memo-btn">📝 메모 추가</div>
                </div>
                <button
                  className="mp-item-del"
                  onClick={(e) => handleDelete(drug.id, e)}
                  title="삭제"
                >✕</button>
              </div>
            ))}
          </div>

          {/* 하단 버튼 */}
          <div className="mp-bottom">
            <button className="mp-btn-schedule">📅&nbsp;&nbsp;복용 일정 관리하기 →</button>
          </div>
        </main>

        {/* ── 오른쪽 디테일 패널 (고정) ── */}
        <aside className="mp-detail">
          {selectedDrug ? (
            <>
              <div className="mp-detail-back">← 약 상세 정보</div>

              <div className="mp-detail-drug-header">
                <div className="mp-detail-drug-icon">{selectedDrug.icon}</div>
                <div>
                  <div className="mp-detail-drug-name">{selectedDrug.name}</div>
                  <div className="mp-detail-drug-company">{selectedDrug.company}</div>
                  <div className="mp-detail-tags">
                    {selectedDrug.tags.map((tag) => (
                      <span
                        key={tag.label}
                        className="mp-tag"
                        style={TAG_STYLES[tag.color] || TAG_STYLES.purple}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mp-detail-section">
                <div className="mp-detail-section-title">효능·효과</div>
                <div className="mp-detail-section-content">{selectedDrug.detail.effect}</div>
              </div>

              <div className="mp-detail-section">
                <div className="mp-detail-section-title">복용법</div>
                <div className="mp-detail-section-content">{selectedDrug.detail.dose}</div>
              </div>

              <div className="mp-detail-section">
                <div className="mp-detail-section-title">주의사항</div>
                <div className="mp-detail-section-content">
                  {selectedDrug.detail.cautions.map((c, i) => (
                    <div key={i}>• {c}</div>
                  ))}
                </div>
              </div>

              <div className="mp-detail-section">
                <div className="mp-detail-section-title">저장 방법</div>
                <div className="mp-detail-section-content">{selectedDrug.detail.storage}</div>
              </div>

              <button className="mp-detail-back-btn">검색 결과로 돌아가기</button>
            </>
          ) : (
            <div className="mp-detail-empty">약을 선택하면<br />상세 정보가 표시됩니다.</div>
          )}
        </aside>

      </div>
    </>
  );
}

/* ───────── CSS ───────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@400;500;700;900&display=swap');

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --p: #7c3aed;
  --pl: #ede9fe;
  --a1: #a78bfa;
  --a2: #f9a8d4;
  --txt: #1a1433;
  --sub: #6b7280;
  --sub2: #6b5f8a;
  --bg: #f4f3ff;
  --border: #e9e7f5;
  --fn: 'Plus Jakarta Sans', 'Noto Sans KR', sans-serif;
  --sb-w: 210px;
  --detail-w: 300px;
}

html, body { width: 100%; min-height: 100vh; cursor: none; font-family: var(--fn); background: var(--bg); }

/* ── 커서 ── */
.mp-cursor { width: 10px; height: 10px; border-radius: 50%; background: var(--a1); position: fixed; z-index: 9999; pointer-events: none; transform: translate(-50%,-50%); mix-blend-mode: multiply; }
.mp-cursor-ring { width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--a1); position: fixed; z-index: 9998; pointer-events: none; transform: translate(-50%,-50%); opacity: .4; }

/* ── 레이아웃 루트 ── */
.mp-root {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* ── 왼쪽 사이드바 ── */
.mp-sidebar {
  width: var(--sb-w);
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 24px 14px 20px;
  overflow-y: auto;
  position: sticky;
  top: 0;
  height: 100vh;
}

.mp-sb-logo { display: flex; align-items: center; gap: 9px; margin-bottom: 28px; }
.mp-sb-logo-icon { width: 34px; height: 34px; background: linear-gradient(135deg,var(--a1),var(--a2)); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 17px; box-shadow: 0 4px 12px rgba(167,139,250,.4); animation: mp-pulse 3s ease-in-out infinite; }
@keyframes mp-pulse { 0%,100%{box-shadow:0 4px 12px rgba(167,139,250,.4)} 50%{box-shadow:0 4px 20px rgba(167,139,250,.62)} }
.mp-sb-logo-text { font-size: 16px; font-weight: 800; color: var(--txt); }

.mp-sb-section-label { font-size: 11px; font-weight: 600; color: #b0a8c8; letter-spacing: .06em; text-transform: uppercase; padding: 0 8px; margin-bottom: 6px; margin-top: 14px; }
.mp-sb-nav { display: flex; flex-direction: column; gap: 2px; }
.mp-sb-item { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 10px; border: none; background: transparent; font-family: var(--fn); font-size: 13px; font-weight: 500; color: var(--sub); cursor: none; transition: all .18s; text-align: left; width: 100%; }
.mp-sb-item:hover { background: var(--pl); color: var(--p); }
.mp-sb-item.active { background: var(--pl); color: var(--p); font-weight: 700; }
.mp-sb-item-icon { font-size: 15px; width: 20px; text-align: center; }
.mp-sb-badge { margin-left: auto; background: var(--p); color: #fff; font-size: 10px; font-weight: 700; border-radius: 50px; padding: 1px 7px; }

.mp-sb-spacer { flex: 1; }
.mp-sb-user { display: flex; align-items: center; gap: 10px; padding: 10px 8px; border-top: 1px solid var(--border); margin-top: 12px; }
.mp-sb-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg,var(--a1),var(--p)); color: #fff; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.mp-sb-user-name { font-size: 13px; font-weight: 700; color: var(--txt); }
.mp-sb-user-role { font-size: 11px; color: var(--sub); }

/* ── 메인 스크롤 영역 ── */
.mp-main {
  flex: 1;
  overflow-y: auto;
  padding: 36px 32px 40px;
  min-width: 0;
}

/* ── 헤더 ── */
.mp-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.mp-header-left { display: flex; align-items: center; gap: 14px; }
.mp-header-icon { font-size: 30px; }
.mp-header-title { font-size: 24px; font-weight: 800; color: var(--txt); line-height: 1.2; }
.mp-header-sub { font-size: 14px; color: var(--sub2); margin-top: 3px; }
.mp-header-right { display: flex; align-items: center; gap: 14px; }
.mp-count-txt { font-size: 14px; color: var(--sub); font-weight: 500; }
.mp-btn-delete-all { padding: 8px 18px; background: var(--p); color: #fff; border: none; border-radius: 10px; font-family: var(--fn); font-size: 14px; font-weight: 700; cursor: none; transition: all .18s; }
.mp-btn-delete-all:hover { background: #6d28d9; transform: translateY(-1px); }
.mp-btn-delete-all:active { transform: scale(.97); }

/* ── 주의 배너 ── */
.mp-notice { background: #eff6ff; border: 0.8px solid #bfdbfe; border-radius: 12px; padding: 16px 20px; display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
.mp-notice-icon { font-size: 20px; flex-shrink: 0; }
.mp-notice-title { font-size: 15px; font-weight: 700; color: #1d4ed8; margin-bottom: 4px; }
.mp-notice-sub { font-size: 12px; color: #1e40af; }

/* ── 약 목록 ── */
.mp-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
.mp-empty { text-align: center; padding: 60px 0; font-size: 14px; color: var(--sub); }

.mp-item {
  background: #fff;
  border: 0.8px solid var(--border);
  border-radius: 14px;
  padding: 0 20px;
  height: 95px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: none;
  transition: border-color .18s, box-shadow .18s, transform .15s;
  position: relative;
  animation: mp-fadeIn .3s ease both;
}
@keyframes mp-fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
.mp-item:hover { border-color: var(--a1); box-shadow: 0 4px 16px rgba(124,58,237,.1); }
.mp-item.selected { border-color: var(--p); box-shadow: 0 0 0 2px rgba(124,58,237,.15); background: #faf9ff; }

.mp-item-icon-wrap { width: 44px; height: 44px; background: #f5f3ff; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.mp-item-emoji { font-size: 20px; }

.mp-item-body { flex: 1; min-width: 0; }
.mp-item-name { font-size: 14px; font-weight: 700; color: var(--txt); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px; }
.mp-item-company { font-size: 11px; color: #9ca3af; margin-bottom: 6px; }
.mp-item-tags { display: flex; gap: 6px; flex-wrap: wrap; }

.mp-tag { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 20px; white-space: nowrap; display: inline-flex; align-items: center; }

.mp-item-dose-col { text-align: right; flex-shrink: 0; width: 200px; }
.mp-dose-label { font-size: 10px; font-weight: 600; color: #9ca3af; margin-bottom: 3px; }
.mp-dose-val { font-size: 12px; font-weight: 600; color: var(--txt); margin-bottom: 4px; }
.mp-memo-btn { font-size: 11px; color: var(--p); cursor: none; }

.mp-item-del { width: 28px; height: 28px; background: #f3f4f6; border: none; border-radius: 8px; color: #9ca3af; font-size: 12px; cursor: none; transition: all .18s; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-left: 8px; }
.mp-item-del:hover { background: #fee2e2; color: #ef4444; }

/* ── 하단 버튼 ── */
.mp-bottom { position: sticky; bottom: 0; }
.mp-btn-schedule { width: 100%; padding: 18px; background: linear-gradient(135deg,var(--p),#818cf8); color: #fff; border: none; border-radius: 14px; font-family: var(--fn); font-size: 17px; font-weight: 700; cursor: none; box-shadow: 0 6px 22px rgba(124,58,237,.35); transition: transform .2s, box-shadow .2s; letter-spacing: .02em; }
.mp-btn-schedule:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(124,58,237,.45); }
.mp-btn-schedule:active { transform: scale(.98); }

/* ── 오른쪽 디테일 패널 ── */
.mp-detail {
  width: var(--detail-w);
  flex-shrink: 0;
  background: #fff;
  border-left: 1px solid var(--border);
  overflow-y: auto;
  padding: 20px 18px 28px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.mp-detail-back { font-size: 12px; color: var(--sub2); margin-bottom: 18px; cursor: none; }
.mp-detail-empty { display: flex; align-items: center; justify-content: center; height: 200px; font-size: 13px; color: var(--sub); text-align: center; line-height: 1.8; }

.mp-detail-drug-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 20px; }
.mp-detail-drug-icon { width: 44px; height: 44px; background: linear-gradient(135deg,#f0eeff,#ede9fe); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
.mp-detail-drug-name { font-size: 15px; font-weight: 800; color: var(--txt); margin-bottom: 3px; line-height: 1.3; }
.mp-detail-drug-company { font-size: 11px; color: #9ca3af; margin-bottom: 7px; }
.mp-detail-tags { display: flex; gap: 5px; flex-wrap: wrap; }

.mp-detail-section { margin-bottom: 16px; padding-bottom: 14px; border-bottom: 0.8px solid var(--border); }
.mp-detail-section:last-of-type { border-bottom: none; }
.mp-detail-section-title { font-size: 11px; font-weight: 700; color: var(--sub2); margin-bottom: 7px; }
.mp-detail-section-content { font-size: 12px; color: var(--txt); line-height: 1.7; }

.mp-detail-back-btn { width: 100%; padding: 12px; background: #f5f3ff; border: none; border-radius: 10px; font-family: var(--fn); font-size: 13px; font-weight: 700; color: var(--p); cursor: none; transition: background .18s; margin-top: 4px; }
.mp-detail-back-btn:hover { background: var(--pl); }
`;
