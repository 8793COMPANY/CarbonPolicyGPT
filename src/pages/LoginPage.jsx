// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';

export default function LoginPage({ onLoginSuccess }) {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const navigate = useNavigate();

    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    const handleLogin = async () => {
        setIsLoggingIn(true); // ✅ 로그인 시작 시 로딩 상태 true

        try {
            const response = await fetch('https://b0897huj58.execute-api.ap-northeast-2.amazonaws.com/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, pw }),
            });

            const data = await response.json();

            if (response.status === 200 && data.result === 'success') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('role', data.role); // 👈 관리자 여부 저장
                localStorage.setItem('id', id); // 👈 아이디 저장

                onLoginSuccess(); // 상태 변경 → isLoggedIn = true
                navigate('/gpt/select', { replace: true }); // GPT 선택 페이지로 이동
            } else {
                // alert('❌ 아이디 또는 비밀번호가 틀렸습니다.');
                showToast('❌ 아이디 또는 비밀번호가 틀렸습니다.', 'error');
                setId('');
                setPw('');
            }
        } catch (error) {
            console.error('❌ 로그인 요청 실패:', error);
            // alert('서버 오류가 발생했습니다. 다시 시도해주세요.');
            showToast('서버 오류가 발생했습니다. 다시 시도해주세요.', 'error');
        } finally {
            setIsLoggingIn(false); // ✅ 완료 시 로딩 상태 false
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // 페이지 새로고침 방지
        handleLogin();
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f5f6fa', // 💡 페이지 전체 배경
            }}
        >
            <div
                style={{
                    backgroundColor: '#fff',
                    padding: '40px',
                    borderRadius: '12px',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
                    width: '100%',
                    maxWidth: '400px', // 💡 너비는 제한해서 중앙 카드 느낌
                }}
            >
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
                    🔐 <span style={{ fontWeight: 'bold' }}>로그인</span>
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <input
                            type="text"
                            placeholder="아이디"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                fontSize: '16px',
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={pw}
                            onChange={(e) => setPw(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                fontSize: '16px',
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '16px',
                            backgroundColor: '#4CAF50',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                            opacity: isLoggingIn ? 0.6 : 1,
                        }}
                        onMouseOver={(e) => (e.target.style.backgroundColor = '#45A049')}
                        onMouseOut={(e) => (e.target.style.backgroundColor = '#4CAF50')}
                        disabled={isLoggingIn}
                    >
                        {isLoggingIn ? '로그인 중...' : '로그인'}
                    </button>
                </form>
            </div>

            {/* ✅ 토스트 메세지 */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}