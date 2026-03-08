import { useEffect, useMemo, useState } from 'react';
import { X, Upload } from 'lucide-react';
import { updateIdleItem, uploadFile } from '../api';
import { getFirstPictureUrl } from '../utils/picture';
import './EditItemModal.css';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=800&h=600&fit=crop';

const LABELS = [
  { value: 1, label: 'Textbooks' },
  { value: 2, label: 'Electronics' },
  { value: 3, label: 'Furniture' },
  { value: 4, label: 'Clothing' },
  { value: 5, label: 'Sports' },
  { value: 6, label: 'Other' },
];

export default function EditItemModal({ item, onClose, onUpdated }) {
  const [form, setForm] = useState({
    id: null,
    idleName: '',
    idleDetails: '',
    idlePrice: '',
    idlePlace: '',
    idleLabel: 1,
    pictureList: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!item) return;
    setForm({
      id: item.id,
      idleName: item.idleName || '',
      idleDetails: item.idleDetails || '',
      idlePrice: item.idlePrice ?? '',
      idlePlace: item.idlePlace || '',
      idleLabel: item.idleLabel ?? 1,
      pictureList: item.pictureList || '',
    });
  }, [item]);

  const preview = useMemo(() => getFirstPictureUrl(form.pictureList) || FALLBACK_IMG, [form.pictureList]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadFile(file);
      if (res.code === 200) {
        setForm((f) => ({ ...f, pictureList: JSON.stringify([res.data]) }));
      } else {
        setError(res.msg || 'Upload failed');
      }
    } catch {
      setError('Upload failed');
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setError('');
    if (!form.idleName || !form.idlePrice) {
      setError('Name and price are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        id: form.id,
        idleName: form.idleName,
        idleDetails: form.idleDetails,
        idlePrice: Number(form.idlePrice),
        idlePlace: form.idlePlace,
        idleLabel: Number(form.idleLabel),
        pictureList: form.pictureList,
      };
      const res = await updateIdleItem(payload);
      if (res.code === 200) {
        onUpdated && onUpdated(payload);
        onClose();
      } else {
        setError(res.msg || 'Save failed');
      }
    } catch {
      setError('Save failed');
    }
    setSaving(false);
  };

  return (
    <div className="edit-item-overlay" onClick={onClose}>
      <div className="edit-item-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-item-header">
          <h2>Edit Listing</h2>
          <button className="edit-item-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="edit-item-body">
          <div className="edit-item-preview">
            <img src={preview} alt="preview" onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }} />
            <label className="edit-item-upload">
              <Upload size={16} /> {uploading ? 'Uploading...' : 'Change photo'}
              <input type="file" accept="image/*" hidden onChange={handleUpload} />
            </label>
          </div>

          <div className="edit-item-form">
            <label>Title *</label>
            <input className="edit-item-input" value={form.idleName} onChange={(e) => setForm((f) => ({ ...f, idleName: e.target.value }))} />

            <div className="edit-item-grid">
              <div>
                <label>Price ($) *</label>
                <input className="edit-item-input" type="number" value={form.idlePrice} onChange={(e) => setForm((f) => ({ ...f, idlePrice: e.target.value }))} />
              </div>
              <div>
                <label>Location</label>
                <input className="edit-item-input" value={form.idlePlace} onChange={(e) => setForm((f) => ({ ...f, idlePlace: e.target.value }))} placeholder="e.g. Auburn Hills" />
              </div>
            </div>

            <label>Category</label>
            <select className="edit-item-input" value={form.idleLabel} onChange={(e) => setForm((f) => ({ ...f, idleLabel: e.target.value }))}>
              {LABELS.map((label) => (
                <option key={label.value} value={label.value}>{label.label}</option>
              ))}
            </select>

            <label>Description</label>
            <textarea className="edit-item-input edit-item-textarea" value={form.idleDetails} onChange={(e) => setForm((f) => ({ ...f, idleDetails: e.target.value }))} />

            {error && <div className="edit-item-error">{error}</div>}

            <div className="edit-item-actions">
              <button className="edit-item-secondary" onClick={onClose}>Cancel</button>
              <button className="edit-item-primary" onClick={handleSave} disabled={saving || uploading}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
