// src/pages/GPTScenarioPage.jsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';

const BASE_URL = 'https://b0897huj58.execute-api.ap-northeast-2.amazonaws.com';

export default function GPTScenarioPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessageToGPT = async () => {
    if (!input.trim()) return;
    const promptType = '시나리오';

    console.log('📤 사용 프롬프트 유형:', promptType); // ✅ 프롬프트 유형 확인

    setIsLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content: input }]);

    try {
      const res = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptType, userMessage: input }),
      });

      const data = await res.json();

      // ✅ 에러 응답인 경우 사용자에게 토스트 표시
      if (data.result === 'fail') {
        showToast(data.message || '❌ 알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
        return;
      }

      console.log('📋 사용된 프롬프트 유형:', data.promptType); // ✅ 시트에서 불러온 프롬프트 확인
      console.log('📋 적용된 프롬프트 내용:', data.systemPrompt); // ✅ 시트에서 불러온 프롬프트 확인

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      setInput('');
    } catch (err) {
      // alert('❌ GPT 호출 실패');
      showToast('❌ GPT 호출 실패! 잠시 후 다시 시도해주세요.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <button
        onClick={() => navigate('/gpt/select')}
        style={{
          position: 'absolute',
          top: 30,
          left: 30,
          backgroundColor: 'transparent',
          color: '#ff8a65', // 감성 오렌지
          border: 'none',
          fontSize: '15px',
          fontWeight: '600',
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
      >
        ← GPT 선택으로 돌아가기
      </button>

      <h2 style={styles.header}>🎬 시나리오 GPT 채팅</h2>

      <div style={styles.chatBox} ref={chatBoxRef}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.role === 'user' ? '#ffe4d1' : '#f1f1f1',
              color: '#333', // 글씨는 진회색 통일
              border: '1px solid #ddd',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            }}
          >
            <span style={{ fontWeight: '600' }}>
              {msg.role === 'user' ? '👤 나' : '🤖 GPT'}:
            </span>{' '}
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div style={{ ...styles.message, alignSelf: 'center', backgroundColor: '#f1f1f1', color: '#333', border: '1px solid #ddd' }}>
            ⏳ GPT 응답 생성 중...
          </div>
        )}
      </div>

      <div style={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessageToGPT()}
          placeholder="메시지를 입력하세요..."
          style={styles.input}
        />
        <button onClick={sendMessageToGPT} style={styles.button}>
          전송
        </button>
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

const styles = {
  container: {
    height: '100vh',
    backgroundColor: '#fffaf3',
    color: '#333',
    padding: '40px',
    fontFamily: 'Pretendard, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  header: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '20px',
    color: '#ffab91',
    textAlign: 'center',
  },
  chatBox: {
    flex: 1,
    backgroundColor: '#fdf6ee',
    borderRadius: '12px',
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.05)',
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
    scrollBehavior: 'smooth',
  },
  message: {
    maxWidth: '80%',
    padding: '12px 16px',
    borderRadius: '12px',
    wordBreak: 'break-word',
  },
  inputArea: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    color: '#333',
    fontSize: '16px',
  },
  button: {
    backgroundColor: '#ff7043',
    color: '#fff',
    border: 'none',
    padding: '14px 20px',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};