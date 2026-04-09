import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
/*
  MediPocket — 병용 확인 페이지 (피그마 디자인 그대로)
  ────────────────────────────────────────────────
  사용법:
    import CheckPage from './CheckPage';
    <Route path="/app/check" element={<CheckPage />} />
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

/* ── 비커 SVG 컴포넌트 ── */
function Beaker({ color1, color2, pillColor, pillShape, animate }) {
  return (
    <svg width="160" height="200" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`bg-${color1}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color1} stopOpacity="0.7"/>
          <stop offset="100%" stopColor={color2} stopOpacity="0.9"/>
        </linearGradient>
        <clipPath id={`beaker-clip-${color1}`}>
          <path d="M28 56 L28 152 Q28 172 48 172 L112 172 Q132 172 132 152 L132 56 Z"/>
        </clipPath>
      </defs>

      {/* 비커 몸통 배경 */}
      <path d="M28 56 L28 152 Q28 172 48 172 L112 172 Q132 172 132 152 L132 56 Z"
        fill={`url(#bg-${color1})`} />

      {/* 액체 반짝임 */}
      <path d="M40 130 Q80 118 120 130 L120 172 Q100 172 80 172 Q60 172 40 172 Z"
        fill={color2} opacity="0.35"/>

      {/* 비커 테두리 */}
      <path d="M28 56 L28 152 Q28 172 48 172 L112 172 Q132 172 132 152 L132 56"
        stroke="white" strokeWidth="2.5" strokeOpacity="0.6" fill="none" strokeLinecap="round"/>

      {/* 비커 입구 */}
      <rect x="20" y="44" width="120" height="16" rx="8"
        fill="white" fillOpacity="0.4"/>
      <rect x="20" y="44" width="120" height="16" rx="8"
        stroke="white" strokeWidth="1.5" strokeOpacity="0.5" fill="none"/>

      {/* 비커 목 */}
      <rect x="40" y="28" width="80" height="20" rx="4"
        fill="white" fillOpacity="0.25"/>

      {/* 반짝임 하이라이트 */}
      <ellipse cx="52" cy="80" rx="6" ry="18" fill="white" opacity="0.2" transform="rotate(-15 52 80)"/>

      {/* 알약 */}
      {pillShape === "capsule" ? (
        <g transform={`translate(52, 52) ${animate ? "" : ""}`}
          style={{ animation: animate ? "ck-pill-float 2.8s ease-in-out infinite" : "none" }}>
          <rect x="0" y="0" width="56" height="24" rx="12" fill="white" opacity="0.95"/>
          <rect x="0" y="0" width="28" height="24" rx="12" fill={pillColor} opacity="0.9"/>
          <rect x="24" y="0" width="32" height="24" rx="12"
            fill="white" opacity="0.0" stroke="white" strokeWidth="0"/>
          <ellipse cx="14" cy="12" rx="10" ry="10" fill={pillColor} opacity="0.9"/>
        </g>
      ) : (
        <g transform="translate(55, 52)"
          style={{ animation: animate ? "ck-pill-float 3.2s ease-in-out infinite 0.4s" : "none" }}>
          <ellipse cx="25" cy="12" rx="22" ry="12" fill="white" opacity="0.95"/>
          <ellipse cx="14" cy="12" rx="12" ry="12" fill={pillColor} opacity="0.85"/>
          <ellipse cx="14" cy="12" rx="6" ry="6" fill="white" opacity="0.3"/>
        </g>
      )}
    </svg>
  );
}

/* ── 경고 비커 SVG ── */
function WarningBeaker() {
  return (
    <svg width="160" height="200" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="warn-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.85"/>
        </linearGradient>
      </defs>

      {/* 비커 몸통 */}
      <path d="M28 56 L28 152 Q28 172 48 172 L112 172 Q132 172 132 152 L132 56 Z"
        fill="url(#warn-bg)"/>

      {/* 거품 효과 */}
      <circle cx="55" cy="120" r="8" fill="#fbbf24" opacity="0.4"
        style={{ animation:"ck-bubble 2s ease-in-out infinite" }}/>
      <circle cx="85" cy="105" r="5" fill="#fbbf24" opacity="0.35"
        style={{ animation:"ck-bubble 2.4s ease-in-out infinite 0.6s" }}/>
      <circle cx="105" cy="125" r="6" fill="#fbbf24" opacity="0.3"
        style={{ animation:"ck-bubble 1.8s ease-in-out infinite 1.2s" }}/>

      {/* 액체 */}
      <path d="M40 135 Q80 122 120 135 L120 172 Q80 172 40 172 Z"
        fill="#f59e0b" opacity="0.3"/>

      {/* 테두리 */}
      <path d="M28 56 L28 152 Q28 172 48 172 L112 172 Q132 172 132 152 L132 56"
        stroke="white" strokeWidth="2.5" strokeOpacity="0.55" fill="none" strokeLinecap="round"/>

      {/* 비커 입구 */}
      <rect x="20" y="44" width="120" height="16" rx="8"
        fill="white" fillOpacity="0.35"/>
      <rect x="20" y="44" width="120" height="16" rx="8"
        stroke="white" strokeWidth="1.5" strokeOpacity="0.4" fill="none"/>

      {/* 비커 목 */}
      <rect x="40" y="28" width="80" height="20" rx="4"
        fill="white" fillOpacity="0.2"/>

      {/* 경고 삼각형 */}
      <g style={{ animation:"ck-warn-pulse 1.6s ease-in-out infinite" }}>
        <polygon points="80,64 104,104 56,104" fill="#fbbf24" opacity="0.9"/>
        <polygon points="80,64 104,104 56,104"
          fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.7"/>
        <text x="80" y="100" textAnchor="middle" fill="white" fontSize="22" fontWeight="700"
          fontFamily="Plus Jakarta Sans, sans-serif">!</text>
      </g>
    </svg>
  );
}

/* ── 결과 카드 ── */
function ResultCard({ result }) {
  if (!result) return null;

  const cfg = {
    warning: { bg:"#fffbeb", border:"rgba(251,191,36,0.4)", icon:"⚠️", iconBg:"rgba(251,191,36,0.2)", titleColor:"#92400e" },
    danger:  { bg:"#fef2f2", border:"rgba(239,68,68,0.3)",  icon:"🚫", iconBg:"rgba(239,68,68,0.15)", titleColor:"#991b1b" },
    safe:    { bg:"#f0fdf4", border:"rgba(16,185,129,0.3)", icon:"✅", iconBg:"rgba(16,185,129,0.15)", titleColor:"#065f46" },
  }[result.type];

  return (
    <div style={{
      background: cfg.bg,
      border: `0.8px solid ${cfg.border}`,
      borderRadius: 16,
      padding: "28px 32px",
      display: "flex",
      gap: 20,
      animation: "ck-fadeup 0.4s ease both",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12, background: cfg.iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, flexShrink: 0, marginTop: 4,
      }}>{cfg.icon}</div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: cfg.titleColor, marginBottom: 6 }}>
          {result.title}
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1433", marginBottom: 8 }}>
          {result.pair}
        </div>
        <div style={{ fontSize: 15, color: "#6b5f8a", lineHeight: 1.7, marginBottom: 10 }}>
          {result.desc}
        </div>
        <div style={{ fontSize: 13, color: "#9ca3af" }}>
          📋 {result.source}
        </div>
      </div>
    </div>
  );
}

