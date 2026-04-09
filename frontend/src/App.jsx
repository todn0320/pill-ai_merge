import { Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./pill_ai/main.jsx";
import LandingPage from "./pill_ai/pages/landing/LandingPage.jsx";
import HomePage from "./pill_ai/pages/home/HomePage.jsx";
import SearchPage from "./pill_ai/pages/search/SearchPage.jsx";
import ServicePage from "./pill_ai/pages/service/ServicePage.jsx";
import LoginPage from "./pill_ai/pages/login/login.jsx";
import SignupPage from "./pill_ai/pages/signup/SignupPage.jsx";
import CabinetPage from "./pill_ai/pages/cabinet/Cabinet.jsx";
import Setting from "./pill_ai/pages/setting/MediPocketSettings.jsx";
import CheckPage from "./pill_ai/pages/check/CheckPage.jsx";
import NotificationsPage from "./pill_ai/pages/notification/NotificationPage.jsx";

function App() {
  return (
    <Routes>
      {/* ── 독립 페이지 (사이드바 없음) ── */}
      <Route path="/"        element={<LandingPage />} />
      <Route path="/service" element={<ServicePage />} />
      <Route path="/login"   element={<LoginPage />} />
      <Route path="/signup"  element={<SignupPage />} />

      {/* ── 앱 내부 페이지 (Main 사이드바 레이아웃) ── */}
      <Route path="/app" element={<Main />}>
        <Route index        element={<HomePage />} />
        <Route path="home"          element={<HomePage />} />
        <Route path="search"        element={<SearchPage />} />
        <Route path="cabinet"       element={<CabinetPage />} />
        <Route path="setting"       element={<Setting />} />
        <Route path="check"         element={<CheckPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>
    </Routes>
  );
}

export default App;