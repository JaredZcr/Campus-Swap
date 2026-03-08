import { useState, useEffect } from 'react';
import { MapPin, Clock, Star } from 'lucide-react';
import { findIdleItems, findIdleByLabel, LABEL_MAP } from '../api';
import { getFirstPictureUrl } from '../utils/picture';
import ItemDetailModal from './ItemDetailModal';

const CATEGORY_LABELS = {
  1: 'Textbooks',
  2: 'Electronics',
  3: 'Furniture',
  4: 'Clothing',
  5: 'Sports',
  6: 'Other',
};

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop';

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function Listings({ category, searchQuery, priceRange, sortBy }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setLoading(true);
    const label = LABEL_MAP[category];
    const req = (label != null)
      ? findIdleByLabel(label, searchQuery, 1, 20)
      : findIdleItems(searchQuery, 1, 20);

    req.then((res) => {
      if (res.code === 200) {
        const data = res.data?.records || res.data?.list || res.data;
        setItems(Array.isArray(data) ? data : []);
      } else {
        setItems([]);
      }
    }).finally(() => setLoading(false));
  }, [category, searchQuery]);

  let filtered = items.filter((item) => {
    const price = parseFloat(item.idlePrice ?? '0');
    const keyword = (searchQuery || '').trim().toLowerCase();
    const haystack = `${item.idleName || ''} ${item.idleDetails || ''}`.toLowerCase();
    const matchSearch = !keyword || haystack.includes(keyword);
    const matchMin = !priceRange.min || price >= Number(priceRange.min);
    const matchMax = !priceRange.max || price <= Number(priceRange.max);
    return matchSearch && matchMin && matchMax;
  });

  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return parseFloat(a.idlePrice) - parseFloat(b.idlePrice);
      case 'price-high': return parseFloat(b.idlePrice) - parseFloat(a.idlePrice);
      default: return new Date(b.releaseTime) - new Date(a.releaseTime);
    }
  });

  const toModalItem = (item) => ({
    id: item.id,
    title: item.idleName,
    price: parseFloat(item.idlePrice),
    image: getFirstPictureUrl(item.pictureList) || FALLBACK_IMG,
    condition: CATEGORY_LABELS[item.idleLabel] || 'Item',
    seller: {
      name: item.user?.nickname || 'Seller',
      avatar: item.user?.avatar || 'https://i.pravatar.cc/150?img=1',
      rating: 4.5,
    },
    location: item.idlePlace || 'Campus',
    timeAgo: item.releaseTime ? timeAgo(item.releaseTime) : 'Recently',
    timestamp: item.releaseTime ? new Date(item.releaseTime).getTime() : Date.now(),
    category: CATEGORY_LABELS[item.idleLabel] || 'Other',
    description: item.idleDetails,
    idleId: item.id,
    sellerId: item.userId,
  });

  return (
    <>
      <section className="listings-section">
        <div className="section-header">
          <h2 className="section-title">Recent Listings</h2>
          <span className="results-count">{filtered.length} results</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>No items found.</div>
        ) : (
          <div className="listings-grid">
            {filtered.map((item) => {
              const img = getFirstPictureUrl(item.pictureList);
              return (
                <div key={item.id} className="listing-card" onClick={() => setSelectedItem(toModalItem(item))}>
                  <div className="listing-image-container">
                    <img
                      src={img || FALLBACK_IMG}
                      alt={item.idleName}
                      className="listing-image"
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                    />
                    <span className="condition-badge">{CATEGORY_LABELS[item.idleLabel] || 'Item'}</span>
                  </div>
                  <div className="listing-content">
                    <h3 className="listing-title">{item.idleName}</h3>
                    <div className="listing-price">${item.idlePrice}</div>
                    <div className="listing-meta">
                      <div className="seller-info">
                        <img
                          src={item.user?.avatar || 'https://i.pravatar.cc/150?img=1'}
                          alt={item.user?.nickname}
                          className="seller-avatar"
                        />
                        <span className="seller-name">{item.user?.nickname || 'Seller'}</span>
                      </div>
                      <div className="rating">
                        <Star size={16} fill="currentColor" />4.5
                      </div>
                    </div>
                    <div className="listing-footer">
                      <div className="location"><MapPin size={14} />{item.idlePlace || 'Campus'}</div>
                      <div className="time"><Clock size={14} />{item.releaseTime ? timeAgo(item.releaseTime) : 'Recently'}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {selectedItem && (
        <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </>
  );
}

export default Listings;
