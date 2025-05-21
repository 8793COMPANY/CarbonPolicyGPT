import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';
import ConfirmModal from './ConfirmModal';

export default function AdminPage() {
    // 계정
    const [accounts, setAccounts] = useState([]);
    const [newAccount, setNewAccount] = useState({ id: '', pw: '', role: 'user' });
    const [editAccount, setEditAccount] = useState(null); // 수정 대상 계정

    // 시나리오
    const [prompts, setPrompts] = useState([]);
    const [editingPrompt, setEditingPrompt] = useState(null);
    const [updatedPrompt, setUpdatedPrompt] = useState('');

    const navigate = useNavigate();

    // 정보 조회, 수정, 삭제, 추가 등의 기능 처리시 문구 안내 및 버튼 비활성화
    const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
    const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);

    const [isSavingAccount, setIsSavingAccount] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [isSavingPrompt, setIsSavingPrompt] = useState(false);

    const isActionDisabled = isSavingAccount || isDeletingAccount || isSavingPrompt;

    const BASE_URL = 'https://b0897huj58.execute-api.ap-northeast-2.amazonaws.com';

    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    const [confirm, setConfirm] = useState(null); // { message, onConfirm }


    const cellStyle = {
        padding: '10px',
        textAlign: 'center',
        verticalAlign: 'middle',
        wordBreak: 'break-word',
        whiteSpace: 'normal',
        overflowWrap: 'break-word'
    };

    const inputStyleCentered = {
        padding: '6px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        width: '90%',
        textAlign: 'center' // ✅ 중앙 정렬 추가
    };

    const textareaStyle = {
        width: '95%',
        minHeight: '80px',
        padding: '6px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        resize: 'vertical',
        fontFamily: 'inherit',
        fontSize: 'inherit'
    };

    const actionBtnStyle = {
        marginRight: '6px',
        padding: '6px 12px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        minWidth: '60px'
    };

    const deleteBtnStyle = {
        ...actionBtnStyle,
        backgroundColor: '#dc3545'
    };

    const cancelBtnStyle = {
        ...actionBtnStyle,
        backgroundColor: '#6c757d'
    };

    // 계정 조회
    const fetchAccounts = async () => {
        setIsLoadingAccounts(true);

        try {
            const res = await fetch(`${BASE_URL}/accounts`);
            const data = await res.json();

            if (!res.ok) {
                console.error('[서버오류]', data);
                // alert(`❌ 서버 오류: ${data.message || 'Unknown Error'}`);
                showToast(`❌ 서버 오류: ${data.message || 'Unknown Error'}`, 'error');
                setAccounts([]); // 👈 기본값으로라도 빈 배열 넣기
                return;
            }

            if (!data.accounts || !Array.isArray(data.accounts)) {
                console.warn('[응답 구조 문제]', data);
                // alert('⚠️ 서버 응답 형식이 잘못되었습니다.');
                showToast('⚠️ 서버 응답 형식이 잘못되었습니다.', 'warning');
                setAccounts([]); // 👈 여기도 보호
                return;
            }

            setAccounts(data.accounts);
        } catch (error) {
            console.error('[fetchAccounts 실패]', error);
            // alert('❌ 네트워크 오류 또는 서버 문제 발생');
            showToast('❌ 네트워크 오류 또는 서버 문제 발생! 잠시 후 다시 시도해주세요.', 'error');
            setAccounts([]); // 👈 에러 시에도 빈 배열
        } finally {
            setIsLoadingAccounts(false);
        }
    };

    // 계정 추가
    const handleAddAccount = async () => {
        const { id, pw } = newAccount;

        if (!id || !pw) {
            // alert('아이디와 비밀번호를 모두 입력해주세요.');
            showToast('아이디와 비밀번호를 모두 입력해주세요.', 'info');
            return;
        }

        const res = await fetch(`${BASE_URL}/accounts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, pw }),
        });

        if (res.status === 409) {
            // alert('❌ 이미 존재하는 아이디입니다.');
            showToast('❌ 이미 존재하는 아이디입니다.', 'error');
            return;
        }

        if (res.ok) {
            // alert('✅ 계정 추가 완료!');
            showToast('✅ 계정 추가 완료!', 'success');
            setNewAccount({ id: '', pw: '', role: 'user' });
            fetchAccounts();
        } else {
            // alert('❌ 계정 추가 실패');
            showToast('❌ 계정 추가 실패! 잠시 후 다시 시도해주세요.', 'error');
        }
    };

    // 계정 삭제 → confirm 모달 적용
    const handleDelete = (id) => {
        setConfirm({
            message: `${id} 계정을 삭제할까요?`,
            onConfirm: () => {
                setConfirm(null);
                actuallyDelete(id);
            }
        });
    };

    const actuallyDelete = async (id) => {
        setIsDeletingAccount(true);
        
        const res = await fetch(`${BASE_URL}/accounts/${id}`, { method: 'DELETE' });

        if (res.ok) {
            showToast('🗑️ 삭제 완료!', 'success');
            fetchAccounts();
        } else {
            showToast('❌ 삭제 실패! 잠시 후 다시 시도해주세요.', 'error');
        }

        setIsDeletingAccount(false);
    };

    // 계정 삭제
    // const handleDelete = async (id) => {
    //     if (!window.confirm(`${id} 계정을 삭제할까요?`)) return;

    //     setIsDeletingAccount(true); // 🔁 시작

    //     const res = await fetch(`${BASE_URL}/accounts/${id}`, { method: 'DELETE' });

    //     if (res.ok) {
    //         // alert('🗑️ 삭제 완료');
    //         showToast('🗑️ 삭제 완료!', 'success');
    //         fetchAccounts();
    //     } else {
    //         // alert('❌ 삭제 실패');
    //         showToast('❌ 삭제 실패! 잠시 후 다시 시도해주세요.', 'error');
    //     }

    //     setIsDeletingAccount(false); // 🔁 종료
    // };

    // 계정 수정 시작
    const startEdit = (account) => {
        setEditAccount({
            originalId: account.id, // 수정 전 id 저장
            id: account.id, // 새 아이디 입력받기
            pw: account.pw, // 새 비번 입력받기
        });
    };

    // 계정 수정 저장
    const handleUpdate = async () => {
        setIsSavingAccount(true); // 🔁 시작

        const { originalId, id, pw } = editAccount;

        if (!id || !pw) {
            // alert('아이디와 비밀번호를 모두 입력해주세요.');
            showToast('아이디와 비밀번호를 모두 입력해주세요.', 'info');
            return;
        }

        const res = await fetch(`${BASE_URL}/accounts/${originalId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, pw }),
        });

        if (res.status === 409) {
            // alert('❌ 이미 존재하는 아이디입니다.');
            showToast('❌ 이미 존재하는 아이디입니다.', 'error');
            return;
        }

        if (res.ok) {
            // alert('✏️ 수정 완료');
            showToast('✏️ 수정 완료!', 'success');
            setEditAccount(null);
            fetchAccounts();
        } else {
            // alert('❌ 수정 실패');
            showToast('❌ 수정 실패! 잠시 후 다시 시도해주세요.', 'error');
        }

        setIsSavingAccount(false); // 🔁 종료
    };

    // 프롬프트 조회
    const fetchPrompts = async () => {
        setIsLoadingPrompts(true);

        try {
            const res = await fetch(`${BASE_URL}/prompts`);
            const data = await res.json();
            setPrompts(data.prompts || []);
        } catch {
            // alert('❌ 프롬프트 불러오기 실패');
            showToast('❌ 프롬프트 불러오기 실패! 잠시 후 다시 시도해주세요.', 'error');
            setPrompts([]);
        } finally {
            setIsLoadingPrompts(false);
        }

    };

    const handlePromptUpdate = async (type) => {
        setIsSavingPrompt(true); // 🔁 시작

        const res = await fetch(`${BASE_URL}/prompts/${type}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ targetType: type, newPrompt: updatedPrompt }),
        });

        const data = await res.json();

        if (data.result === 'success') {
            // alert('✏️ 수정 완료');
            showToast('✏️ 수정 완료!', 'success');
            setEditingPrompt(null);
            setUpdatedPrompt('');
            fetchPrompts(); // 다시 프롬프트 목록 갱신
        } else {
            // alert('❌ 수정 실패');
            showToast('❌ 수정 실패! 잠시 후 다시 시도해주세요.', 'error');
        }

        setIsSavingPrompt(false); // 🔁 종료
    };

    useEffect(() => {
        fetchAccounts();
        fetchPrompts();
    }, []);

    return (
        <div style={{ padding: '60px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <button
                onClick={() => navigate('/gpt/select')}
                style={{
                    position: 'absolute',
                    top: 40,
                    left: 40,
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                }}
            >
                ← GPT 선택으로 돌아가기
            </button>

            {/* 전체 페이지 제목 */}
            <h1 style={{ fontSize: '30px', marginBottom: '40px', textAlign: 'center' }}>
                🛠️ 관리자 페이지 🛠️
            </h1>

            <div style={{ display: 'flex', gap: '40px' }}>
                {/* 왼쪽: 계정 관리 */}
                <div style={{ flex: 1, background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ marginBottom: '20px' }}>🔑 계정 관리</h2>

                    {isLoadingAccounts && (
                        <div style={{ textAlign: 'center', marginBottom: '10px', color: '#888' }}>
                            ⏳ 계정 정보를 불러오는 중입니다...
                        </div>
                    )}

                    {(isSavingAccount || isDeletingAccount) && (
                        <div style={{ textAlign: 'center', marginBottom: '10px', color: '#888' }}>
                            ⏳ 계정 정보를 저장 또는 삭제하는 중입니다...
                        </div>
                    )}

                    <div style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
                        <input placeholder="아이디" value={newAccount.id} onChange={(e) => setNewAccount({ ...newAccount, id: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                        <input placeholder="비밀번호" value={newAccount.pw} onChange={(e) => setNewAccount({ ...newAccount, pw: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                        <button onClick={handleAddAccount} disabled={isActionDisabled} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>계정 추가</button>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#e9ecef' }}>
                                <th style={{ ...cellStyle, width: '100px' }}>ID</th>
                                <th style={{ ...cellStyle, width: '200px' }}>비밀번호</th>
                                <th style={{ ...cellStyle, width: '200px' }}>수정/삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.length > 0 ? (
                                accounts.filter((acc) => acc.role !== 'admin').map((acc) => {
                                    const isEditing = editAccount?.originalId === acc.id;
                                    return (
                                        <tr key={acc.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                            <td style={cellStyle}>
                                                {isEditing ? (
                                                    <input value={editAccount.id} onChange={(e) => setEditAccount({ ...editAccount, id: e.target.value })} style={inputStyleCentered} />
                                                ) : (
                                                    acc.id
                                                )}
                                            </td>
                                            <td style={cellStyle}>
                                                {isEditing ? (
                                                    <input value={editAccount.pw} onChange={(e) => setEditAccount({ ...editAccount, pw: e.target.value })} style={inputStyleCentered} />
                                                ) : (
                                                    acc.pw || ''
                                                )}
                                            </td>
                                            <td style={cellStyle}>
                                                {isEditing ? (
                                                    <>
                                                        <button onClick={handleUpdate} disabled={isSavingAccount} style={actionBtnStyle}>💾 저장</button>
                                                        <button onClick={() => setEditAccount(null)} style={cancelBtnStyle}>❌ 취소</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => startEdit(acc)} disabled={isActionDisabled} style={actionBtnStyle}>✏️ 수정</button>
                                                        <button onClick={() => handleDelete(acc.id)} disabled={isActionDisabled} style={deleteBtnStyle}>🗑️ 삭제</button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>불러올 계정이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 오른쪽: 프롬프트 관리 */}
                <div style={{ flex: 1, background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ marginBottom: '20px' }}>💬 프롬프트 관리</h2>

                    {isLoadingPrompts && (
                        <div style={{ textAlign: 'center', marginBottom: '10px', color: '#888' }}>
                            ⏳ 프롬프트를 불러오는 중입니다...
                        </div>
                    )}

                    {isSavingPrompt && (
                        <div style={{ textAlign: 'center', marginBottom: '10px', color: '#888' }}>
                            ⏳ 프롬프트를 저장하는 중입니다...
                        </div>
                    )}

                    <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#e9ecef' }}>
                                <th style={{ ...cellStyle, width: '100px' }}>유형</th>
                                <th style={{ ...cellStyle, width: '300px' }}>프롬프트</th>
                                <th style={{ ...cellStyle, width: '150px' }}>수정</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prompts.map(([type, prompt], idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #dee2e6' }}>
                                    <td style={cellStyle}>{type}</td>
                                    <td style={cellStyle}>
                                        {editingPrompt === type ? (
                                            <textarea value={updatedPrompt} onChange={(e) => setUpdatedPrompt(e.target.value)} style={textareaStyle} />
                                        ) : (
                                            prompt
                                        )}
                                    </td>
                                    <td style={cellStyle}>
                                        {editingPrompt === type ? (
                                            <>
                                                <button onClick={() => handlePromptUpdate(type)} disabled={isSavingPrompt} style={actionBtnStyle}>💾 저장</button>
                                                <button onClick={() => setEditingPrompt(null)} style={cancelBtnStyle}>취소</button>
                                            </>
                                        ) : (
                                            <button onClick={() => { setEditingPrompt(type); setUpdatedPrompt(prompt); }} disabled={isActionDisabled} style={actionBtnStyle}>✏️ 수정</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ✅ 토스트 메세지 */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* ✅ 모달 메세지 */}
            {confirm && (
                <ConfirmModal
                    message={confirm.message}
                    onConfirm={confirm.onConfirm}
                    onCancel={() => setConfirm(null)}
                />
            )}
        </div>
    );
}