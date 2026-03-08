import { useEffect, useState } from 'react';
import { getMyFavorites, deleteFavorite } from '../api';
import { Heart, MapPin } from 'lucide-react';
import { getFirstPictureUrl } from '../utils/picture';
import './FavoritesPage.css';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop';

export default function FavoritesPage({ onItemClick }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyFavorites()
      .then((res) => { if (res.code === 200) setFavorites(res.data || []); })
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (favId) => {
    const res = await deleteFavorite(favId);
    if (res.code === 200) setFavorites((prev) => prev.filter((f) => f.id !== favId));
  };

  if (loading) return <div className="fav-loading">Loading...</div>;

  return (
    <div className="fav-page">
      <h2 className="fav-title">Saved Items</h2>
      {favorites.length === 0 ? (
        <div className="fav-empty">No saved items yet.</div>
      ) : (
        <div className="fav-grid">
          {favorites.map((fav) => {
            const item = fav.idleItem;
            if (!item) return null;
            const img = getFirstPictureUrl(item.pictureList);
            return (
              <div key={fav.id} className="fav-card" onClick={() => onItemClick && onItemClick(item)}>
                <div className="fav-img-wrap">
                  {img ? (
                    <img
                      src={img}
                      alt={item.idleName}
                      className="fav-img"
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                    />
                  ) : (
                    <div className="fav-img-placeholder" />
                  )}
                  <button className="fav-remove" onClick={(e) => { e.stopPropagation(); handleRemove(fav.id); }}>
                    <Heart size={16} fill="#ef4444" color="#ef4444" />
                  </button>
                </div>
                <div className="fav-info">
                  <div className="fav-name">{item.idleName}</div>
                  <div className="fav-price">${item.idlePrice}</div>
                  {item.idlePlace && <div className="fav-place"><MapPin size={12} />{item.idlePlace}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
