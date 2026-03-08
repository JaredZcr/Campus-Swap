import { useEffect, useState } from 'react';
import { Upload, User as UserIcon, KeyRound } from 'lucide-react';
import { getUserInfo, updateUserInfo, updatePassword, uploadFile } from '../api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import './ProfilePage.css';

export default function ProfilePage({ onBack }) {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ nickname: '', avatar: '' });
  const [pwd, setPwd] = useState({ oldPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);
  const [changing, setChanging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({ nickname: user.nickname || '', avatar: user.avatar || '' });
  }, [user]);

  const toast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
  };

  const refreshUser = async () => {
    const res = await getUserInfo();
    if (res && res.code === 200 && res.data) setUser(res.data);
  };

  const handleUploadAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // allow re-selecting the same file to trigger onChange
    e.target.value = '';
    setUploading(true);
    try {
      const res = await uploadFile(file);
      if (res.code === 200) {
        const url = res.data;
        setForm((f) => ({ ...f, avatar: url }));
        // Persist immediately so users don't have to click "Save Changes"
        const up = await updateUserInfo({ nickname: form.nickname, avatar: url });
        if (up?.code === 200) {
          await refreshUser();
          toast('Avatar updated');
        } else {
          toast(up?.msg || 'Avatar uploaded (save failed)');
        }
      } else {
        toast(res.msg || 'Upload failed');
      }
    } catch {
      toast('Upload failed');
    }
    setUploading(false);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await updateUserInfo({ nickname: form.nickname, avatar: form.avatar });
      if (res.code === 200) {
        await refreshUser();
        toast('Profile updated');
      } else {
        toast(res.msg || 'Update failed');
      }
    } catch {
      toast('Update failed');
    }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (!pwd.oldPassword || !pwd.newPassword) {
      toast('Please fill in both password fields');
      return;
    }
    setChanging(true);
    try {
      const res = await updatePassword(pwd.oldPassword, pwd.newPassword);
      if (res.code === 200) {
        setPwd({ oldPassword: '', newPassword: '' });
        toast('Password updated');
      } else {
        toast(res.msg || 'Password update failed');
      }
    } catch {
      toast('Password update failed');
    }
    setChanging(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <button className="profile-back" onClick={onBack}>← Back</button>
          <h2 className="profile-title">Account</h2>
        </div>

        <div className="profile-grid">
          <div className="profile-card">
            <div className="profile-card-title"><UserIcon size={18} /> Profile</div>
            <div className="profile-row">
              <div className="profile-avatar-wrap">
                <img
                  className="profile-avatar"
                  src={form.avatar || user?.avatar || 'https://i.pravatar.cc/150?img=1'}
                  alt="avatar"
                />
                <label className="profile-upload-btn">
                  <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload'}
                  <input type="file" accept="image/*" hidden onChange={handleUploadAvatar} />
                </label>
              </div>
              <div className="profile-fields">
                <label className="profile-label">Email / Account</label>
                <div className="profile-readonly">{user?.accountNumber}</div>

                <label className="profile-label">Nickname</label>
                <input
                  className="profile-input"
                  value={form.nickname}
                  onChange={(e) => setForm((f) => ({ ...f, nickname: e.target.value }))}
                  placeholder="Your name"
                />

                <label className="profile-label">Avatar URL</label>
                <input
                  className="profile-input"
                  value={form.avatar}
                  onChange={(e) => setForm((f) => ({ ...f, avatar: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="profile-actions">
              <button className="profile-primary" onClick={handleSaveProfile} disabled={saving || uploading}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          <div className="profile-card">
            <div className="profile-card-title"><KeyRound size={18} /> Security</div>
            <label className="profile-label">Current password</label>
            <input
              className="profile-input"
              type="password"
              value={pwd.oldPassword}
              onChange={(e) => setPwd((p) => ({ ...p, oldPassword: e.target.value }))}
              placeholder="••••••••"
            />
            <label className="profile-label">New password</label>
            <input
              className="profile-input"
              type="password"
              value={pwd.newPassword}
              onChange={(e) => setPwd((p) => ({ ...p, newPassword: e.target.value }))}
              placeholder="••••••••"
            />
            <div className="profile-actions">
              <button className="profile-primary" onClick={handleChangePassword} disabled={changing}>
                {changing ? 'Updating...' : 'Update Password'}
              </button>
            </div>
            <div className="profile-hint">Tip: you may need to sign in again on other devices after changing your password.</div>
          </div>
        </div>
      </div>

      {showToast && <Toast message={toastMsg} onClose={() => setShowToast(false)} />}
    </div>
  );
}
