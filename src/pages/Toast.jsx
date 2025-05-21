import { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => onClose(), 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const backgroundColors = {
        success: '#4CAF50',
        error: '#F44336',
        warning: '#FF9800',
        info: '#2196F3'
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: backgroundColors[type] || backgroundColors.info,
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <span style={{ flexGrow: 1 }}>{message}</span>
            <button
                onClick={onClose}
                style={{
                    marginLeft: '12px',
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    fontSize: '16px',
                    cursor: 'pointer'
                }}
            >
                ✖
            </button>
        </div>
    );
}
