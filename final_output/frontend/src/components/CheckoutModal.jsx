import { useEffect, useMemo, useState } from 'react';
import { X, MapPin, Plus } from 'lucide-react';
import { addOrder, addOrderAddress, addAddress, getAddress } from '../api';
import AddressModal from './AddressModal';
import { getFirstPictureUrl } from '../utils/picture';
import './CheckoutModal.css';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop';

export default function CheckoutModal({ item, onClose, onCreated }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [showAddrModal, setShowAddrModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAddress();
      if (res.code === 200) {
        const list = res.data || [];
        setAddresses(list);
        const def = list.find((a) => a.defaultFlag) || list[0];
        setSelectedId(def ? def.id : null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const selected = useMemo(() => addresses.find((a) => a.id === selectedId) || null, [addresses, selectedId]);
  const itemId = item?.idleId || item?.id;
  const itemName = item?.idleName || item?.title || '';
  const itemPrice = (item?.idlePrice ?? item?.price ?? 0);
  const img = getFirstPictureUrl(item?.pictureList) || item?.image || FALLBACK_IMG;

  const handleSaveAddress = async (form) => {
    const res = await addAddress(form);
    if (res.code === 200) {
      await load();
      return;
    }
    throw new Error(res.msg || 'Add failed');
  };

  const handlePlaceOrder = async () => {
    setError('');
    if (!itemId) {
      setError('Invalid item');
      return;
    }
    if (!selected) {
      setError('Please select an address');
      return;
    }
    setCreating(true);
    try {
      const orderRes = await addOrder({
        idleId: itemId,
        orderPrice: Number(itemPrice),
        paymentWay: 'Online',
      });
      if (orderRes.code !== 200 || !orderRes.data?.id) {
        setError(orderRes.msg || 'Failed to create order');
        setCreating(false);
        return;
      }

      const oaRes = await addOrderAddress({
        orderId: orderRes.data.id,
        consigneeName: selected.consigneeName,
        consigneePhone: selected.consigneePhone,
        detailAddress: [selected.provinceName, selected.cityName, selected.regionName, selected.detailAddress]
          .filter(Boolean)
          .join(' '),
      });

      if (oaRes.code !== 200) {
        setError(oaRes.msg || 'Order created, but failed to attach address');
        setCreating(false);
        return;
      }

      onCreated && onCreated(orderRes.data);
      onClose();
    } catch {
      setError('Network error');
    }
    setCreating(false);
  };

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-header">
          <div>
            <div className="checkout-title">Checkout</div>
            <div className="checkout-subtitle">Confirm your shipping details</div>
          </div>
          <button className="checkout-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="checkout-body">
          <div className="checkout-item">
            <img className="checkout-item-img" src={img} alt="" onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }} />
            <div className="checkout-item-info">
              <div className="checkout-item-name">{itemName}</div>
              <div className="checkout-item-price">${Number(itemPrice).toFixed(2)}</div>
              <div className="checkout-item-note">You can pay later from “My Orders”.</div>
            </div>
          </div>

          <div className="checkout-section">
            <div className="checkout-section-title"><MapPin size={18} /> Shipping Address</div>
            {loading ? (
              <div className="checkout-muted">Loading addresses...</div>
            ) : addresses.length === 0 ? (
              <div className="checkout-empty">
                No saved address.
                <button className="checkout-add" onClick={() => setShowAddrModal(true)}>
                  <Plus size={16} /> Add Address
                </button>
              </div>
            ) : (
              <div className="checkout-addr-list">
                {addresses.map((a) => (
                  <label key={a.id} className={`checkout-addr ${selectedId === a.id ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="addr"
                      checked={selectedId === a.id}
                      onChange={() => setSelectedId(a.id)}
                    />
                    <div className="checkout-addr-main">
                      <div className="checkout-addr-top">
                        <span className="checkout-addr-name">{a.consigneeName}</span>
                        <span className="checkout-addr-phone">{a.consigneePhone}</span>
                        {a.defaultFlag ? <span className="checkout-addr-badge">Default</span> : null}
                      </div>
                      <div className="checkout-addr-detail">
                        {[a.provinceName, a.cityName, a.regionName, a.detailAddress].filter(Boolean).join(' ')}
                      </div>
                    </div>
                  </label>
                ))}

                <button className="checkout-add-inline" onClick={() => setShowAddrModal(true)}>
                  <Plus size={16} /> Add another address
                </button>
              </div>
            )}
          </div>

          {error && <div className="checkout-error">{error}</div>}

          <div className="checkout-footer">
            <button className="checkout-cancel" onClick={onClose}>Cancel</button>
            <button className="checkout-primary" onClick={handlePlaceOrder} disabled={creating || loading}>
              {creating ? 'Placing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>

      {showAddrModal && (
        <AddressModal
          title="Add Address"
          onClose={() => setShowAddrModal(false)}
          onSubmit={handleSaveAddress}
        />
      )}
    </div>
  );
}
