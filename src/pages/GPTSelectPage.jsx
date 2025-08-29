// src/pages/GPTSelectPage.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function GPTSelectPage() {
    const navigate = useNavigate();
    const [openSurveyDialog, setOpenSurveyDialog] = useState(false);

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

    const surveyData = [
        {
            title: '일반',
            items: [
                { label: '초등학생 사전 설문', url: 'https://form.kosac.re.kr/v/8GFHkSBvvGgkmOUUuI7a' },
                { label: '초등학생 사후 설문', url: 'https://form.kosac.re.kr/v/kJn9BEP1v9EFYuO0RPK0' },
                { label: '중 · 고등학생 사전 설문', url: 'https://form.kosac.re.kr/v/3yzQ5AMHj88ndqPgVOad' },
                { label: '중 · 고등학생 사후 설문', url: 'https://form.kosac.re.kr/v/4pwHhu0dynMno07X6lpu' },
            ],
        },
        {
            title: '사회적 배려자(다문화)',
            items: [
                { label: '초등학생 사전 설문', url: 'https://form.kosac.re.kr/v/neWf7Vlf0s50sp1HmuYF' },
                { label: '초등학생 사후 설문', url: 'https://form.kosac.re.kr/v/8BuMJjSG27BmsBa3iwRb' },
                { label: '중 · 고등학생 사전 설문', url: 'https://form.kosac.re.kr/v/aOCneQTXFOMnWn2jjPta' },
                { label: '중 · 고등학생 사후 설문', url: 'https://form.kosac.re.kr/v/pRsBA7SF4WAzqpMlnBea' },
            ],
        },
        {
            title: '사회적 배려자(도서벽지)',
            items: [
                { label: '초등학생 사전 설문', url: 'https://form.kosac.re.kr/v/6a0CMAWByrvvBC80pu5t' },
                { label: '초등학생 사후 설문', url: 'https://form.kosac.re.kr/v/n6IeILrcfFBpprHcTx2A' },
                { label: '중 · 고등학생 사전 설문', url: 'https://form.kosac.re.kr/v/dvvhaDShrpPiE0Xusnvv' },
                { label: '중 · 고등학생 사후 설문', url: 'https://form.kosac.re.kr/v/Zg0VOAwZnUHXA9SNw7Fx' },
            ],
        },
        {
            title: '사회적 배려자(특수교육)',
            items: [
                { label: '초등학생 사전 설문', url: 'https://form.kosac.re.kr/v/FeBldKEyBRxqOkhW4KxF' },
                { label: '초등학생 사후 설문', url: 'https://form.kosac.re.kr/v/2lZUJDjG5bDXswXOFvcA' },
                { label: '중 · 고등학생 사전 설문', url: 'https://form.kosac.re.kr/v/YTOkEa3ZJ2VXogD70a5x' },
                { label: '중 · 고등학생 사후 설문', url: 'https://form.kosac.re.kr/v/LkGvOHCzHnDtLrq3GMOH' },
            ],
        },
    ]

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
                    margin: '90px auto 0',
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
                            path: 'https://api-418454234889.us-west1.run.app/',
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

                {/* 📊 설문조사 버튼 */}
                <div style={{ marginTop: '80px' }}>
                    <button
                        onClick={() => setOpenSurveyDialog(true)}
                        style={{
                            ...logoutButtonStyle,
                            fontSize: '20px',
                            padding: '15px 30px',
                            fontWeight: '700',
                            backgroundColor: '#dfe6e9',
                        }}
                        onMouseOver={(e) => (e.target.style.backgroundColor = '#d0d6d9')}
                        onMouseOut={(e) => (e.target.style.backgroundColor = '#dfe6e9')}
                    >
                        📊 설문조사 페이지로 이동
                    </button>
                </div>

                {/* 관리자 전용 */}
                {isAdmin && (
                    <div style={{ marginTop: '20px' }}>
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

            {/* 설문조사 팝업 */}
            {openSurveyDialog && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            padding: '40px',
                            borderRadius: '20px',
                            width: '90%',
                            maxWidth: '1000px',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                            fontFamily: 'inherit',
                            boxSizing: 'border-box',
                        }}
                    >
                        {/* 타이틀 + 닫기 버튼 */}
                        <div
                            style={{
                                position: 'relative',
                                paddingBottom: '10px',
                                marginBottom: '30px',
                                borderBottom: '2px solid #eee',
                            }}
                        >
                            <h2
                                style={{
                                    fontSize: '24px',
                                    color: '#2d3436',
                                    margin: 0,
                                    textAlign: 'center',
                                }}
                            >
                                📋 설문 유형을 선택해주세요
                            </h2>
                            <button
                                onClick={() => setOpenSurveyDialog(false)}
                                style={{
                                    position: 'absolute',
                                    top: -15,
                                    right: -15,
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#888',
                                }}
                                aria-label="닫기"
                            >
                                ✖
                            </button>
                        </div>

                        {/* 2x2 카테고리 그리드 */}
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '24px',
                                justifyContent: 'space-between',
                            }}
                        >
                            {surveyData.map((group, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        flex: '0 0 48%',
                                        backgroundColor: '#f8f9fc',
                                        borderRadius: '16px',
                                        padding: '16px 20px 24px 20px',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                        boxSizing: 'border-box',
                                        textAlign: 'center',
                                    }}
                                >
                                    <h4
                                        style={{
                                            margin: '0 0 16px 0',
                                            marginTop: '5px',
                                            fontSize: '20px',
                                            color: '#3498db',
                                            display: 'inline-block',
                                            textAlign: 'left',
                                        }}
                                    >
                                        {group.title}
                                    </h4>

                                    {/* 2행 2열 버튼 정렬 */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            justifyContent: 'space-between',
                                            gap: '10px',
                                            boxSizing: 'border-box',
                                        }}
                                    >
                                        {group.items.map((item, iidx) => (
                                            <a
                                                key={iidx}
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    width: 'calc(50% - 10px)',
                                                    minWidth: '140px',
                                                    backgroundColor: '#d0ebff',
                                                    padding: '12px',
                                                    borderRadius: '10px',
                                                    color: '#1c3d5a',
                                                    textDecoration: 'none',
                                                    fontWeight: '700',
                                                    fontSize: '15px',
                                                    textAlign: 'center',
                                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                                    transition: 'all 0.25s ease-in-out',
                                                    display: 'inline-block',
                                                    boxSizing: 'border-box',
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#74c0fc';
                                                    e.currentTarget.style.color = '#fff';
                                                    e.currentTarget.style.transform = 'scale(1.05)';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#d0ebff';
                                                    e.currentTarget.style.color = '#1c3d5a';
                                                    e.currentTarget.style.transform = 'scale(1)';
                                                }}
                                            >
                                                📎 {item.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}