/* ── 병용 확인 데이터 ── */
const DUR_DB = {
  "칼슘": { "레보티록신": { type:"warning", title:"복용 간격 주의 (4시간)", pair:"칼슘제 + 레보티록신", desc:"칼슘제와 레보티록신을 동시에 복용하면 레보티록신의 흡수가 크게 줄어들 수 있습니다. 레보티록신 복용 후 최소 4시간 후에 칼슘제를 복용하세요.", source:"DUR 품목정보 · e약은요 · 확신도 High" }},
  "아스피린": { "타이레놀": { type:"warning", title:"상호작용 주의 — 위장 장애", pair:"아스피린 + 타이레놀", desc:"아스피린프로텍트정과 타이레놀정을 동시 복용 시 위장 장애 위험이 증가합니다. 의사나 약사와 상담하세요.", source:"DUR 품목정보 · e약은요 · 확신도 High" }},
  "와파린": { "아스피린": { type:"danger", title:"병용 금기 — 출혈 위험", pair:"와파린 + 아스피린", desc:"와파린과 아스피린의 병용은 출혈 위험을 크게 높입니다. 반드시 의사와 상담 후 복용하세요.", source:"DUR 품목정보 · 병용금기 1등급" }},
};

function checkDUR(a, b) {
  const ka = Object.keys(DUR_DB).find(k => a.includes(k) || k.includes(a));
  if (!ka) return null;
  const kb = Object.keys(DUR_DB[ka]).find(k => b.includes(k) || k.includes(b));
  if (!kb) {
    const kb2 = Object.keys(DUR_DB).find(k => b.includes(k) || k.includes(b));
    if (kb2) {
      const ka2 = Object.keys(DUR_DB[kb2]).find(k => a.includes(k) || k.includes(a));
      if (ka2) return DUR_DB[kb2][ka2];
    }
    return { type:"safe", title:"병용 가능", pair:`${a} + ${b}`, desc:"현재 DUR 데이터에서 두 약물 간 주요 상호작용이 발견되지 않았습니다. 단, 개인차가 있으므로 필요시 약사 또는 의사에게 문의하세요.", source:"DUR 품목정보 · 확신도 Medium" };
  }
  return DUR_DB[ka][kb];
}

