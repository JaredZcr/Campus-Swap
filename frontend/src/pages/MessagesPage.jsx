import { useEffect, useMemo, useRef, useState } from 'react';
import { getMyMessages, sendMessage, deleteMessage } from '../api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import './MessagesPage.css';

function formatTime(ts) {
  if (!ts) return '';
  try {
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleString();
  } catch {
    return '';
  }
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeKey, setActiveKey] = useState(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);
  const listRef = useRef(null);

  const toast = (m) => {
    setToastMsg(m);
    setShowToast(true);
  };

  useEffect(() => {
    if (!user) {
      setAllMessages([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    getMyMessages()
      .then((res) => {
        if (res?.code === 200) setAllMessages(res.data || []);
        else setAllMessages([]);
      })
      .catch(() => setAllMessages([]))
      .finally(() => setLoading(false));
  }, [user]);

  const conversations = useMemo(() => {
    if (!user) return [];
    const map = new Map();
    const sorted = [...(allMessages || [])].sort((a, b) => (a.id || 0) - (b.id || 0));
    for (const m of sorted) {
      const idleId = m.idleId;
      const otherUserId = m.userId === user.id ? m.toUser : m.userId;
      if (!idleId || !otherUserId) continue;
      const key = `${idleId}-${otherUserId}`;
      const otherUser = m.userId === user.id ? (m.toU || null) : (m.fromU || null);
      const item = m.idle || null;

      const prev = map.get(key);
      if (!prev) {
        map.set(key, {
          key,
          idleId,
          otherUserId,
          otherUser,
          item,
          last: m,
        });
      } else {
        // Update last message
        if ((m.id || 0) > (prev.last?.id || 0)) prev.last = m;
        // Fill missing user/item info
        if (!prev.otherUser && otherUser) prev.otherUser = otherUser;
        if (!prev.item && item) prev.item = item;
      }
    }
    return [...map.values()].sort((a, b) => (b.last?.id || 0) - (a.last?.id || 0));
  }, [allMessages, user]);

  // Default select the first conversation
  useEffect(() => {
    if (!activeKey && conversations.length > 0) {
      setActiveKey(conversations[0].key);
    }
  }, [activeKey, conversations]);

  const activeConv = useMemo(() => conversations.find((c) => c.key === activeKey) || null, [conversations, activeKey]);

  const thread = useMemo(() => {
    if (!user || !activeConv) return [];
    const { idleId, otherUserId } = activeConv;
    const filtered = (allMessages || []).filter((m) => {
      if (m.idleId !== idleId) return false;
      const a = m.userId === user.id && m.toUser === otherUserId;
      const b = m.userId === otherUserId && m.toUser === user.id;
      return a || b;
    });
    return filtered.sort((a, b) => (a.id || 0) - (b.id || 0));
  }, [allMessages, activeConv, user]);

  // Auto scroll to bottom when thread changes
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [activeKey, thread.length]);

  const handleSend = async () => {
    if (!user || !activeConv) return;

    const content = draft.trim();
    if (!content) return;

    setSending(true);
    try {
      const res = await sendMessage({
        idleId: activeConv.idleId,
        content,
        toUser: activeConv.otherUserId,
      });

      if (res?.code === 200 && res.data) {
        const patched = {
          ...res.data,
          content,
          fromU: user,
          toU: activeConv.otherUser,
          idle: activeConv.item,
        };
        setAllMessages((prev) => [...(prev || []), patched]);
        setDraft('');
      } else {
        toast(res?.msg || 'Send failed');
      }
    } catch {
      toast('Send failed');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteOne = async (id) => {
    if (!id) return;
    try {
      const res = await deleteMessage(id);
      if (res?.code === 200) {
        setAllMessages((prev) => (prev || []).filter((m) => m.id !== id));
        toast('Message deleted');
      }
    } catch {
      toast('Delete failed');
    }
  };

  const handleClearThread = async () => {
    if (!activeConv) return;
    if (thread.length === 0) {
      toast('Nothing to clear');
      return;
    }
    if (!window.confirm('Clear this conversation? This will delete all messages in this thread.')) return;
    for (const m of thread) {
      if (!m.id) continue;
      // sequential calls keeps backend load light
      try {
        await deleteMessage(m.id);
      } catch {
        // ignore single failures
      }
    }
    setAllMessages((prev) => (prev || []).filter((m) => !thread.some((t) => t.id === m.id)));
    toast('Conversation cleared');
  };

  if (!user) {
    return (
      <div className="chat-page">
        <div className="chat-empty">Please sign in to view your messages.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="chat-page">
        <div className="chat-empty">Loading...</div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="chat-shell">
        {/* Left: Conversation list */}
        <aside className="chat-sidebar">
          <div className="chat-sidebar-header">
            <div className="chat-sidebar-title">Messages</div>
            <div className="chat-sidebar-sub">{conversations.length} conversations</div>
          </div>

          {conversations.length === 0 ? (
            <div className="chat-sidebar-empty">No conversations yet.</div>
          ) : (
            <div className="chat-conv-list">
              {conversations.map((c) => {
                const isActive = c.key === activeKey;
                const name = c.otherUser?.nickname || `User ${c.otherUserId}`;
                const avatar = c.otherUser?.avatar || 'https://i.pravatar.cc/150?img=1';
                const itemName = c.item?.idleName || 'Item';
                const lastText = c.last?.content || '';
                const lastTime = c.last?.createTime ? formatTime(c.last.createTime) : '';
                return (
                  <button
                    key={c.key}
                    className={`chat-conv ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveKey(c.key)}
                  >
                    <img className="chat-conv-avatar" src={avatar} alt="" />
                    <div className="chat-conv-main">
                      <div className="chat-conv-top">
                        <div className="chat-conv-name">{name}</div>
                        <div className="chat-conv-time">{lastTime}</div>
                      </div>
                      <div className="chat-conv-mid">re: {itemName}</div>
                      <div className="chat-conv-preview">{lastText}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        {/* Right: Chat window */}
        <section className="chat-main">
          {!activeConv ? (
            <div className="chat-empty">Select a conversation on the left.</div>
          ) : (
            <>
              <div className="chat-header">
                <div className="chat-header-left">
                  <img
                    className="chat-header-avatar"
                    src={activeConv.otherUser?.avatar || 'https://i.pravatar.cc/150?img=1'}
                    alt=""
                  />
                  <div>
                    <div className="chat-header-name">{activeConv.otherUser?.nickname || `User ${activeConv.otherUserId}`}</div>
                    <div className="chat-header-sub">re: {activeConv.item?.idleName || 'Item'}</div>
                  </div>
                </div>
                <div className="chat-header-right">
                  <button className="chat-header-clear" onClick={handleClearThread}>
                    Clear chat
                  </button>
                </div>
              </div>

              <div className="chat-thread" ref={listRef}>
                {thread.length === 0 ? (
                  <div className="chat-thread-empty">No messages yet. Say hi 👋</div>
                ) : (
                  thread.map((m) => {
                    const mine = m.userId === user.id;
                    const avatar = mine
                      ? (user.avatar || 'https://i.pravatar.cc/150?img=8')
                      : (m.fromU?.avatar || activeConv.otherUser?.avatar || 'https://i.pravatar.cc/150?img=1');
                    const name = mine ? (user.nickname || 'Me') : (m.fromU?.nickname || activeConv.otherUser?.nickname || 'User');
                    return (
                      <div key={m.id || `${m.createTime}-${m.content}`} className={`chat-bubble-row ${mine ? 'mine' : ''}`}>
                        {!mine && <img className="chat-bubble-avatar" src={avatar} alt="" />}
                        <div className={`chat-bubble ${mine ? 'mine' : ''}`}>
                          <div className="chat-bubble-name">{name}</div>
                          <div className="chat-bubble-text">{m.content}</div>
                          <div className="chat-bubble-time">{formatTime(m.createTime)}</div>
                          <button
                            className="chat-bubble-del"
                            title="Delete message"
                            onClick={(e) => { e.stopPropagation(); handleDeleteOne(m.id); }}
                          >
                            ✕
                          </button>
                        </div>
                        {mine && <img className="chat-bubble-avatar" src={avatar} alt="" />}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="chat-input">
                <input
                  className="chat-input-box"
                  value={draft}
                  placeholder="Type a message..."
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                />
                <button className="chat-input-send" onClick={handleSend} disabled={sending}>
                  Send
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      {showToast && (
        <Toast message={toastMsg} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}
