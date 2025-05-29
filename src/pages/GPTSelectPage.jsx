// src/pages/GPTSelectPage.jsx
import { useNavigate } from 'react-router-dom';

export default function GPTSelectPage() {
    const navigate = useNavigate();

    const isAdmin = localStorage.getItem('role') === 'admin';
    const userId = localStorage.getItem('id'); // 👈 저장된 아이디 불러오기

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');
        localStorage.removeItem('id'); // 👈 아이디도 같이 제거
        // setIsLoggedIn(false);
        navigate('/login', { replace: true });

    };

    const gptButtonBaseStyle = {
        flex: 1,
        minWidth: '200px',
        padding: '140px 10px',
        fontSize: '18px',
        fontWeight: '600',
        // backgroundColor: '#e3f6e5', // 💚 연한 초록
        // color: '#2e7d32',           // 글자 진한 초록
        // border: '1px solid #c8e6c9',
        borderRadius: '16px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease, background-color 0.3s ease',
        transform: 'scale(1)',
    };

    const logoutButtonStyle = {
        backgroundColor: '#f0f0f0',
        color: '#444',
        border: '1px solid #ccc',
        padding: '10px 24px',
        fontSize: '16px',
        fontWeight: '700',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    };

    return (
        <div
            style={{
                height: '100vh',
                backgroundColor: '#f5f6fa',
                padding: '50px',
                boxSizing: 'border-box',
                position: 'relative',
            }}
        >
            {/* 🔑 사용자 ID */}
            <div style={{ position: 'absolute', top: 30, left: 30, fontSize: '16px', fontWeight: '700', color: '#444' }}>
                🔑 {userId}님
            </div>

            {/* 🚪 로그아웃 버튼 */}
            <button
                onClick={handleLogout}
                style={{
                    ...logoutButtonStyle,
                    position: 'absolute',
                    top: 30,
                    right: 30,
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#e4e4e4')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
            >
                로그아웃
            </button>

            {/* 중앙 영역 */}
            <div
                style={{
                    maxWidth: '1200px',
                    margin: '100px auto 0',
                    textAlign: 'center',
                }}
            >
                <h2 style={{ marginBottom: '80px', fontSize: '30px' }}>
                    🤖 <strong>사용하실 GPT 모드</strong>를 선택하세요
                </h2>

                <div
                    style={{
                        display: 'flex',
                        gap: '30px',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                    }}
                >
                    {[
                        {
                            icon: '💬',
                            title: '일반 GPT',
                            desc: '기본 지식 기반 응답',
                            path: '/gpt/general',
                            bgColor: '#e3f6e5',
                            textColor: '#2e7d32',
                            borderColor: '#c8e6c9',
                            external: false,
                        },
                        {
                            icon: '🎬',
                            title: '시나리오 GPT',
                            desc: '탄소 중립 시나리오 관련 응답',
                            path: '/gpt/scenario',
                            bgColor: '#fff0e6',
                            textColor: '#e86b1c',
                            borderColor: '#f5c7a5',
                            external: false,
                        },
                        {
                            icon: '🧩',
                            title: '정책카드 GPT',
                            desc: '탄소 중립 정책 카드 관련 응답',
                            path: '/gpt/policy',
                            bgColor: '#eaf3fb',
                            textColor: '#1976d2',
                            borderColor: '#c5ddf2',
                            external: false,
                        },
                        {
                            icon: '📖',
                            title: '시나리오 생성',
                            desc: '탄소 위기 시나리오 생성기',
                            path: 'https://service-418454234889.us-west1.run.app/',
                            bgColor: '#f9fbe7',
                            textColor: '#827717',
                            borderColor: '#cddc39',
                            external: true,
                        },
                        {
                            icon: '🎮',
                            title: '게임데이터 생성기',
                            desc: '탄소 퀴즈 게임데이터 생성 도우미',
                            path: 'https://service-611636061164.us-west1.run.app/',
                            bgColor: '#f3e5f5',
                            textColor: '#6a1b9a',
                            borderColor: '#ce93d8',
                            external: true,
                        },
                    ].map(({ icon, title, desc, path, bgColor, textColor, borderColor, external }) => (
                        <button
                            key={title}
                            onClick={() => {
                                if (external) {
                                    window.open(path, '_blank'); // 새 창으로 외부 링크 열기
                                } else {
                                    navigate(path); // 내부 라우팅
                                }
                            }}
                            style={{
                                ...gptButtonBaseStyle,
                                backgroundColor: bgColor,
                                color: textColor,
                                border: `1px solid ${borderColor}`,
                            }}
                            onMouseOver={(e) => {
                                // e.target.style.backgroundColor = '#d0efda';
                                e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseOut={(e) => {
                                // e.target.style.backgroundColor = '#e3f6e5';
                                e.target.style.transform = 'scale(1)';
                            }}
                        >
                            <div style={{ fontSize: '36px', marginBottom: '12px' }}>{icon}</div>
                            <div
                                style={{
                                    fontSize: '20px',
                                    fontWeight: '700',
                                    marginBottom: '6px',
                                    color: textColor,
                                }}
                            >
                                {title}
                            </div>
                            <div style={{ fontSize: '14px', color: '#555' }}>{desc}</div>
                        </button>
                    ))}
                </div>

                {/* 관리자 전용 */}
                {isAdmin && (
                    <div style={{ marginTop: '80px' }}>
                        <button
                            onClick={() => navigate('/admin')}
                            style={{
                                ...logoutButtonStyle,
                                fontSize: '20px',
                                fontWeight: '700',
                                padding: '15px 30px',
                                cursor: 'pointer',
                            }}
                            onMouseOver={(e) => (e.target.style.backgroundColor = '#e4e4e4')}
                            onMouseOut={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
                        >
                            ⚙️ 관리자 페이지로 이동
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}