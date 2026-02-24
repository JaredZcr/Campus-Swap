import { createContext, useContext, useState, useEffect } from 'react';
import { getUserInfo, userLogout } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserInfo()
      .then((res) => {
        if (res && res.code === 200 && res.data) {
          setUser(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    try { await userLogout(); } catch {}
    setUser(null);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
