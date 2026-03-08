import { useEffect, useState } from 'react';
import { getMyIdleItems, updateIdleItem } from '../api';
import { getFirstPictureUrl } from '../utils/picture';
import EditItemModal from './EditItemModal';
import Toast from './Toast';
import './myListings.css';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop';

const STATUS_LABEL = { 0: 'Deleted', 1: 'Active', 2: 'Inactive' };

export function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const toast = (m) => { setToastMsg(m); setShowToast(true); };

  useEffect(() => {
    getMyIdleItems()
      .then((res) => { if (res.code === 200) setListings(res.data || []); })
      .finally(() => setLoading(false));
  }, []);

  const handleToggleStatus = async (item) => {
    const newStatus = item.idleStatus === 1 ? 2 : 1;
    const res = await updateIdleItem({ id: item.id, idleStatus: newStatus });
    if (res.code === 200) {
      setListings((prev) => prev.map((l) => l.id === item.id ? { ...l, idleStatus: newStatus } : l));
      toast(newStatus === 1 ? 'Listing activated' : 'Listing deactivated');
    } else {
      toast(res.msg || 'Update failed');
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Delete this listing?')) return;
    const res = await updateIdleItem({ id: item.id, idleStatus: 0 });
    if (res.code === 200) {
      setListings((prev) => prev.filter((l) => l.id !== item.id));
      toast('Listing deleted');
    } else {
      toast(res.msg || 'Delete failed');
    }
  };

  const handleUpdated = (payload) => {
    setListings((prev) => prev.map((l) => (l.id === payload.id ? { ...l, ...payload } : l)));
    toast('Listing updated');
  };

  if (loading) return <div className="my_listings"><div className="my_listings_container"><p>Loading...</p></div></div>;

  const active = listings.filter((l) => l.idleStatus !== 0);

  return (
    <div className="my_listings">
      <div className="my_listings_container">
        <h2 className="my_listings_title">My Listings</h2>

        {active.length === 0 ? (
          <div className="my_listings_empty">You haven&apos;t listed any items yet.</div>
        ) : (
          <div className="my_listings_grid">
            {active.map((item) => {
              const img = getFirstPictureUrl(item.pictureList);
              return (
                <div key={item.id} className="my_listings_card-wrap">
                  <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 14, overflow: 'hidden' }}>
                    <img
                      src={img || FALLBACK_IMG}
                      alt={item.idleName}
                      style={{ width: '100%', height: 160, objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                    />
                    <div style={{ padding: '14px 16px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#111827' }}>{item.idleName}</div>
                      <div style={{ color: '#6366f1', fontWeight: 600, marginTop: 4 }}>${item.idlePrice}</div>
                      {item.idlePlace && <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 4 }}>{item.idlePlace}</div>}
                    </div>
                  </div>

                  <div className="my_listings_actions">
                    <button
                      className="my_listings_icon-btn"
                      title="Edit"
                      onClick={() => setEditing(item)}
                      style={{ background: '#e0e7ff' }}
                    >
                      ✏️
                    </button>
                    <button
                      className="my_listings_icon-btn"
                      title={item.idleStatus === 1 ? 'Deactivate' : 'Activate'}
                      onClick={() => handleToggleStatus(item)}
                      style={{ background: item.idleStatus === 1 ? '#fef3c7' : '#d1fae5' }}
                    >
                      {item.idleStatus === 1 ? '⏸' : '▶'}
                    </button>
                    <button
                      className="my_listings_icon-btn my_listings_icon-btn_delete"
                      onClick={() => handleDelete(item)}
                      aria-label="Delete listing"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="my_listings_status" title="Listing status">
                    {STATUS_LABEL[item.idleStatus] || 'Active'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {editing && (
        <EditItemModal
          item={editing}
          onClose={() => setEditing(null)}
          onUpdated={handleUpdated}
        />
      )}

      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}
    </div>
  );
}

