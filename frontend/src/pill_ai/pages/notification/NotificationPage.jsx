import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
/*
  MediPocket — 알림 페이지 (피그마 디자인 그대로)
  ──────────────────────────────────────────────
  사용법:
    import NotificationPage from './NotificationPage';
    <Route path="/app/notifications" element={<NotificationPage />} />
*/

function useCursor() {
  const [cursor, setCursor] = useState({ x: -200, y: -200 });
  const [ring,   setRing  ] = useState({ x: -200, y: -200 });
  const ringPos = useRef({ x: -200, y: -200 });
  const raf = useRef(null);
  useEffect(() => {
    const fn = e => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
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

const NOTIFS = {
  오늘: [
    {
      id: 1,
      iconBg: "#fef3c7",
      icon: "⚠️",
      titleColor: "#ef4444",
      title: "상호작용 주의 — 병용금기 경고",
      desc: "아스피린프로텍트정과 타이레놀정을 동시 복용 시 위장 장애 위험이 증가합니다. 의사나 약사와 상담하세요.",
      time: "오전 09:15",
      action: "확인하기",
      unread: true,
      category: "병용금기",
    },
    {
      id: 2,
      iconBg: "#fff7ed",
      icon: "💊",
      titleColor: "#f97316",
      title: "복약 알림 — 18:00 저녁 복약 시간",
      desc: "오메가3파워업 rTG서큐온캡슐 1g 복용 시간입니다. 식후에 복용해 주세요.",
      time: "오후 06:00",
      action: "복용 완료",
      unread: true,
      category: "복약",
    },
    {
      id: 3,
      iconBg: "#ede9fe",
      icon: "📅",
      titleColor: "#7c3aed",
      title: "다음 진료일 — 4일 후",
      desc: "6월 15일 (토) 14:00 · 서울내과의원 — 예약된 진료일이 다가왔습니다.",
      time: "오전 08:00",
      action: "일정 보기",
      unread: false,
      category: "진료",
    },
  ],
  어제: [
    {
      id: 4,
      iconBg: "#d1fae5",
      icon: "✅",
      titleColor: "#059669",
      title: "복약 달성 — 하루 목표 완료!",
      desc: "어제 복약 목표를 100% 달성했습니다. 5일 연속 달성 중이에요! 👏",
      time: "어제 오후 09:05",
      action: null,
      unread: false,
      category: "복약",
    },
    {
      id: 5,
      iconBg: "#ede9fe",
      icon: "🔗",
      titleColor: "#1a1433",
      title: "의료진 공유 링크 조회",
      desc: "공유한 복약 목록이 1회 열람되었습니다. (IP: 211.xxx.xxx.xx)",
      time: "어제 오후 02:33",
      action: null,
      unread: false,
      category: "시스템",
    },
  ],
  "이번 주": [
    {
      id: 6,
      iconBg: "#f3f4f6",
      icon: "📋",
      titleColor: "#1a1433",
      title: "DUR 데이터 업데이트",
      desc: "식약처 DUR 공공데이터가 업데이트되었습니다. 병용금기 정보가 최신화되었어요.",
      time: "6월 8일",
      action: null,
      unread: false,
      category: "시스템",
    },
  ],
};

const TABS = ["전체", "복약", "병용금기", "진료", "시스템"];

export default function NotificationPage() {
  const navigate = useNavigate();
  const { cursor, ring } = useCursor();
  const [activeTab, setActiveTab] = useState("전체");

  const filtered = items =>
    activeTab === "전체" ? items : items.filter(n => n.category === activeTab);

  return (
    <>
      <style>{CSS}</style>
      <div className="np-cursor"      style={{ left: cursor.x, top: cursor.y }} />
      <div className="np-cursor-ring" style={{ left: ring.x,   top: ring.y   }} />

      <div className="np-root">

        {/* ══ 상단 NAV ══ */}
        <header className="np-topnav">
          <div className="np-topnav-logo">
            <div className="np-logo-icon">💊</div>
            <span className="np-logo-text">MediPocket</span>
          </div>
          <div className="np-topnav-right">
            <div className="np-topnav-date"><span>📅</span><span>2024.06.11</span></div>
            <div style={{ position:"relative" }}>
              <button className="np-icon-btn">🔔<span className="np-notif-badge">2</span></button>
            </div>
            <div className="np-avatar">민지</div>
          </div>
        </header>

        <div className="np-body">

          {/* ══ 사이드바 ══ */}
          <aside className="np-sidebar">
            <div className="np-sb-section">메인</div>
            {[
              { icon:"🏠", label:"홈",       on:false, path: "/app/home"},
              { icon:"🔍", label:"약 검색",   on:false, path: "/app/search"},
              { icon:"🤍", label:"내 약함",   on:false, path: "/app/cabinet"},
              { icon:"⏱",  label:"병용 확인", on:false, path: "/app/home"},
            ].map((m, i) => (
              <div key={i} className={`np-nav${m.on ? " on" : ""}` } onClick={() => navigate(m.path)} >
                <span className="np-nav-ic">{m.icon}</span>
                <span className="np-nav-lbl">{m.label}</span>
              </div>
            ))}
            <div className="np-sb-section" style={{ marginTop:16 }}>관리</div>
            {[
              { icon:"🔔", label:"알림",       on:true,  badge:"2",path: "/app/Notification" },
              { icon:"🔗", label:"의료진 공유", on:false, badge:null, path: "/app/home" },
              { icon:"⚙️", label:"설정",        on:false, badge:null, path: "/app/setting" },
            ].map((m, i) => (
              <div key={i} className={`np-nav${m.on ? " on" : ""}`} onClick={() => navigate(m.path)}>
                <span className="np-nav-ic">{m.icon}</span>
                <span className="np-nav-lbl">{m.label}</span>
                {m.badge && <span className="np-nav-badge">{m.badge}</span>}
              </div>
            ))}
            <div className="np-sb-user">
              <div className="np-sb-av">민지</div>
              <div>
                <div className="np-sb-name">김민지</div>
                <div className="np-sb-role">일반 사용자</div>
              </div>
            </div>
          </aside>

          {/* ══ 메인 ══ */}
          <main className="np-main">

            <div className="np-page-title">
              <span style={{ fontSize:26 }}>🔔</span>
              <span className="np-title-text">알림</span>
            </div>
            <div className="np-page-desc">복약, 병용금기, 진료 일정 등 중요한 알림을 확인하세요.</div>

            <div className="np-tabs">
              {TABS.map(t => (
                <button key={t} className={`np-tab${activeTab === t ? " on" : ""}`} onClick={() => setActiveTab(t)}>{t}</button>
              ))}
            </div>

            {Object.entries(NOTIFS).map(([group, items]) => {
              const list = filtered(items);
              if (!list.length) return null;
              return (
                <div key={group} className="np-group">
                  <div className="np-group-label">{group}</div>
                  <div className="np-notif-list">
                    {list.map(n => (
                      <div key={n.id} className={`np-notif-item${n.unread ? " unread" : ""}`}>
                        <div className="np-notif-icon" style={{ background: n.iconBg }}>{n.icon}</div>
                        <div className="np-notif-body">
                          <div className="np-notif-title" style={{ color: n.titleColor }}>{n.title}</div>
                          <div className="np-notif-desc">{n.desc}</div>
                          <div className="np-notif-footer">
                            <span className="np-notif-time">{n.time}</span>
                            {n.action && <button className="np-notif-action">{n.action}</button>}
                          </div>
                        </div>
                        {n.unread && <div className="np-unread-dot" />}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

          </main>
        </div>
      </div>
    </>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
:root{
  --p:#7c3aed;--pl:#ede9fe;--a1:#a78bfa;--a2:#f9a8d4;
  --txt:#1a1433;--sub:#6b5f8a;--gray:#9ca3af;--bd:#e9e7f5;
  --bg:#f4f3ff;--fn:'Plus Jakarta Sans',sans-serif;
}
html,body{width:100%;min-height:100vh;cursor:none;font-family:var(--fn);background:var(--bg);}
.np-cursor{width:10px;height:10px;border-radius:50%;background:var(--a1);position:fixed;z-index:9999;pointer-events:none;transform:translate(-50%,-50%);mix-blend-mode:multiply;}
.np-cursor-ring{width:32px;height:32px;border-radius:50%;border:1px solid var(--a1);position:fixed;z-index:9998;pointer-events:none;transform:translate(-50%,-50%);opacity:.4;}
.np-root{display:flex;flex-direction:column;width:100%;min-height:100vh;}
.np-topnav{height:72px;background:#fff;border-bottom:0.8px solid var(--bd);display:flex;align-items:center;justify-content:space-between;padding:0 32px;position:sticky;top:0;z-index:100;flex-shrink:0;}
.np-topnav-logo{display:flex;align-items:center;gap:10px;}
.np-logo-icon{width:40px;height:40px;background:linear-gradient(135deg,var(--a1),var(--a2));border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;animation:npPulse 3s ease-in-out infinite;}
@keyframes npPulse{0%,100%{box-shadow:0 4px 12px rgba(167,139,250,.38)}50%{box-shadow:0 4px 20px rgba(167,139,250,.6)}}
.np-logo-text{font-size:22px;font-weight:800;color:var(--txt);}
.np-topnav-right{display:flex;align-items:center;gap:16px;}
.np-topnav-date{display:flex;align-items:center;gap:6px;font-size:14px;font-weight:600;color:var(--sub);background:#f9f8ff;padding:7px 14px;border-radius:20px;border:0.8px solid var(--bd);}
.np-icon-btn{width:38px;height:38px;border-radius:50%;background:#f9f8ff;border:0.8px solid var(--bd);cursor:none;font-size:17px;display:flex;align-items:center;justify-content:center;position:relative;transition:background .2s;font-family:var(--fn);}
.np-icon-btn:hover{background:var(--pl);}
.np-notif-badge{position:absolute;top:-2px;right:-2px;width:18px;height:18px;border-radius:50%;background:#ef4444;color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;}
.np-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--a1),var(--p));color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;cursor:none;}
.np-body{display:flex;flex:1;}
.np-sidebar{width:200px;background:#fff;border-right:0.8px solid var(--bd);display:flex;flex-direction:column;padding:16px 0 20px;position:sticky;top:72px;height:calc(100vh - 72px);flex-shrink:0;}
.np-sb-section{padding:8px 20px 4px;font-size:11px;font-weight:700;color:var(--gray);letter-spacing:1px;text-transform:uppercase;}
.np-nav{display:flex;align-items:center;gap:10px;margin:2px 10px;padding:10px 12px;border-radius:12px;cursor:none;transition:all .2s;position:relative;}
.np-nav:hover{background:#f9f8ff;}
.np-nav.on{background:var(--pl);}
.np-nav-ic{font-size:15px;width:18px;text-align:center;flex-shrink:0;}
.np-nav-lbl{font-size:14px;font-weight:500;color:var(--sub);}
.np-nav.on .np-nav-lbl{color:var(--p);font-weight:700;}
.np-nav-badge{margin-left:auto;background:#ef4444;color:#fff;font-size:10px;font-weight:700;padding:2px 6px;border-radius:8px;}
.np-sb-user{margin-top:auto;padding:12px 10px;display:flex;align-items:center;gap:10px;}
.np-sb-av{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--a1),var(--p));color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.np-sb-name{font-size:13px;font-weight:700;color:var(--txt);}
.np-sb-role{font-size:11px;color:var(--gray);margin-top:2px;}
.np-main{flex:1;padding:32px 40px 48px;display:flex;flex-direction:column;gap:20px;min-width:0;}
.np-page-title{display:flex;align-items:center;gap:10px;}
.np-title-text{font-size:28px;font-weight:800;color:var(--txt);}
.np-page-desc{font-size:14px;color:var(--sub);margin-top:-10px;}
.np-tabs{display:flex;gap:8px;flex-wrap:wrap;}
.np-tab{padding:8px 22px;border-radius:50px;font-family:var(--fn);font-size:13px;font-weight:600;cursor:none;border:0.8px solid var(--bd);background:#fff;color:var(--sub);transition:all .2s;}
.np-tab.on{background:var(--p);color:#fff;border-color:var(--p);box-shadow:0 4px 12px rgba(124,58,237,.3);}
.np-tab:hover:not(.on){background:var(--pl);border-color:var(--a1);color:var(--p);}
.np-group{display:flex;flex-direction:column;gap:10px;}
.np-group-label{font-size:13px;font-weight:600;color:var(--gray);}
.np-notif-list{display:flex;flex-direction:column;gap:8px;}
.np-notif-item{background:#fff;border:0.8px solid var(--bd);border-radius:16px;padding:18px 20px;display:flex;align-items:flex-start;gap:14px;position:relative;transition:box-shadow .2s,transform .2s;cursor:none;overflow:hidden;}
.np-notif-item::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:transparent;border-radius:3px 0 0 3px;}
.np-notif-item.unread::before{background:var(--p);}
.np-notif-item:hover{box-shadow:0 4px 16px rgba(120,80,200,.1);transform:translateY(-1px);}
.np-notif-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
.np-notif-body{flex:1;min-width:0;}
.np-notif-title{font-size:15px;font-weight:700;margin-bottom:5px;line-height:1.3;}
.np-notif-desc{font-size:13px;color:var(--sub);line-height:1.6;margin-bottom:8px;}
.np-notif-footer{display:flex;align-items:center;gap:12px;}
.np-notif-time{font-size:12px;color:var(--gray);}
.np-notif-action{background:var(--pl);color:var(--p);border:none;border-radius:20px;padding:5px 14px;font-family:var(--fn);font-size:12px;font-weight:600;cursor:none;transition:all .2s;}
.np-notif-action:hover{background:var(--p);color:#fff;}
.np-unread-dot{width:9px;height:9px;border-radius:50%;background:var(--p);flex-shrink:0;margin-top:4px;}
`;