export default function CheckPage() {
  const navigate = useNavigate();
  const { cursor, ring } = useCursor();
  const [drugA,   setDrugA  ] = useState("칼슘제");
  const [drugB,   setDrugB  ] = useState("레보티록신");
  const [result,  setResult ] = useState(null);
  const [checked, setChecked] = useState(false);
  const [aFocus,  setAFocus ] = useState(false);
  const [bFocus,  setBFocus ] = useState(false);

  const handleCheck = () => {
    if (!drugA.trim() || !drugB.trim()) return;
    const r = checkDUR(drugA.trim(), drugB.trim()) || {
      type:"safe", title:"병용 가능", pair:`${drugA} + ${drugB}`,
      desc:"현재 DUR 데이터에서 두 약물 간 주요 상호작용이 발견되지 않았습니다. 단, 개인차가 있으므로 필요시 약사 또는 의사에게 문의하세요.",
      source:"DUR 품목정보 · 확신도 Medium",
    };
    setResult(r);
    setChecked(true);
  };

  const hasWarning = checked && result && result.type !== "safe";

  return (
    <>
      <style>{CSS}</style>
      <div className="ck-cursor"      style={{ left: cursor.x, top: cursor.y }} />
      <div className="ck-cursor-ring" style={{ left: ring.x,   top: ring.y   }} />

      <div style={{ display:"flex", height:"100vh", background:"#f0eeff", fontFamily:"'Plus Jakarta Sans',sans-serif", overflow:"hidden" }}>

        {/* ══ 사이드바 ══ */}
        <nav style={{ width:200, background:"#fff", borderRight:"0.8px solid #e9e7f5", display:"flex", flexDirection:"column", padding:"16px 0 20px", flexShrink:0, overflow:"hidden" }}>
          {/* 로고 */}
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 18px 20px" }}>
            <div style={{ width:36, height:36, background:"linear-gradient(135deg,#a78bfa,#f9a8d4)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0, boxShadow:"0 4px 12px rgba(167,139,250,.38)", animation:"ck-pulse 3s ease-in-out infinite" }}>💊</div>
            <span style={{ fontSize:18, fontWeight:800, color:"#1a1433" }}>MediPocket</span>
          </div>

          <div style={{ padding:"0 20px 4px", fontSize:11, fontWeight:700, color:"#9ca3af", letterSpacing:1, textTransform:"uppercase" }}>메인</div>
          {[
            { icon:"🏠", label:"홈",       on:false, path: "/app/Home"  },
            { icon:"🔍", label:"약 검색",   on:false, path: "/app/search" },
            { icon:"🤍", label:"내 약함",   on:false, path: "/app/cabinet" },
            { icon:"⏱",  label:"병용 확인", on:true, path: "/app/check"  },
          ].map((m, i) => (
            <div key={i} onClick={() => navigate(m.path)} style={{ display:"flex", alignItems:"center", gap:10, margin:"2px 10px", padding:"10px 12px", borderRadius:12, background: m.on ? "#ede9fe" : "transparent", cursor:"none", transition:"background .2s" }}>
              <span style={{ fontSize:15, width:18, textAlign:"center" }}>{m.icon}</span>
              <span style={{ fontSize:14, fontWeight: m.on ? 700 : 500, color: m.on ? "#7c3aed" : "#6b5f8a" }}>{m.label}</span>
            </div>
          ))}

          <div style={{ padding:"16px 20px 4px", fontSize:11, fontWeight:700, color:"#9ca3af", letterSpacing:1, textTransform:"uppercase" }}>관리</div>
          {[
            { icon:"🔔", label:"알림",       badge:"2", path: "/app/notifications" },
            { icon:"🔗", label:"의료진 공유", badge:null, path: "/app/share" },
            { icon:"⚙️", label:"설정",        badge:null, path: "/app/setting" },
          ].map((m, i) => (
            <div key={i} onClick={() => navigate(m.path)} style={{ display:"flex", alignItems:"center", gap:10, margin:"2px 10px", padding:"10px 12px", borderRadius:12, cursor:"none" }}>
              <span style={{ fontSize:15, width:18, textAlign:"center" }}>{m.icon}</span>
              <span style={{ fontSize:14, fontWeight:500, color:"#6b5f8a" }}>{m.label}</span>
              {m.badge && <span style={{ marginLeft:"auto", background:"#ef4444", color:"#fff", fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:8 }}>{m.badge}</span>}
            </div>
          ))}

          {/* 유저 카드 */}
          <div style={{ marginTop:"auto", padding:"12px 10px", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#a78bfa,#7c3aed)", color:"#fff", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>민지</div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"#1a1433" }}>김민지</div>
              <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>일반 사용자</div>
            </div>
          </div>
        </nav>

        {/* ══ 메인 ══ */}
        <main style={{ flex:1, padding:"32px 36px", display:"flex", flexDirection:"column", gap:20, overflowY:"auto" }}>

          {/* 타이틀 */}
          <div>
            <div style={{ fontSize:26, fontWeight:800, color:"#1a1433", display:"flex", alignItems:"center", gap:8 }}>
              <span>🧪</span> 병용 확인
            </div>
            <div style={{ fontSize:14, color:"#9ca3af", marginTop:4 }}>두 가지 약을 입력하면 병용 가능 여부를 확인합니다</div>
          </div>

          {/* 인포바 */}
          <div style={{ background:"#fdfbff", border:"0.8px solid rgba(167,139,250,.2)", borderRadius:14, padding:"20px 28px", display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:44, height:44, borderRadius:10, background:"rgba(167,139,250,.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>💡</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:17, fontWeight:700, color:"#1a1433", marginBottom:4 }}>식약처 DUR 공공데이터 기반 실시간 병용 확인</div>
              <div style={{ fontSize:13, color:"#9ca3af" }}>식약처 DUR 공공데이터 기반 실시간 병용 확인!</div>
            </div>
            <div style={{ fontSize:20, fontWeight:800, color:"#1a1433", flexShrink:0 }}>2024.06.11</div>
          </div>

          {/* 비커 씬 카드 */}
          <div style={{ background:"#fdfbff", border:"0.8px solid rgba(255,255,255,.1)", borderRadius:14, padding:"40px 0 32px", display:"flex", flexDirection:"column", alignItems:"center", gap:0, flex:1, minHeight:360 }}>

            {/* 비커 3개 + 연산자 */}
            <div style={{ display:"flex", alignItems:"flex-end", gap:0, justifyContent:"center", width:"100%", paddingBottom:28 }}>

              {/* 비커 A */}
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
                <Beaker color1="#c4b5fd" color2="#7c3aed" pillColor="#7c3aed" pillShape="capsule" animate={true} />
                <div style={{
                  background:"#f5f3ff", border:"0.8px solid #a78bfa",
                  borderRadius:24, height:42, width:160,
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <input
                    value={drugA}
                    onChange={e => { setDrugA(e.target.value); setChecked(false); setResult(null); }}
                    onFocus={() => setAFocus(true)}
                    onBlur={() => setAFocus(false)}
                    placeholder="약 이름 입력"
                    style={{
                      border:"none", background:"transparent", textAlign:"center",
                      fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:14, fontWeight:600,
                      color:"#6b5f8a", outline:"none", width:"100%", cursor:"text",
                    }}
                  />
                </div>
              </div>

              {/* + */}
              <div style={{ fontSize:36, fontWeight:300, color:"#6b5f8a", paddingBottom:56, margin:"0 24px" }}>+</div>

              {/* 비커 B */}
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
                <Beaker color1="#fda4af" color2="#f43f5e" pillColor="#f43f5e" pillShape="circle" animate={true} />
                <div style={{
                  background:"#f5f3ff", border:"0.8px solid #a78bfa",
                  borderRadius:24, height:42, width:160,
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <input
                    value={drugB}
                    onChange={e => { setDrugB(e.target.value); setChecked(false); setResult(null); }}
                    onFocus={() => setBFocus(true)}
                    onBlur={() => setBFocus(false)}
                    placeholder="약 이름 입력"
                    style={{
                      border:"none", background:"transparent", textAlign:"center",
                      fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:14, fontWeight:600,
                      color:"#6b5f8a", outline:"none", width:"100%", cursor:"text",
                    }}
                  />
                </div>
              </div>

              {/* → */}
              <div style={{ fontSize:36, fontWeight:300, color:"#6b5f8a", paddingBottom:56, margin:"0 24px" }}>→</div>

              {/* 결과 비커 + 버튼 */}
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
                <WarningBeaker />
                <button
                  onClick={handleCheck}
                  style={{
                    height:49, width:175, borderRadius:30,
                    background: drugA && drugB ? "linear-gradient(135deg,#7c3aed,#a78bfa)" : "#e5e7eb",
                    border:"none", color: drugA && drugB ? "#fff" : "#9ca3af",
                    fontSize:15, fontWeight:700, cursor:"none",
                    fontFamily:"'Plus Jakarta Sans',sans-serif",
                    boxShadow: drugA && drugB ? "0 6px 22px rgba(124,58,237,.4)" : "none",
                    transition:"all .25s",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                  }}
                >
                  🧪 병용 확인
                </button>
              </div>
            </div>
          </div>

          {/* 결과 카드 */}
          {checked && result && <ResultCard result={result} />}

        </main>
      </div>
    </>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{width:100%;height:100%;cursor:none;font-family:'Plus Jakarta Sans',sans-serif;overflow:hidden;}

.ck-cursor{width:10px;height:10px;border-radius:50%;background:#a78bfa;position:fixed;z-index:9999;pointer-events:none;transform:translate(-50%,-50%);mix-blend-mode:multiply;}
.ck-cursor-ring{width:32px;height:32px;border-radius:50%;border:1px solid #a78bfa;position:fixed;z-index:9998;pointer-events:none;transform:translate(-50%,-50%);opacity:.4;}

@keyframes ck-pulse{0%,100%{box-shadow:0 4px 12px rgba(167,139,250,.38)}50%{box-shadow:0 4px 20px rgba(167,139,250,.62)}}
@keyframes ck-pill-float{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-8px) rotate(4deg)}}
@keyframes ck-bubble{0%{transform:translateY(0);opacity:.4}100%{transform:translateY(-40px);opacity:0}}
@keyframes ck-warn-pulse{0%,100%{opacity:.9}50%{opacity:.55}}
@keyframes ck-fadeup{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:rgba(167,139,250,.3);border-radius:2px;}
`;
