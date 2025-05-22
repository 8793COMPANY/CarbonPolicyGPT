// src/App.jsx
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import GPTSelectPage from './pages/GPTSelectPage';
import GPTGeneralPage from './pages/GPTGeneralPage';
import GPTScenarioPage from './pages/GPTScenarioPage';
import GPTPolicyPage from './pages/GPTPolicyPage';
import AdminPage from './pages/AdminPage';

function App() {
  // 로그인 상태를 localStorage에서 동기적으로 초기화
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );

  // useEffect(() => {
  //   const saved = localStorage.getItem('isLoggedIn');
  //   if (saved === 'true') setIsLoggedIn(true);
  // }, []);

  // 보호된 페이지 처리(관리자 페이지 주소로 접속하지 못하도록 막는 부분까지 추가)
  const ProtectedRoute = ({ element, requireAdmin = false }) => {
    const isAdmin = localStorage.getItem('role') === 'admin';

    if (!isLoggedIn) return <Navigate to="/login" replace />;
    if (requireAdmin && !isAdmin) return <Navigate to="/gpt/select" replace />;

    return element;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <LoginPage
              onLoginSuccess={() => {
                setIsLoggedIn(true);
                localStorage.setItem('isLoggedIn', 'true');
              }}
            />
          }
        />
        <Route path="/gpt/select" element={<ProtectedRoute element={<GPTSelectPage />} />} />
        <Route path="/gpt/general" element={<ProtectedRoute element={<GPTGeneralPage />} />} />
        <Route path="/gpt/scenario" element={<ProtectedRoute element={<GPTScenarioPage />} />} />
        <Route path="/gpt/policy" element={<ProtectedRoute element={<GPTPolicyPage />} />} />
        <Route path="/admin" element={<ProtectedRoute element={<AdminPage />} requireAdmin={true} />} />

        {/* 잘못된 경로는 로그인으로 이동 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;