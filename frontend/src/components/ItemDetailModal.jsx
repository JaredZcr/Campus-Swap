import { useState, useEffect } from 'react';
import { X, MapPin, Clock, Star, MessageCircle, ShoppingBag, Heart, Share2 } from 'lucide-react';
import Toast from './Toast';
import CheckoutModal from './CheckoutModal';
import { addFavorite, deleteFavorite, checkFavorite, sendMessage, getIdleMessages } from '../api';
import { useAuth } from '../context/AuthContext';
import './ItemDetailModal.css';

function ItemDetailModal({ item, onClose }) {
  const { user } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const [showMsgPanel, setShowMsgPanel] = useState(false);
  const [sending, setSending] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    if (!item) return;
    getIdleMessages(item.idleId || item.id).then((res) => {
      if (res.code === 200) setMessages(res.data || []);
    });
    if (!user) return;
    checkFavorite(item.idleId || item.id).then((res) => {
      if (res.code === 200 && res.data) {
        setIsFavorited(true);
        setFavoriteId(res.data);
      } else {
        setIsFavorited(false);
        setFavoriteId(null);
      }
    });
  }, [item, user]);

  if (!item) return null;

  const toast = (msg) => { setToastMsg(msg); setShowToast(true); };
  const isOwnItem = !!user && item.sellerId === user.id;

  const handleFavorite = async () => {
    if (!user) { toast('Please sign in to save items'); return; }
    if (isFavorited) {
      const res = await deleteFavorite(favoriteId);
      if (res.code === 200) { setIsFavorited(false); setFavoriteId(null); toast('Removed from saved items'); }
    } else {
      const res = await addFavorite(item.idleId || item.id);
      if (res.code === 200) { setIsFavorited(true); setFavoriteId(res.data); toast('Saved to favorites!'); }
      else { toast(res.msg || 'Failed to save item'); }
    }
  };

  const handleBuy = async () => {
    if (!user) { toast('Please sign in to buy'); return; }
    if (isOwnItem) { toast('You cannot buy your own listing'); return; }
    setShowCheckout(true);
  };

  const handleSendMessage = async () => {
    if (!user) {
      toast('Please sign in to send messages');
      return;
    }
    if (isOwnItem) {
      toast('This is your own listing');
      return;
    }

    const content = msgInput.trim();
    if (!content) return;

    setSending(true);
    try {
      const res = await sendMessage({
        idleId: item.idleId || item.id,
        content,
        toUser: item.sellerId,
      });

      if (res?.code === 200 && res.data) {
        const patched = {
          ...res.data,
          content,
          fromU: user,
          toU: {
            id: item.sellerId,
            nickname: item.seller?.name || 'Seller',
            avatar: item.seller?.avatar || '',
          },
        };
        setMessages((prev) => [...(prev || []), patched]);
        setMsgInput('');
        toast('Message sent!');
      } else {
        toast(res?.msg || 'Message failed');
      }
    } catch {
      toast('Message failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}><X size={24} /></button>

          <div className="modal-grid">
            <div className="modal-image-section">
              <img src={item.image} alt={item.title} className="modal-image" />
            </div>

            <div className="modal-details">
              <div className="modal-badges">
                <span className="modal-category-badge">{item.category}</span>
                <span className="modal-condition-badge-small">{item.condition}</span>
              </div>

              <h2 className="modal-title">{item.title}</h2>
              <div className="modal-price">${item.price}</div>

              <div className="modal-seller">
                <img src={item.seller.avatar} alt={item.seller.name} className="modal-seller-avatar" />
                <div className="modal-seller-info">
                  <div className="modal-seller-name">{item.seller.name}</div>
                  <div className="modal-seller-meta">
                    <MapPin size={14} />{item.location}
                    <span className="modal-seller-rating">{item.seller.rating} <Star size={14} fill="currentColor" /></span>
                  </div>
                </div>
              </div>

              <div className="modal-description">
                <h3>Description</h3>
                <p>{item.description || 'No description provided.'}</p>
              </div>

              <div className="modal-meta">
                <div className="modal-meta-item"><Clock size={16} />Posted {item.timeAgo}</div>
              </div>

              <div className="modal-actions">
                <button className="modal-btn modal-btn-message" onClick={() => setShowMsgPanel(!showMsgPanel)}>
                  <MessageCircle size={20} />Message
                </button>
                <button className="modal-btn modal-btn-buy" onClick={handleBuy}>
                  <ShoppingBag size={20} />Buy Now
                </button>
              </div>

              {showMsgPanel && (
                <div className="modal-msg-panel">
                  <div className="modal-msg-list">
                    {messages.length === 0 && <p className="modal-msg-empty">No messages yet. Be the first!</p>}
                    {messages.map((m) => (
                      <div key={m.id} className="modal-msg-item">
                        <img src={m.fromU?.avatar || 'https://i.pravatar.cc/150?img=1'} alt="" className="modal-msg-avatar" />
                        <div>
                          <span className="modal-msg-name">{m.fromU?.nickname || 'User'}</span>
                          <p className="modal-msg-text">{m.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="modal-msg-input-row">
                    <input
                      className="modal-msg-input"
                      placeholder="Write a message..."
                      value={msgInput}
                      onChange={(e) => setMsgInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                    />
                    <button className="modal-msg-send" onClick={handleSendMessage} disabled={sending}>Send</button>
                  </div>
                </div>
              )}

              <div className="modal-secondary-actions">
                <button className={`modal-secondary-btn ${isFavorited ? 'modal-favorited' : ''}`} onClick={handleFavorite}>
                  <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
                  {isFavorited ? 'Saved' : 'Save'}
                </button>
                <button className="modal-secondary-btn"><Share2 size={18} />Share</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal
          item={item}
          onClose={() => setShowCheckout(false)}
          onCreated={() => toast('Order created! Check My Orders to complete payment.')}
        />
      )}

      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}
    </>
  );
}

export default ItemDetailModal;
