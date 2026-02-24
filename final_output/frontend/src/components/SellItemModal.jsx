import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { addIdleItem, uploadFile } from '../api';
import { getFirstPictureUrl } from '../utils/picture';
import './SellItemModal.css';

const LABELS = [
  { value: 1, label: 'Textbooks' },
  { value: 2, label: 'Electronics' },
  { value: 3, label: 'Furniture' },
  { value: 4, label: 'Clothing' },
  { value: 5, label: 'Sports' },
  { value: 6, label: 'Other' },
];

export default function SellItemModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    idleName: '',
    idleDetails: '',
    idlePrice: '',
    idlePlace: '',
    idleLabel: 1,
    pictureList: '',
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadFile(file);
      if (res.code === 200) {
        // Backend stores pictureList as a string; the existing DB sample data uses a JSON array string.
        // Keep the same format so list/detail pages can parse consistently.
        setForm((f) => ({ ...f, pictureList: JSON.stringify([res.data]) }));
      } else {
        setError('Image upload failed');
      }
    } catch {
      setError('Upload error');
    }
    setUploading(false);
  };

  const handleSubmit = async () => {
    if (!form.idleName || !form.idlePrice) {
      setError('Name and price are required');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await addIdleItem({
        ...form,
        idlePrice: parseFloat(form.idlePrice),
        idleLabel: parseInt(form.idleLabel),
      });
      if (res.code === 200) {
        onSuccess && onSuccess(res.data);
        onClose();
      } else {
        setError(res.msg || 'Failed to post item');
      }
    } catch {
      setError('Network error');
    }
    setSubmitting(false);
  };

  return (
    <div className="sell-overlay" onClick={onClose}>
      <div className="sell-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sell-header">
          <h2>Post an Item</h2>
          <button className="sell-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="sell-form">
          <label>Item Name *</label>
          <input className="sell-input" name="idleName" placeholder="e.g. Calculus Textbook" value={form.idleName} onChange={handleChange} />

          <label>Category *</label>
          <select className="sell-input" name="idleLabel" value={form.idleLabel} onChange={handleChange}>
            {LABELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>

          <label>Price ($) *</label>
          <input className="sell-input" name="idlePrice" type="number" placeholder="0.00" value={form.idlePrice} onChange={handleChange} />

          <label>Location</label>
          <input className="sell-input" name="idlePlace" placeholder="e.g. North Campus" value={form.idlePlace} onChange={handleChange} />

          <label>Description</label>
          <textarea className="sell-input sell-textarea" name="idleDetails" placeholder="Describe your item..." value={form.idleDetails} onChange={handleChange} />

          <label>Photo</label>
          <div className="sell-upload">
            {form.pictureList ? (
              <img src={getFirstPictureUrl(form.pictureList)} alt="preview" className="sell-preview" />
            ) : (
              <label className="sell-upload-btn">
                <Upload size={20} />
                {uploading ? 'Uploading...' : 'Upload Photo'}
                <input type="file" accept="image/*" onChange={handleFileChange} hidden />
              </label>
            )}
          </div>

          {error && <p className="sell-error">{error}</p>}

          <button className="sell-submit" onClick={handleSubmit} disabled={submitting || uploading}>
            {submitting ? 'Posting...' : 'Post Item'}
          </button>
        </div>
      </div>
    </div>
  );
}
