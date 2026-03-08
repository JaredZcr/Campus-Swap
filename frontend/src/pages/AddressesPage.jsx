import { useEffect, useState } from 'react';
import { MapPin, Plus, Pencil, Trash2 } from 'lucide-react';
import { addAddress, deleteAddress, getAddress, updateAddress } from '../api';
import AddressModal from '../components/AddressModal';
import Toast from '../components/Toast';
import './AddressesPage.css';

export default function AddressesPage({ onBack }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const toast = (m) => { setToastMsg(m); setShowToast(true); };

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAddress();
      if (res.code === 200) setList(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    const payload = { ...form };
    if (payload.id) {
      const res = await updateAddress(payload);
      if (res.code === 200) {
        toast('Address updated');
        await load();
        return;
      }
      throw new Error(res.msg || 'Update failed');
    }
    const res = await addAddress(payload);
    if (res.code === 200) {
      toast('Address added');
      await load();
      return;
    }
    throw new Error(res.msg || 'Add failed');
  };

  const handleDelete = async (addr) => {
    if (!window.confirm('Delete this address?')) return;
    const res = await deleteAddress({ id: addr.id });
    if (res.code === 200) {
      toast('Address deleted');
      setList((prev) => prev.filter((a) => a.id !== addr.id));
    } else {
      toast(res.msg || 'Delete failed');
    }
  };

  return (
    <div className="addr-page">
      <div className="addr-header">
        <button className="addr-back" onClick={onBack}>← Back</button>
        <h2 className="addr-title">Addresses</h2>
        <button className="addr-add" onClick={() => { setEditing(null); setShowModal(true); }}>
          <Plus size={16} /> Add
        </button>
      </div>

      {loading ? (
        <div className="addr-loading">Loading...</div>
      ) : list.length === 0 ? (
        <div className="addr-empty">
          <MapPin size={18} /> No saved addresses yet.
          <button className="addr-empty-btn" onClick={() => { setEditing(null); setShowModal(true); }}>
            Add your first address
          </button>
        </div>
      ) : (
        <div className="addr-grid">
          {list.map((a) => (
            <div key={a.id} className="addr-card">
              <div className="addr-card-top">
                <div className="addr-name">
                  {a.consigneeName} <span className="addr-phone">{a.consigneePhone}</span>
                </div>
                {a.defaultFlag ? <span className="addr-badge">Default</span> : null}
              </div>
              <div className="addr-line">
                {(a.provinceName || a.cityName || a.regionName) ? (
                  <span>{[a.provinceName, a.cityName, a.regionName].filter(Boolean).join(' / ')}</span>
                ) : (
                  <span className="addr-muted">(No region)</span>
                )}
              </div>
              <div className="addr-detail">{a.detailAddress}</div>

              <div className="addr-actions">
                <button className="addr-action" onClick={() => { setEditing(a); setShowModal(true); }}>
                  <Pencil size={16} /> Edit
                </button>
                <button className="addr-action danger" onClick={() => handleDelete(a)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddressModal
          initial={editing}
          title={editing ? 'Edit Address' : 'Add Address'}
          onClose={() => setShowModal(false)}
          onSubmit={handleSave}
        />
      )}

      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}
    </div>
  );
}
