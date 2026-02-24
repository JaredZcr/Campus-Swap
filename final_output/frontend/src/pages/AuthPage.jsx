import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userLogin, userSignIn } from '../api';
import './AuthPage.css';

export default function AuthPage({ onClose }) {
  const { setUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ accountNumber: '', userPassword: '', nickname: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      let res;
      if (isLogin) {
        res = await userLogin(form.accountNumber, form.userPassword);
      } else {
        res = await userSignIn({ accountNumber: form.accountNumber, userPassword: form.userPassword, nickname: form.nickname || form.accountNumber });
      }
      if (res.code === 200) {
        setUser(res.data);
        onClose();
      } else {
        setError(res.msg || 'Operation failed');
      }
    } catch {
      setError('Network error. Make sure the backend is running.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>×</button>
        <h2 className="auth-title">{isLogin ? 'Sign In' : 'Create Account'}</h2>

        <div className="auth-form">
          {!isLogin && (
            <input
              className="auth-input"
              name="nickname"
              placeholder="Nickname"
              value={form.nickname}
              onChange={handleChange}
            />
          )}
          <input
            className="auth-input"
            name="accountNumber"
            placeholder="Account (phone or email)"
            value={form.accountNumber}
            onChange={handleChange}
          />
          <input
            className="auth-input"
            name="userPassword"
            type="password"
            placeholder="Password"
            value={form.userPassword}
            onChange={handleChange}
          />
          {error && <p className="auth-error">{error}</p>}
          <button className="auth-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Register'}
          </button>
        </div>

        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button className="auth-switch-btn" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
