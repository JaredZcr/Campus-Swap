import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import './AddressModal.css';

export default function AddressModal({ initial, title = 'Address', onClose, onSubmit }) {
  const [form, setForm] = useState({
    id: null,
    consigneeName: '',
    consigneePhone: '',
    provinceName: '',
    cityName: '',
    regionName: '',
    detailAddress: '',
    defaultFlag: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!initial) return;
    setForm((f) => ({
      ...f,
      ...initial,
      defaultFlag: !!initial.defaultFlag,
    }));
  }, [initial]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.consigneeName || !form.consigneePhone || !form.detailAddress) {
      setError('Name, phone, and address are required');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (e) {
      setError(e?.message || 'Failed to save');
    }
    setSubmitting(false);
  };

  return (
    <div className="address-overlay" onClick={onClose}>
      <div className="address-modal" onClick={(e) => e.stopPropagation()}>
        <div className="address-header">
          <h2>{title}</h2>
          <button className="address-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="address-form">
          <label>Consignee Name *</label>
          <input className="address-input" name="consigneeName" value={form.consigneeName} onChange={handleChange} placeholder="e.g. Alex" />

          <label>Phone *</label>
          <input className="address-input" name="consigneePhone" value={form.consigneePhone} onChange={handleChange} placeholder="e.g. 2481234567" />

          <div className="address-grid">
            <div>
              <label>State/Province</label>
              <input className="address-input" name="provinceName" value={form.provinceName || ''} onChange={handleChange} placeholder="e.g. MI" />
            </div>
            <div>
              <label>City</label>
              <input className="address-input" name="cityName" value={form.cityName || ''} onChange={handleChange} placeholder="e.g. Rochester" />
            </div>
          </div>

          <label>Region / Campus</label>
          <input className="address-input" name="regionName" value={form.regionName || ''} onChange={handleChange} placeholder="e.g. North Campus" />

          <label>Detail Address *</label>
          <textarea className="address-input address-textarea" name="detailAddress" value={form.detailAddress} onChange={handleChange} placeholder="Street, building, room..." />

          <label className="address-default">
            <input type="checkbox" name="defaultFlag" checked={!!form.defaultFlag} onChange={handleChange} />
            Set as default
          </label>

          {error && <p className="address-error">{error}</p>}

          <button className="address-submit" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
