import { useEffect } from 'react';

export default function ConfirmModal({ message, onConfirm, onCancel }) {
    // ESC 키로 닫기
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onCancel();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onCancel]);

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
        }}>
            <div style={{
                backgroundColor: '#fff',
                padding: '24px 30px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                textAlign: 'center',
                width: '300px',
            }}>
                <p style={{ marginBottom: '24px', fontSize: '16px' }}>{message}</p>
                <button
                    onClick={onConfirm}
                    style={{ marginRight: '10px', padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px' }}
                >
                    확인
                </button>
                <button
                    onClick={onCancel}
                    style={{ padding: '8px 16px', background: '#ccc', border: 'none', borderRadius: '6px' }}
                >
                    취소
                </button>
            </div>
        </div>
    );
}
